import React, { Component } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../Login/Login';
import Dashboard from '../Dashboard/Dashboard';
import Register from '../Register/Register';
class Router extends Component {
    render() {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path="/Login" element={<Login />} />
                    <Route path="/Dashboard" element={<Dashboard />} />
                    <Route path="/Register" element={<Register />} />

                </Routes>
            </BrowserRouter>
        );
    }
}

export default Router;