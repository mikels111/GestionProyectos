import React, { useEffect, useState } from 'react';
import { AuthRequest } from '../../Utils/Authorization';
import { useNavigate, useLocation } from 'react-router-dom';
import './Dashboard.css';
import Sidebar from '../SideBar/SideBar'
import { Notify } from '../../Utils/Notifications';
import { ToastContainer } from 'react-toastify';
function Workspace({ selectWorkspace }) {
    const navigate = useNavigate();
    const user = "mikelseara25@gmail.com";
    const [wEnvironments, setWEnvironments] = useState([]);
    const [selected, setSelected] = useState();
    //const location = useLocation();
    //const [user, setUser] = useState({});
    //const { warn, info } = Notify();

    //useEffect(() => {
    //    const token = localStorage.getItem("aT");
    //    const arrayToken = token.split('.');
    //    const tokenPayload = JSON.parse(atob(arrayToken[1]));
    //    setUser(tokenPayload);
    //}, []);
    const styles1 = {
        "display": "flex",
        "alignItems": "flex-start",
        "alignContent": "flex-start",
        "gap": "33px 35px",
        "flexWrap": "wrap"
    }
    const styles2 = {
        "borderRadius": "5px",
        "border": "0.5px solid #000",
        "width": "180px",
        "height": "50px"
    }
    const select = (e) => {
        console.log("desde workspace", e.target.value);
        const workspace = wEnvironments.find(w => w.name === selectedId);
        //console.log(workspace);
        selectWorkspace(workspace);
    }

    useEffect(() => {
        AuthRequest(`WEnvironment/getWEnvironments?fields=${user}`, 'get').
            then((res) => {
                console.log("reqResult:", res);
                console.log("success:", res.data.success)
                console.log("message", res.data.data)
                setWEnvironments(res.data.data);

            }).
            catch((err) => {
                console.error(err.status);
                if (err.status == 401) {
                    navigate("/login");

                }
            });
    }, []);

    return (
        <React.Fragment>
            <form>
                <WorkspaceSelection workEnv={wEnvironments} selected={select} />
            </form>
            <div style={styles1}>
                <div style={styles2}></div>
            </div>
        </React.Fragment>

    );


}
function WorkspaceSelection({ workEnv, selected }) {
    //const first = refer == 1 ? 'selected' : '';
    const [selectedValue, setSelectedValue] = useState();
    useEffect(() => {
        console.log("selected value",JSON.stringify(workEnv))
        if (workEnv.length > 0) {
            setSelectedValue(JSON.stringify(workEnv[1]));
        }
    }, [workEnv]);
    return (
        <select onChange={selected} defaultValue={selectedValue}>

            {
                workEnv.length > 0 &&
                workEnv.map((wEnv, i) => {
                    wEnv.reference = i;
                    return <option key={i} value={JSON.stringify(wEnv)}>{wEnv.name}</option>
                })
            }
        </select >



    );
}
export default Workspace;