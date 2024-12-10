import { useState, useEffect } from 'react'
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import './Login.css'
function Login() {

    const [user, setUser] = useState([]);
    const [profile, setProfile] = useState([]);
    const correoConfirm = false;

    const googleLogin = useGoogleLogin({
        onSuccess: (codeResponse) => {
            console.log("codeResponse", codeResponse);
            console.log(codeResponse.access_token);
            axios.post(`https://localhost:7233/user/LoginUserGoogle`, null, { headers: { 'Content-Type': 'application/json', token: codeResponse.access_token } })
                .then((res) => {
                    setProfile(res.data);
                    console.log("setProfile: ");
                    console.log(res.data);
                })
                .catch((err) => console.log(err))
        },
        onError: (error) => console.log('Login Failed:', error)
    });

    const logear = () => {
        console.log("logear");
    };
    return (

        <div>

            <div className="">
                <form>
                    <div className="input-container">
                        <label>Username </label>
                        <input type="text" id="input" required />

                    </div>
                    {correoConfirm &&
                        <div className="input-container">
                            <label>Password </label>
                            <input type="password" id="input" required />
                        </div>
                    }
                    <button id="button-confirm" onClick={logear}>
                        go
                    </button>
                </form>

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