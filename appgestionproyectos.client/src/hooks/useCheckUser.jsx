import { useEffect, useState } from "react";

export function useCheckUser() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const publicBase = import.meta.env.VITE_API_URL ?? 'https://localhost:7233'
    useEffect(() => {
        fetch(`${publicBase}/api/auth/check`, {
            credentials: "include",
        })
            .then((res) => {
                setIsAuthenticated(res.ok);
            })
            .catch((ex) => {
                console.error("exception in check: " + ex);
                setIsAuthenticated(false);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return { isAuthenticated, loading };
}
