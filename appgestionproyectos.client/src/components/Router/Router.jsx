import React, { Component, useEffect, useContext, useState, useCallback } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Login from '../Login/Login';
import Workspace from '../Workspace/Workspace';
import Register from '../Register/Register';
import ErrorView from '../Error/Error';
import Project from '../Project/Project';
import { RefreshToken, AuthRequest } from '../../Utils/Authorization';
//import { Context } from '../../App';
import Sidebar from '../SideBar/SideBar'
import styles from '../../App.module.css';
import { ToastContainer } from 'react-toastify';
import { ProtectedRoute, Protected } from '../Protected';
export const Context = React.createContext();
function Router({ handleWorkspaceSelection }) {
    //const { user, setUser, selectedWorkspace, setSelectedWorkspace } = useContext(Context);
    const navigate = useNavigate();

    //const [token, setToken] = useState(() => {
    //    let localAT = localStorage.getItem("aT");
    //    if (localAT == null) {
    //        navigate("/login");
    //    } else {
    //        return localAT;
    //    }
    //});
    //const [user, setUser] = useState(() => {
    //    let arrayToken = "";
    //    let tokenPayload = {};
    //    console.log("token listo", token);
    //    if (token != null) {
    //        arrayToken = token.split('.');
    //        tokenPayload = JSON.parse(atob(arrayToken[1]));
    //        return tokenPayload;
    //    }
    //    navigate("/login");
    //});
    const [globalUser, setGlobalUser] = useState();
    const [globalWorkspace, setGlobalWorkspace] = useState(() => {
        AuthRequest(`/api/WEnvironment/getWEnvironments`, 'get').
            then((res) => {
                console.log("setting global workspace")
                setGlobalWorkspace(res.data.data[0].id);
            }).
            catch((err) => {
                console.error(err);
                if (err.status == 401) {
                    navigate("/login");

                }
            });
    });
    const [globalUserProjects, setGlobalUserProjects] = useState([]);
    useEffect(() => {
        try {
            if (globalWorkspace != null) {
                console.log(globalWorkspace, "GLOBAL WORKSPACE")
                //let parsedSelectWorkSpc = JSON.parse(globalWorkspace);
                //console.log(parsedSelectWorkSpc, "Sidebar selected workspace parsed");
                //console.log(selectedWorkspace, "Sidebar selected workspace");
                AuthRequest(`/api/Project/getProjects?workspace=${globalWorkspace}`, 'get').
                    then((res) => {
                        console.log("getprojects",res);
                        const proj = res.data.data;
                        proj.map((project, i) => {
                            project.project_id = project.id;
                            project.route = `/p/${project.public_id}`
                            project.id = `p-${i}`;
                            project.public_id = `${project.public_id}`
                        })
                        //console.log("projects obtenidos", proj)
                        console.log("globalUserProject UseEffect", proj)
                        setGlobalUserProjects(proj)

                    }).
                    catch((err) => {
                        //console.error(err.status);
                        if (err.status == 401) {
                            navigate("/login");
                        }
                    });
            }


        } catch (Exception) {
            console.error(Exception);
        }
    }, [globalWorkspace]);

    const RefreshProjects = useCallback(() => {
        if (globalWorkspace == null) return;
        AuthRequest(`/api/Project/getProjects?workspace=${globalWorkspace}`, 'get')
            .then((res) => {
                const proj = res.data.data;
                proj.map((project, i) => {
                    project.project_id = project.id;
                    project.route = `/p/${project.public_id}`;
                    project.id = `p-${i}`;
                    project.public_id = `${project.public_id}`
                });
                setGlobalUserProjects(proj);
            })
            .catch((err) => {
                if (err.status === 401) navigate("/login");
            });
    }, [globalWorkspace]);
    //const handleSelectionParent = (event) => {
    //    handleWorkspaceSelection(event);
    //}

    return (
        <Context.Provider value={{ globalUser, setGlobalUser, globalWorkspace, setGlobalWorkspace, globalUserProjects, setGlobalUserProjects, RefreshProjects }} >
            <React.Fragment>
                <div className={styles["app-wrapper"]}>
                    <ToastContainer
                        hideProgressBar
                        draggable
                    />
                    <Protected>
                        <Sidebar
                        //user={user}
                        //workspace={selectedWorkspace}
                        />
                    </Protected>

                    <div className={styles["main-wrapper"]}>
                        {/*<div>*/}
                        {/*<div className={styles.main}>*/}
                        <Routes>
                            <Route exact path="/Login" element={<Login />} />
                            <Route exact path="/Register" element={<Register />} />
                            <Route exact path="*" element={<ErrorView />} />
                            {/*<div className={styles["main-wrapper"]}>*/}
                            <Route element={<ProtectedRoute />}>
                                <Route exact path="/" element={<Workspace />} />
                                <Route exact path="/Project/" element={<Project />} />
                                <Route path="/p/:public_id" element={<Project />} />
                            </Route>
                            {/*</div>*/}



                            {/*<Route  element={<ProtectedRoute />} >*/}

                            {/*</Route>*/}

                        </Routes>
                        {/*</div>*/}
                    </div>
                </div>
            </React.Fragment>
        </Context.Provider>
    );

}

export default Router;