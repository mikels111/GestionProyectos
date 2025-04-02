import { useState, useEffect } from 'react'
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

function Login() {
    const navigate = useNavigate();
    useEffect(() => {
        const refreshToken = localStorage
            .getItem("refreshToken");
        if (refreshToken != null) {
            navigate("/dashboard");
        }
    }, []);
    const [user, setUser] = useState({
        mail: ""
    });
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
        //console.log(jsonFormData);
        axios.post(`https://localhost:7233/auth/MailAuth`,
            jsonFormData,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((res) => {
                if (res.status == 200) {
                    let messg = res.data.message;
                    switch (messg) {
                        case "access-granted":
                            console.log("access-granted");
                            localStorage
                                .setItem(
                                    "accessToken",
                                    res.data.data.accessToken
                                );
                            localStorage
                                .setItem(
                                    "refreshToken",
                                    res.data.data.refreshToken
                                );
                            navigate("/dashboard");
                            break;
                        case "show-passInput":
                            setmailConfirmed(true);
                            break;
                        case "show-codeInput":
                            setShowCodeInput(true);
                            break;
                        default:
                            console.log("Error en el servidor");
                            break;
                    }
                    setUser({ user, mail: jsonFormData.Mail });
                }
            })
            .catch((err) => {
                switch (err.status) {
                    case 400:
                        console.log("bad request");
                        break;
                    case 401:
                        console.log("unauthorized");
                        break;
                    case 500:
                        console.log("server error", err);
                        break;
                }
            })

    };

    const confirmCode = (e) => {
        //mandar peticion a /verify con el codigo introducido y el mail guardado en state
        e.preventDefault();
        const formData = new FormData(e.target);
        const jsonFormData = Object.fromEntries(formData.entries());
        jsonFormData['Mail'] = user.mail;
        axios.post(`https://localhost:7233/auth/verify`,
            jsonFormData,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((res) => {
                if (res.status == 200) {
                    localStorage.setItem("accessToken", res.data.data.accessToken);
                    localStorage.setItem("refreshToken", res.data.data.refreshToken);
                    navigate("/dashboard");
                } else {
                    console.log(res.data.message);
                }
            })
            .catch((err) => {
                switch (err.status) {
                    case 400:
                        console.log(err.response.data.message);

                        break;
                    case 401:
                        console.log(err.response.data.message);
                        break;
                    case 500:
                        console.log(err.response.data.message);
                        break;
                }
            })

    }


    return (
        <div id="login-frame">
            <h1>Login</h1>
            {showCodeInput && user.mail != null ? (
                <form className="email-form" onSubmit={confirmCode} key="codeForm">
                    <div className="input-container">
                        <label>Code </label>
                        <input type="text" name="Code" id="code" required />
                    </div>

                    <button className="button-confirm">
                        Go
                    </button>
                </form>
            ) : (
                <form className="email-form" onSubmit={logear} key="mailForm">

                    <div className="input-container" style={{ display: mailConfirmed ? "none" : "flex" }}>
                        <label className="input-label">Username</label>
                        <input type="text" name="Mail" id="mail" required />

                    </div>

                    {mailConfirmed &&
                        <div className="input-container">
                            <label className="input-label">Password </label>
                            <input type="password" name="Pass" id="password" required />
                        </div>
                    }
                    <button className="button-confirm">
                        Go
                    </button>
                </form>
            )}

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