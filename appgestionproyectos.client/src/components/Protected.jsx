// components/ProtectedRoute.tsx
import { ReactNode } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useCheckUser } from "../hooks/useCheckUser";
//import useCheckUser from "../hooks/useCheckUser";

//type ProtectedRouteProps = {
//    children: ReactNode;
//};
export const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useCheckUser();

    if (loading) {
        return <p>Cargando...</p>; // o un spinner
    }
    console.log("ProtectedRoute->isauthenticated:", isAuthenticated);
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export const Protected = ({ children }) => {
    const { isAuthenticated, loading } = useCheckUser();
    console.log("Protected->isauthenticated:", isAuthenticated);
    if (loading) {
        return null;
    }
    if (!isAuthenticated) return null;
    if (isAuthenticated) {
        return <>{children}</>;
    }
};


//export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
//    const { isAuthenticated } = useCheckUser();
//    //console.log("is authenticated", isAuthenticated);
//    //if (loading) return <p>Cargando...</p>;

//    return isAuthenticated ? children :
//        //<Navigate to="/login" />;
//        window.location.href = "/login";
//};

//export const Protected = ({ children }: { children: React.ReactNode }) => {
//    const { isAuthenticated } = useCheckUser();
//    //console.log("PROTECTED");
//    //if (loading) return <p>Cargando...</p>;
//    if (isAuthenticated) {
//        return children;
//    }
//};