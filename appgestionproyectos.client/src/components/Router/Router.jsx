import React, { Component } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../Login/Login';
import Dashboard from '../Dashboard/Dashboard';
class Router extends Component {
    render() {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path="/Login" element={<Login />} />
                    <Route path="/Dashboard" element={<Dashboard />} />

                </Routes>
            </BrowserRouter>
        );
    }
}

export default Router;