import React, { useEffect, useState } from 'react';
import { RefreshToken, AuthRequest } from '../../Utils/Authorization';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';
function Register() {
    const navigate = useNavigate();

    const [user, setUser] = useState({
        mail: ""
    });
    const [mailConfirmed, setmailConfirmed] = useState(false);
    const [showCodeInput, setShowCodeInput] = useState(false);
    const [showPassName, setShowPassName] = useState(false);
    const [codeCountDown, setCodeCountDown] = useState(0);
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


    const verifyCode = (e) => {
        e.preventDefault();
    }
    const register = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const jsonFormData = Object.fromEntries(formData.entries());
        console.log(jsonFormData);
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
                            "accessToken",
                            res.data.data.accessToken
                        );
                    localStorage
                        .setItem(
                            "refreshToken",
                            res.data.data.refreshToken
                        );
                    setUser({ mail: jsonFormData.Mail });
                    navigate("/dashboard", { replace: "true"});
                }
            })
            .catch((err) => {
                switch (err.status) {
                    case 400:
                        console.log("bad request", err);
                        break;
                    case 401:
                        console.log("unauthorized", err);
                        break;
                    case 500:
                        console.log("server error", err);
                        break;
                }
            });
    }
    const verifyMail = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const jsonFormData = Object.fromEntries(formData.entries());
        axios.post(`https://localhost:7233/register/CheckMail`,
            jsonFormData,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((res) => {
                if (res.status === 200) {
                    let messg = res.data.message;
                    if (messg === "show-codeInput") {
                        setShowCodeInput(true);
                        setCodeCountDown(59);
                    }
                    else if (messg === "show-pass-name") {
                        setShowPassName(true);
                        setmailConfirmed(true);
                    }
                    setUser({ mail: jsonFormData.Mail });
                }
            })
            .catch((err) => {
                switch (err.status) {
                    case 400:
                        console.log("bad request", err);
                        break;
                    case 401:
                        console.log("unauthorized", err);
                        break;
                    case 500:
                        console.log("server error", err);
                        break;
                }
            });
    }

    return (
        <div id="register-wrapper">
            <div id="register-frame">
                {showCodeInput ? (
                    <React.Fragment>
                        {/*{Code form}*/}
                        <p>A 4-digit code has been sent to {user.mail}. Please enter it below.<br /><br />
                            The code expires in {codeCountDown} seconds</p>
                        <form className="email-form" onSubmit={verifyCode} key="codeForm">
                            <div className="input-container">
                                <label>Code </label>
                                <input type="text" name="Code" id="code" required />
                            </div>

                            <button className="btn-confirm">
                                Go
                            </button>


                        </form>
                    </React.Fragment>
                ) : (
                    <form className="email-form" onSubmit={mailConfirmed ? register : verifyMail} key="emailForm">
                        <div className="input-container">
                            <label className="input-label">Email</label>
                            <input type="text" name="Mail" id="mail" required readOnly={mailConfirmed} />

                            {mailConfirmed &&
                                <div className="input-container">
                                    <label className="input-label">Password</label>
                                    <input type="password" name="Password" id="password" required />
                                </div>
                            }
                        </div>
                        <button className="btn-confirm">
                            {mailConfirmed ? "Go" : "Next"}
                        </button>
                    </form>
                )}

            </div>
        </div>


    );


}
export default Register;