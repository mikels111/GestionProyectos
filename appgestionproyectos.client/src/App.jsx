import { useEffect, useState } from 'react';
//import './App.css';
import SideBar from './components/SideBar/SideBar';

import axios from 'axios';
import Login from './components/Login/Login';

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
            <Login/>
        </div>
    );
    //}

}
export default App;