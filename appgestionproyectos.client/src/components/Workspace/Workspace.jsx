import React, { useEffect, useState, useContext } from 'react';
import { AuthRequest } from '../../Utils/Authorization';
import { useNavigate, useLocation } from 'react-router-dom';
import './Dashboard.css';
import Sidebar from '../SideBar/SideBar'
import { Notify } from '../../Utils/Notifications';
import { ToastContainer } from 'react-toastify';
import { Context } from '../Router/Router';
function Workspace() {
    const { selectedWorkspace, setSelectedWorkspace } = useContext(Context);
    const navigate = useNavigate();
    const [wEnvironments, setWEnvironments] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    useEffect(() => {
        //console.log("selelc", selectedWorkspace)
    }, []);
    //const user = "mikelseara25@gmail.com";
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
        console.log("workspace: ", selectedWorkspace);
        try {
            const selectedId = parseInt(e.target.value, 10);
            if (selectedId != undefined) {
                const workspace = wEnvironments.find(w => w.id === selectedId);
                setSelectedWorkspace(workspace)
                localStorage
                    .setItem(
                        "worksp",
                        JSON.stringify(workspace)
                    );
            }
        } catch (exception) {
            console.error(exception)
        }
    }

    useEffect(() => {
        //console.log("usuario", user);
        //setSelectedWorkspace(JSON.parse(localStorage.getItem("worksp")))
        AuthRequest(`WEnvironment/getWEnvironments`, 'get').
            then((res) => {
                setWEnvironments(res.data.data);
                if (localStorage.getItem("worksp") == null) {
                    setSelectedWorkspace(res.data.data[0])
                    //console.log(selectedWorkspace);
                    localStorage
                        .setItem(
                            "worksp",
                            JSON.stringify(res.data.data[0])
                        );
                }


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
            <h2>{selectedWorkspace}</h2>
            <form>
                <WorkspaceSelection workEnv={wEnvironments} selected={select} />
            </form>
            <div style={styles1}>
                {/*<div style={styles2}></div>*/}
            </div>
        </React.Fragment>

    );


}
function WorkspaceSelection({ workEnv, selected }) {
    //const first = refer == 1 ? 'selected' : '';
    const [selectedValue, setSelectedValue] = useState();
    useEffect(() => {
        if (workEnv.length > 0) {
            //console.log("selected value1", JSON.stringify(workEnv[0]))
            selected(JSON.stringify(workEnv[0]));
            setSelectedValue(JSON.stringify(workEnv[0]));
        }
    }, [workEnv]);
    return (
        <>
            {
                localStorage.getItem("worksp") != null && localStorage.getItem("worksp") != undefined &&
                <select onChange={selected} value={JSON.parse(localStorage.getItem("worksp")).id}>

                    {
                        workEnv.length > 0 &&
                        workEnv.map((wEnv, i) => {
                            wEnv.reference = i;
                            return <option key={i} value={wEnv.id}>{wEnv.name}</option>
                        })
                    }
                </select >
            }

        </>
    );
}
export default Workspace;