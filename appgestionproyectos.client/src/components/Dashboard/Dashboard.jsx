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
            console.log("success:", res.data.success)
            console.log("message", res.data.message)

            if (res.data.success == true &&
                res.data.message == "tokens-refreshed") {
                AuthRequest('project/get').
                    then((res) => {
                        console.log("project/get reintentado", res);
                    }).
                    catch((err) => {
                        console.log("project/get fallo", err)

                    });
            }
        }).
        catch((err) => {
            console.error(err);
            navigate("/login");
        });


    return (
        <div>
            <h2>dashboard</h2>
        </div>
    );


}
export default Dashboard;