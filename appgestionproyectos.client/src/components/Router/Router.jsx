import React, { Component } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../Login/Login';
class Router extends Component {
    render() {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path="/Login" element={<Login />} />
                </Routes>
            </BrowserRouter>
        );
    }
}

export default Router;