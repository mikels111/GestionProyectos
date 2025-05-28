import styles from './App.module.css';
import { BrowserRouter } from 'react-router-dom';
import Router from './components/Router/Router';
import axios from 'axios';
import { React, useEffect, useState } from 'react';
import { RefreshToken, AuthRequest } from './Utils/Authorization';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Components/SideBar/SideBar'
import { Notify } from './Utils/Notifications';
import { ToastContainer } from 'react-toastify';
import Workspace from './components/Workspace/Workspace';

function App() {
    const [user, setUser] = useState({});
    const { warn, info } = Notify();
    const [selectedWorkspace, setSelectedWorkspace] = useState();
    useEffect(() => {
        const token = localStorage.getItem("aT");
        console.log("app UseEffect")
        if (token != null) {
            const arrayToken = token.split('.');
            const tokenPayload = JSON.parse(atob(arrayToken[1]));
            setUser(tokenPayload);
        }
    }, []);
    const handleSelection = (wspace) => {
        //console.log(wspace, "selection from app");
        setSelectedWorkspace(wspace);
    }

    return (
        <BrowserRouter>
            <div className={styles["app-wrapper"]}>
                <ToastContainer
                    hideProgressBar
                    draggable
                />
                <Sidebar
                    user={user}
                    workspace={selectedWorkspace}
                />
                <div className={styles["main-wrapper"]}>
                    <div className={styles.main}>
                        <Router
                            user={user}
                            handleWorkspaceSelection={handleSelection}
                        />
                    </div>
                </div>
            </div>
        </BrowserRouter>
    );
    //}

}
export default App;