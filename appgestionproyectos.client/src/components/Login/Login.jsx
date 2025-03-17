import { useState, useEffect } from 'react'
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import './Login.css'
function Login() {

    const [user, setUser] = useState([]);
    const [profile, setProfile] = useState([]);
    const [mailConfirmed, setmailConfirmed] = useState(false);
    const [showCodeInput, setShowCodeInput] = useState(false);

    const googleLogin = useGoogleLogin({
        onSuccess: (codeResponse) => {
            console.log("codeResponse", codeResponse);
            console.log(codeResponse.access_token);
            axios.post(`https://localhost:7233/user/LoginUserGoogle`,
                null,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        token: codeResponse.access_token
                    }
                })
                .then((res) => {
                    setProfile(res.data);
                    console.log("setProfile: ");
                    console.log(res.data);
                })
                .catch((err) => console.log(err))
        },
        onError: (error) => console.log('Login Failed:', error)
    });

    const logear = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const jsonFormData = Object.fromEntries(formData.entries());
        axios.post(`https://localhost:7233/auth/MailAuth`,
            jsonFormData,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((res) => {
                switch (res.status) {
                    case 200:
                        console.log("mensaje: " + res.data.message);
                        let messg = res.data.message;
                        switch (messg) {
                            case "access-granted":

                                break;
                            case "show-passInput":
                                setmailConfirmed(true);
                                break;
                            case "show-codeInput":
                                setShowCodeInput(true);
                                break;
                        }
                        break;
                    case 400:
                        break;
                    case 401:
                        break;
                    case 500:
                        break;
                }

                setProfile(res.data);
                console.log("setProfile: ");
                console.log(res.data);
            })
            .catch((err) => console.log(err))

    };
    const confirmCode = (e) => {
        e.preventDefault();
    }

    return (

        <div>

            <div className="">
                {showCodeInput ? (
                    <form onSubmit={confirmCode} key="codeForm">
                        <div className="input-container">
                            <label>Code </label>
                            <input type="text" name="CodeInput" id="code" required />
                        </div>

                        <button id="button-confirm">
                            go
                        </button>
                    </form>
                ) : (
                    <form onSubmit={logear} key="mailForm">

                        <div className="input-container" style={{ display: mailConfirmed ? "none" : "initial" }}>
                            <label>Username </label>
                            <input type="text" name="MailInput" id="mail" required />

                        </div>

                        {mailConfirmed &&
                            <div className="input-container">
                                <label>Password </label>
                                <input type="password" name="PassInput" id="password" required />
                            </div>
                        }
                        <button id="button-confirm">
                            go
                        </button>
                    </form>
                )}




            </div>
            {profile.length > 0 ? (
                <div>
                    <img src={profile.picture} alt="user image" />
                    <h3>User Logged in</h3>
                    <p>Name: {profile.name}</p>
                    <p>Email Address: {profile.email}</p>
                    <br />
                    <br />
                </div>
            ) : (
                <button onClick={() => googleLogin()}>Sign in with Google</button>
            )}
            {/*<div id="g_id_onload"*/}
            {/*    data-client_id="765808157277-f5ktben8g1a5tflgbh9f0pi2tvdv68ih.apps.googleusercontent.com"*/}
            {/*    data-callback="handleCredentialResponse">*/}
            {/*</div>*/}
            {/*<div className="g_id_signin" data-type="standard"></div>*/}
        </div >

    );

}


export default Login;