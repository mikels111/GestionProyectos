import React, { useState, useEffect, useContext } from 'react'
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import { verifyMailFunction } from '../../Utils/Verification';
import { Notify } from '../../Utils/Notifications';
import { ToastContainer } from 'react-toastify';
import Loader from '../../Utils/Loader';
//import { Context } from '../../App';
function Login() {
    //const { user, setUser, accessToken, setAccessToken, refreshToken, setRefreshToken } = useContext(Context);
    const navigate = useNavigate();
    const { warn, info } = Notify();
    useEffect(() => {
        const refreshToken = localStorage
            .getItem("rT");
        //console.log("refreshtoken", refreshToken)
        if (refreshToken != null) {
            //navigate("/");
        }
    }, []);

    const [mail, setMail] = useState({
        mail: ""
    });
    const importantStyle = {
        textDecoration: "underline",
        fontWeight: "bold"
    };
    const [profile, setProfile] = useState([]);
    const [mailConfirmed, setmailConfirmed] = useState(false);
    const [showCodeInput, setShowCodeInput] = useState(false);
    const [codeCountDown, setCodeCountDown] = useState(0);
    const [forgotPass, setForgotPass] = useState(false);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const interval = setInterval(() => {
            setCodeCountDown(prev => {
                if (prev > 0) {
                    return prev - 1;
                } else {
                    clearInterval(interval);
                    return 0;
                }
            });
        }, 1000);

        // Limpia el intervalo
        return () => clearInterval(interval);
    }, [codeCountDown]);


    const googleLogin = useGoogleLogin({
        onSuccess: (codeResponse) => {
            console.log("response", codeResponse);
            axios.post(`https://localhost:7233/user/LoginUserGoogle`,
                null,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        token: codeResponse.access_token
                    }
                })
                .then((res) => {
                    if (res.status == 200) {
                        let messg = res.data.message;

                        if (messg == "access-granted") {
                            //localStorage
                            //    .setItem(
                            //        "aT",
                            //        res.data.data.accessToken
                            //    );
                            //localStorage
                            //    .setItem(
                            //        "rT",
                            //        res.data.data.refreshToken
                            //    );
                            window.location.href = "/"; 
                        }
                        //messg === "show-codeInput"
                        setShowCodeInput(true);
                        setCodeCountDown(59);
                        //setUser({ user, mail: jsonFormData.Mail });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    warn("We’re having technical issues. Please try again later.");
                })
        },
        onError: (error) => {
            console.log('Login Failed:', error);
            warn("We’re having technical issues. Please try again later.");
        }
    });
    const login = (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);
        const jsonFormData = Object.fromEntries(formData.entries());
        console.log(jsonFormData);
        axios(
            {
                withCredentials: true,
                data: jsonFormData,
                method: 'post',
                url: `https://localhost:7233/auth/MailAuth`,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((res) => {
                console.log("res", res);
                if (res.status == 200) {
                    let messg = res.data.message;
                    switch (messg) {
                        case "access-granted":
                            console.log("access-granted");
                            //localStorage
                            //    .setItem(
                            //        "aT",
                            //        res.data.data.accessToken
                            //    );
                            //localStorage
                            //    .setItem(
                            //        "rT",
                            //        res.data.data.refreshToken
                            //    );
                            //navigate("/");
                            window.location.href = "/"; 
                            break;
                        case "show-passInput":
                            setmailConfirmed(true);
                            break;
                        case "show-codeInput":
                            setShowCodeInput(true);
                            setCodeCountDown(59);
                            break;
                        default:
                            console.log("Server error");
                            break;
                    }

                    setMail(jsonFormData.Mail);
                }
                setLoading(false);
            }).catch((err) => {
                let messag = "We’re having technical issues. Please try again later.";
                console.error("Error: ", err);
                if (err.status == 401) {
                    messag = "Incorrect credentials";
                }
                warn(messag);
                setLoading(false);
            });
        //axios.post(`https://localhost:7233/auth/MailAuth`,
        //    jsonFormData,
        //    {
        //        withcredentials: true,
        //        headers: {
        //            'Content-Type': 'application/json'
        //        }
        //    })
        //    .then((res) => {
        //        console.log("res", res);
        //        if (res.status == 200) {
        //            let messg = res.data.message;
        //            switch (messg) {
        //                case "access-granted":
        //                    console.log("access-granted");

        //                    localStorage
        //                        .setItem(
        //                            "aT",
        //                            res.data.data.accessToken
        //                        );
        //                    localStorage
        //                        .setItem(
        //                            "rT",
        //                            res.data.data.refreshToken
        //                        );
        //                    navigate("/");
        //                    break;
        //                case "show-passInput":
        //                    setmailConfirmed(true);
        //                    break;
        //                case "show-codeInput":
        //                    setShowCodeInput(true);
        //                    setCodeCountDown(59);
        //                    break;
        //                default:
        //                    console.log("Server error");
        //                    break;
        //            }

        //            setMail(jsonFormData.Mail);
        //        }
        //        setLoading(false);
        //    })
        //    .catch((err) => {
        //        let messag = "We’re having technical issues. Please try again later.";
        //        console.error("Error: ", err);
        //        if (err.status == 401) {
        //            messag = "Incorrect credentials";
        //        }
        //        warn(messag);
        //        setLoading(false);
        //    })
    };
    const verifyCode = (e) => {
        //mandar peticion a /verify con el codigo introducido y el mail guardado en state
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);
        const jsonFormData = Object.fromEntries(formData.entries());
        jsonFormData['Mail'] = mail;
        axios.post(`https://localhost:7233/auth/verify`,
            jsonFormData,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((res) => {
                if (res.status == 200) {
                    localStorage.setItem("aT", res.data.data.accessToken);
                    localStorage.setItem("rT", res.data.data.refreshToken);
                    navigate("/");
                } else {
                    console.log(res.data.message);
                }
                setLoading(false);
            })
            .catch((err) => {
                let messag = "We’re having technical issues. Please try again later.";
                console.error("Error: ", err);
                if (err.status == 401) {
                    messag = "The code has expired or is incorrect";
                }
                warn(messag);
                setLoading(false);
            })

    }
    const verifyMail = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);
        const jsonFormData = Object.fromEntries(formData.entries());
        try {
            const response = await verifyMailFunction(jsonFormData);
            if (response.status === 200) {
                let messg = response.data.message;
                if (messg === "show-codeInput") {
                    setShowCodeInput(true);
                    setCodeCountDown(59);
                }
                else if (messg === "show-pass-name") {
                    //setShowPassName(true);
                    setmailConfirmed(true);
                    info("No user was found with that email. Enter a password to register")
                }
                setMail(jsonFormData.Mail);
                setLoading(false);
            }
        } catch (err) {
            console.log("error", err);
            let messag = "We’re having technical issues. Please try again later.";
            if (err.status == 400) {
                messag = "Please enter a valid email";
            }
            warn(messag);
            setLoading(false);
        }
    }
    const register = (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);
        const jsonFormData = Object.fromEntries(formData.entries());
        const validPass = new RegExp("^.{8,}$");
        if (jsonFormData.Password != null) {
            if (!validPass.test(jsonFormData.Password)) {
                warn("Please enter a valid password, at least 8 characters");
                setLoading(false);
                return;
            }
        }
        axios.post(`https://localhost:7233/register/register`,
            jsonFormData,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((res) => {
                if (res.status === 200) {
                    console.log("access-granted");
                    localStorage
                        .setItem(
                            "aT",
                            res.data.data.accessToken
                        );
                    localStorage
                        .setItem(
                            "rT",
                            res.data.data.refreshToken
                        );
                    setMail(jsonFormData.Mail);
                    navigate("/");
                }
                setLoading(false);
            })
            .catch((err) => {
                let messag = "We’re having technical issues. Please try again later.";
                console.error("Error: ", err);
                if (err.status == 400) {
                    messag = "Please enter a valid email";
                }
                warn(messag);
                setLoading(false);
            });
    }
    return (
        <div id="login-wrapper">

            <ToastContainer hideProgressBar draggable />
            <div id="login-frame">
                {showCodeInput ? (
                    <React.Fragment>
                        {/*{Code form}*/}
                        <p>A 5-digit code has been sent to <span style={importantStyle}>{mail}</span>. Please enter it below.<br />Don't forget to look in your <span style={importantStyle}>spam</span> folder.<br /><br />
                            The code expires in {codeCountDown} seconds</p>
                        <form className="email-form" onSubmit={verifyCode} key="codeForm">
                            <div className="input-container">
                                <label>Code </label>
                                <input type="text" name="Code" id="code" required />
                            </div>
                            <button className="btn-confirm">
                                <Loader loading={loading} />
                                {!loading && "Go"}
                            </button>
                        </form>
                    </React.Fragment>

                ) : (
                    <React.Fragment>
                        {forgotPass ? (
                            <form className="email-form" onSubmit={mailConfirmed ? register : verifyMail} key="registerForm">
                                <div className="input-container">
                                    <label className="input-label">Email</label>
                                    <input type="text" name="Mail" id="mail" required readOnly={mailConfirmed} />

                                    {mailConfirmed &&
                                        <div className="input-container">
                                            <label className="input-label">Password (8 characters)</label>
                                            <input type="password" name="Password" id="password" required />
                                        </div>
                                    }
                                </div>
                                <button type="submit" className="btn-confirm">
                                    <Loader loading={loading} />
                                    {!loading && "Go"}
                                </button>
                            </form>
                        ) : (
                            <React.Fragment>
                                <h1>Login</h1>
                                <form className="email-form" onSubmit={login} key="mailForm">

                                    <div className="input-container" style={{ display: mailConfirmed ? "none" : "flex" }}>
                                        <label className="input-label">Email</label>
                                        <input type="text" name="Mail" id="mail" required />

                                    </div>

                                    {mailConfirmed &&
                                        <div className="input-container">
                                            <label className="input-label">Password (8 characters)</label>
                                            <input type="password" name="Password" id="password" required />
                                        </div>
                                    }
                                    <button className="btn-confirm">
                                        <Loader loading={loading} />
                                        {!loading && "Go"}
                                    </button>
                                </form>


                                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="1" viewBox="0 0 260 0.5" fill="none">
                                    <path d="M0 1H260" stroke="#B5B5B5" />
                                </svg>
                                <div id="create-acc-frame">
                                    <button id="btn-create" onClick={() => { navigate("/register") }} >Create Account</button>
                                    <button className="btn-google" onClick={() => googleLogin()}>Sign in with Google
                                        <svg id="google-svg" xmlns="http://www.w3.org/2000/svg" width="32" height="33" viewBox="0 0 32 33" fill="none">
                                            <path d="M29.074 13.8887H28V13.8333H16V19.1667H23.5353C22.436 22.2713 19.482 24.5 16 24.5C11.582 24.5 8 20.918 8 16.5C8 12.082 11.582 8.49999 16 8.49999C18.0393 8.49999 19.8947 9.26932 21.3073 10.526L25.0787 6.75466C22.6973 4.53532 19.512 3.16666 16 3.16666C8.63667 3.16666 2.66667 9.13666 2.66667 16.5C2.66667 23.8633 8.63667 29.8333 16 29.8333C23.3633 29.8333 29.3333 23.8633 29.3333 16.5C29.3333 15.606 29.2413 14.7333 29.074 13.8887Z" fill="#FFC107" />
                                            <path d="M4.204 10.294L8.58467 13.5067C9.77 10.572 12.6407 8.49999 16 8.49999C18.0393 8.49999 19.8947 9.26932 21.3073 10.526L25.0787 6.75466C22.6973 4.53532 19.512 3.16666 16 3.16666C10.8787 3.16666 6.43733 6.05799 4.204 10.294Z" fill="#FF3D00" />
                                            <path d="M16 29.8333C19.444 29.8333 22.5733 28.5153 24.9393 26.372L20.8127 22.88C19.4293 23.9327 17.7384 24.5019 16 24.5C12.532 24.5 9.58733 22.2887 8.478 19.2027L4.13 22.5527C6.33667 26.8707 10.818 29.8333 16 29.8333Z" fill="#4CAF50" />
                                            <path d="M29.074 13.8887H28V13.8333H16V19.1667H23.5353C23.0095 20.6443 22.0622 21.9355 20.8107 22.8807L20.8127 22.8793L24.9393 26.3713C24.6473 26.6367 29.3333 23.1667 29.3333 16.5C29.3333 15.606 29.2413 14.7333 29.074 13.8887Z" fill="#1976D2" />
                                        </svg>
                                    </button>


                                </div>
                                <a onClick={() => {
                                    setForgotPass(true);
                                }}>Forgot password?</a>
                            </React.Fragment>

                        )}

                    </React.Fragment>


                )}


                {/*<div>*/}
                {/*    <img src={profile.picture} alt="user image" />*/}
                {/*    <h3>User Logged in</h3>*/}
                {/*    <p>Name: {profile.name}</p>*/}
                {/*    <p>Email Address: {profile.email}</p>*/}
                {/*    <br />*/}
                {/*    <br />*/}
                {/*</div>*/}

                {/*<div id="g_id_onload"*/}
                {/*    data-client_id="765808157277-f5ktben8g1a5tflgbh9f0pi2tvdv68ih.apps.googleusercontent.com"*/}
                {/*    data-callback="handleCredentialResponse">*/}
                {/*</div>*/}
                {/*<div className="g_id_signin" data-type="standard"></div>*/}


            </div>
        </div >
    );
}

export default Login;