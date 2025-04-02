import { useEffect, useState } from 'react';
//import './App.css';
//import './assets/css/styles.css'
import SideBar from './components/SideBar/SideBar';
import Router from './components/Router/Router';

import axios from 'axios';


function App() {
    const [mail, setMail] = useState("");
    //axios.get('google.es')
    //    .then(function (response) {
    //        // handle success
    //        console.log("success");
    //        console.log(response);
    //    })
    //    .catch(function (error) {
    //        // handle error
    //        console.log("error");

    //        console.log(error);
    //    })
    //    .finally(function () {
    //        // always executed
    //    });
    //if (mail != "") {
    
    return (
        <div>
            <Router />
        </div>
    );
    //}

}
export default App;