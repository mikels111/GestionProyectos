import React, { useEffect, useState } from 'react';
import { verifyCodeFunction, verifyMailFunction } from '../../Utils/Verification';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';
import { ToastContainer } from 'react-toastify';
import Loader from '../../Utils/Loader';

function Register() {
    const navigate = useNavigate();

    const [user, setUser] = useState({
        mail: ""
    });
    const importantStyle = {
        textDecoration: "underline",
        fontWeight: "bold"
    };
    const [mailConfirmed, setmailConfirmed] = useState(false);
    const [showCodeInput, setShowCodeInput] = useState(false);
    const [showPassName, setShowPassName] = useState(false);
    const [codeCountDown, setCodeCountDown] = useState(0);
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


    const verifyCode = (e) => {
        //mandar peticion a /verify con el codigo introducido y el mail guardado en state
        e.preventDefault();
        setLoading(true);
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
                    localStorage.setItem("aT", res.data.data.accessToken);
                    localStorage.setItem("rT", res.data.data.refreshToken);
                    navigate("/dashboard");
                } else {
                    console.log(res.data.message);
                }
                setLoading(false);
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
                setLoading(false);
            })
    }
    const register = (e) => {
        e.preventDefault();
        setLoading(true);
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
                            "aT",
                            res.data.data.accessToken
                        );
                    localStorage
                        .setItem(
                            "rT",
                            res.data.data.refreshToken
                        );
                    setUser({ mail: jsonFormData.Mail });
                    navigate("/dashboard", { replace: "true" });
                }
                setLoading(false);
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
                setLoading(false);
            });
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
                    setShowPassName(true);
                    setmailConfirmed(true);
                }
                setUser({ mail: jsonFormData.Mail });
                setLoading(false);
            }
        } catch (err) {
            console.log("error", err);
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
            setLoading(false);
        }
    }

    return (
        <div id="register-wrapper">
            <ToastContainer hideProgressBar draggable />
            <div id="register-frame">
                {showCodeInput ? (
                    <React.Fragment>
                        {/*{Code form}*/}
                        <p>A 5-digit code has been sent to <span style={importantStyle}>{user.mail}</span>. Please enter it below.<br />Don't forget to look in your <span style={importantStyle}>spam</span> folder.<br /><br />
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
                        <button type="submit" className="btn-confirm">
                            <Loader loading={loading} />
                            {!loading && "Go"}
                        </button>
                    </form>
                )}

            </div>
        </div>


    );


}
export default Register;