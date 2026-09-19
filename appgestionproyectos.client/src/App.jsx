import styles from './App.module.css';
import { BrowserRouter } from 'react-router-dom';
import Router from './components/Router/Router';
import axios from 'axios';
import React, { useEffect, useState, useCallback } from 'react';
function App() {
    
    return (
        <BrowserRouter>
            <Router />
        </BrowserRouter>
    );
    

}

export default App;