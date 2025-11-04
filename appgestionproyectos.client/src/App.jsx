import styles from './App.module.css';
import { BrowserRouter } from 'react-router-dom';
import Router from './components/Router/Router';
import axios from 'axios';
import React, { useEffect, useState, useCallback } from 'react';
//import { RefreshToken, AuthRequest } from './Utils/Authorization';
//import { useNavigate, useLocation } from 'react-router-dom';
//import Sidebar from './Components/SideBar/SideBar'
//import { Notify } from './Utils/Notifications';
//import { ToastContainer } from 'react-toastify';
//import Workspace from './components/Workspace/Workspace';
//export const Context = React.createContext();
function App() {
    //const navigate = useNavigate();

    //const [selectedWorkspace, setSelectedWorkspace] = useState(() => {
    //    //setSelectedWorkspace(JSON.parse(localStorage.getItem("worksp")))
    //    AuthRequest(`WEnvironment/getWEnvironments?fields=${user.sub}`, 'get').
    //        then((res) => {
    //            //setWEnvironments(res.data.data);
    //            if (localStorage.getItem("worksp") == null) {
    //                //setSelectedWorkspace(res.data.data[0])
    //                //console.log(selectedWorkspace);
    //                localStorage
    //                    .setItem(
    //                        "worksp",
    //                        JSON.stringify(res.data.data[0])
    //                    );
    //            }
    //            console.log(res.data.data[0]);
    //            return res.data.data[0];
    //        }).
    //        catch((err) => {
    //            console.error(err.status);
    //            if (err.status == 401) {
    //                navigate("/login");

    //            }
    //        });
    //    //console.log("selected workspace", selectedWorkspace);
    //});


    //const handleSelection = (wspace) => {
    //    setSelectedWorkspace(wspace);
    //}
    return (

        <BrowserRouter basename="/app1/">
            <Router />
        </BrowserRouter>
        //{
        //<Context.Provider value={{ user, setUser, selectedWorkspace, setSelectedWorkspace }} >
        //    <BrowserRouter>
        //        <div className={styles["app-wrapper"]}>
        //            <ToastContainer
        //                hideProgressBar
        //                draggable
        //            />
        //            {
        //                //si no se comprueba selectedWorkspace se carga el sidebar sin haber workspace
        //                selectedWorkspace != undefined &&
        //                <Sidebar
        //                    user={user}
        //                    workspace={selectedWorkspace}
        //                />
        //            }


        //            <div className={styles["main-wrapper"]}>
        //                <div className={styles.main}>
        //                    <Router

        //                    />
        //                </div>
        //            </div>



        //        </div>
        //    </BrowserRouter>


        //</Context.Provider>


        //}


    );
    //}

}

export default App;