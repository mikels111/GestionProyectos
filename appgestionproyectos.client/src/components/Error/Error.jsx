import { NavLink } from 'react-router-dom';
function ErrorView() {
    const containerStyles = {
        backgroundColor: "#f9f9fc",
        margin: "0",
        padding: "0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        color: "#333",
        flexDirection: "column",
        gap: "20px"
    }
    return (
        <div className="container" style={containerStyles}>
            <h1>Oops! Something went wrong</h1>
            <p style={{ padding: "0 30px" }}>We're sorry, but an unexpected error occurred. Please try again later or go back to the homepage.</p>
            <a href="/" className="button">Go to Homepage</a>
            <NavLink to="/login">All Concerts</NavLink>
        </div>
    );
}
export default ErrorView;