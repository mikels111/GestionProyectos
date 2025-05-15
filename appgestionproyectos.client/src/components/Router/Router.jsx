import React, { Component, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Login from '../Login/Login';
import Dashboard from '../Dashboard/Dashboard';
import Register from '../Register/Register';
import ErrorView from '../Error/Error';
import { RefreshToken, AuthRequest } from '../../Utils/Authorization';
function Router({user}) {
    const navigate = useNavigate();
    
    //useEffect(() => {
    //    console.log("useeffect");
    //    AuthRequest('project/get').
    //        then((res) => {
    //            console.log("reqResult:", res);
    //            console.log("success:", res.data.success)
    //            console.log("message", res.data.message)

    //            if (res.data.success == true &&
    //                res.data.message == "tokens-refreshed") {
    //                AuthRequest('project/get').
    //                    then((res) => {
    //                        console.log("project/get reintentado", res);
    //                    }).
    //                    catch((err) => {
    //                        console.log("project/get fallo", err);
    //                    });
    //            }
    //        }).
    //        catch((err) => {
    //            console.error(err);
    //            navigate("/login");
    //        });
    //}, []);

    return (
        <Routes>
            <Route path="/Login" element={<Login />} />
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/Error" element={<ErrorView />} />
            <Route path="/" element={<h2>Hello {user.Name}</h2>} />
        </Routes>
    );

}

export default Router;