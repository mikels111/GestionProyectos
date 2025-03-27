import { StrictMode, React } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google"
//import './index.css'

createRoot(document.getElementById('root')).render(
    <GoogleOAuthProvider clientId='765808157277-f5ktben8g1a5tflgbh9f0pi2tvdv68ih.apps.googleusercontent.com'>
        {/*<StrictMode>*/}
            <App />
        {/*</StrictMode>*/}
    </GoogleOAuthProvider>
)
