import { React, useEffect, useState } from 'react';
import { RefreshToken, AuthRequest } from '../../Utils/Authorization';
import { useNavigate, useLocation } from 'react-router-dom';
import './Dashboard.css';
import Sidebar from '../SideBar/SideBar'
import { Notify } from '../../Utils/Notifications';
import { ToastContainer } from 'react-toastify';
function Dashboard() {
    const navigate = useNavigate();
    //const location = useLocation();
    //const [user, setUser] = useState({});
    //const { warn, info } = Notify();

    //useEffect(() => {
    //    const token = localStorage.getItem("aT");
    //    const arrayToken = token.split('.');
    //    const tokenPayload = JSON.parse(atob(arrayToken[1]));
    //    setUser(tokenPayload);
    //}, []);
    useEffect(() => {
        AuthRequest('project/get').
            then((res) => {
                console.log("reqResult:", res);
                console.log("success:", res.data.success)
                console.log("message", res.data.message)

                if (res.data.success == true &&
                    res.data.message == "tokens-refreshed") {
                    AuthRequest('project/get').
                        then((res) => {
                            console.log("project/get reintentado", res);
                        }).
                        catch((err) => {
                            console.log("project/get fallo", err);
                        });
                }
            }).
            catch((err) => {
                console.error(err);
                navigate("/login");
            });
    }, []);



    return (
        <h2>Dashboard</h2>
    );


}
export default Dashboard;