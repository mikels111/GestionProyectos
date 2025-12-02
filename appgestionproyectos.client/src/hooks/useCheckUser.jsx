// hooks/useAuth.ts
import { useEffect, useState } from "react";

export function useCheckUser() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    // const baseURL = import.meta.env.VITE_API_URL || "https://localhost:7233";
    //const publicBase = import.meta.env.BASE_URL ?? 'https://localhost:7233'
    const publicBase = import.meta.env.VITE_API_URL ?? 'https://localhost:7233'
    useEffect(() => {
        fetch(`${publicBase}/api/auth/check`, {
            credentials: "include",
        })
            .then((res) => {
                //console.log("is authenticated")
                setIsAuthenticated(res.ok);
            })
            .catch((ex) => {
                console.error("exception in check: " + ex);
                //console.log("is NOT authenticated")
                setIsAuthenticated(false);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return { isAuthenticated, loading };
}
