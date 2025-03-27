import { React, Component, useEffect } from 'react';
import { RefreshToken, AuthRequest } from '../../Utils/Authorization';
import { useNavigate } from 'react-router-dom';
function Dashboard() {
    const navigate = useNavigate();
    useEffect(() => {

    }, []);
    AuthRequest('project/get').
        then((res) => {
            console.log("reqResult:", res);
            if (res.data.success == true) {
                alert("success");
            }
        }).
        catch((err) => {
            console.error(err);
            navigate("/login");
        });


    //
    return (
        <div>
            <h2>dashboard</h2>
        </div>
    );


}
export default Dashboard;