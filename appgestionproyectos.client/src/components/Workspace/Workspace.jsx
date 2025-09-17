import React, { useEffect, useState, useContext } from 'react';
import { AuthRequest } from '../../Utils/Authorization';
import { useNavigate, useLocation } from 'react-router-dom';
//import './Dashboard.css';
import Sidebar from '../SideBar/SideBar'
import { Notify } from '../../Utils/Notifications';
import { ToastContainer } from 'react-toastify';
import { Context } from '../Router/Router';
import styles from './Workspace.module.css';
function Workspace() {
    const { globalWorkspace, setGlobalWorkspace } = useContext(Context);
    const navigate = useNavigate();
    const [wEnvironments, setWEnvironments] = useState([]);
    const [selectedId, setSelectedId] = useState("");
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
    const selected = (e) => {
        //console.log("workspace: ", selectedWorkspace);
        console.log(e.target, "target")
        try {
            if (e.target != undefined) {
                const selectedId = parseInt(e.target.value, 10);
                const workspace = wEnvironments.find(w => w.id === selectedId);
                console.log(workspace.id, "workspace");
                //setSelectedWorkspace(workspace)
                setGlobalWorkspace(workspace.id)
                //localStorage
                //    .setItem(
                //        "worksp",
                //        JSON.stringify(workspace)
                //    );
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
                    //console.log("setting workspace")
                    //setSelectedWorkspace(res.data.data[0])
                    //console.log(selectedWorkspace);
                    //localStorage
                    //    .setItem(
                    //        "worksp",
                    //        JSON.stringify(res.data.data[0])
                    //    );
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
        //<React.Fragment>
            <div className={styles["content-wrapper"]}>
                <form>
                    {/*{JSON.parse(localStorage.getItem("worksp")).id*/}
                    {/*<WorkspaceSelection workEnv={wEnvironments} selected={select} />*/}
                    {
                        //localStorage.getItem("worksp") != null && localStorage.getItem("worksp") != undefined &&
                        <select onChange={selected} value={globalWorkspace}>
                            {
                                wEnvironments.length > 0 &&
                                wEnvironments.map((wEnv, i) => {
                                    wEnv.reference = i;
                                    return <option key={i} value={wEnv.id}>{wEnv.name}</option>
                                })
                            }
                        </select >
                    }
                </form>
                <div style={styles1}>
                    {/*<div style={styles2}></div>*/}
                </div>
            </div>

        //</React.Fragment>
    );


}
function WorkspaceSelection({ workEnv, selected }) {
    //const first = refer == 1 ? 'selected' : '';
    const [selectedValue, setSelectedValue] = useState();
    //console.log(selected,"selected")
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