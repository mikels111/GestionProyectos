// hooks/useAuth.ts
import { useEffect, useState } from "react";

export function useCheckUser() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("https://localhost:7233/auth/check", {
            credentials: "include",
        })
            .then((res) => {
                //console.log("is authenticated")
                setIsAuthenticated(res.ok);
            })
            .catch(() => {
                //console.log("is NOT authenticated")
                setIsAuthenticated(false);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return { isAuthenticated,loading };
}
