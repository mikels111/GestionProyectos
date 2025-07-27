import React, { Component, useEffect, useContext, useState } from "react";
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
import { ProtectedRoute,Protected } from '../Protected';
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
    const [globalWorkspace, setGlobalWorkspace] = useState();

    //const handleSelectionParent = (event) => {
    //    handleWorkspaceSelection(event);
    //}

    return (
        <Context.Provider value={{ globalUser, setGlobalUser, globalWorkspace, setGlobalWorkspace }} >
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
                        <div className={styles.main}>
                            <Routes>
                                <Route exact path="/Login" element={<Login />} />
                                <Route exact path="/Register" element={<Register />} />
                                <Route exact path="*" element={<ErrorView />} />

                                <Route element={<ProtectedRoute />}>
                                    <Route exact path="/" element={<Workspace />} />
                                    <Route exact path="/Project/:projectId" element={<Project />} />
                                </Route>
                                {/*<Route  element={<ProtectedRoute />} >*/}
                                    
                                {/*</Route>*/}

                            </Routes>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        </Context.Provider>
    );

}

export default Router;