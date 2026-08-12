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
        return <p>Loading...</p>; // o un spinner
    }
    console.log("ProtectedRoute->isauthenticated:", isAuthenticated);
    const publicBase = import.meta.env.BASE_URL ?? '/'
    const routerBase = import.meta.env.VITE_ROUTER_URL || "https://localhost:5173";


    return isAuthenticated ? <Outlet /> : window.location.href = `${routerBase}/login`;
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
