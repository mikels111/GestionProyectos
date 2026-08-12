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
import ProjectsGrid from '../Projects/ProjectsGrid'
import Stock from '../Stock/Stock';
import { ToastContainer } from 'react-toastify';
import { ProtectedRoute, Protected } from '../Protected';
export const Context = React.createContext();
function Router({ handleWorkspaceSelection }) {
    const navigate = useNavigate();
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
    const [sideBarActive, setSideBarActive] = useState(true);


    useEffect(() => {
        try {
            if (globalWorkspace != null) {
                console.log(globalWorkspace, "GLOBAL WORKSPACE")
                AuthRequest(`/api/Project/getProjects?workspace=${globalWorkspace}`, 'get').
                    then((res) => {
                        console.log("getprojects", res);
                        const proj = res.data.data;
                        proj.map((project, i) => {
                            project.project_id = project.id;
                            project.route = `/p/${project.public_id}`
                            project.id = `p-${i}`;
                            project.public_id = `${project.public_id}`
                        })
                        console.log("globalUserProject UseEffect", proj)
                        setGlobalUserProjects(proj)

                    }).
                    catch((err) => {
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

    return (
        <Context.Provider value={{
                globalUser,
                setGlobalUser,
                globalWorkspace,
                setGlobalWorkspace,
                globalUserProjects,
                setGlobalUserProjects,
                RefreshProjects,
                sideBarActive,
                setSideBarActive
            }}>
            <React.Fragment>
                <div className={styles["app-wrapper"]}>
                    <ToastContainer
                        hideProgressBar
                        draggable
                    />
                    <Protected>
                        <Sidebar />
                    </Protected>

                    <div className={styles["main-wrapper"]}>
                        <Routes>
                            <Route exact path="/Login" element={<Login />} />
                            <Route exact path="/Register" element={<Register />} />
                            <Route exact path="*" element={<ErrorView />} />
                            <Route element={<ProtectedRoute />}>
                                <Route exact path="/" element={<Workspace />} />
                                <Route exact path="/projects/" element={<ProjectsGrid />} />
                                <Route path="/p/:public_id" element={<Project />} />
                                <Route path="/stock" element={<Stock />} />
                            </Route>
                        </Routes>
                    </div>
                </div>
            </React.Fragment>
        </Context.Provider>
    );

}

export default Router;
