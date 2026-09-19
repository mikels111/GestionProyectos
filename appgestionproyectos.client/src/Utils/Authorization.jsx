import axios from 'axios';

export function AuthRequest(url, method, data = {}) {
    const publicBase = import.meta.env.VITE_API_URL || "https://localhost:7233";
    console.log("BASE URL", publicBase);
    const urlResult = publicBase.concat(url);
    const accessToken = localStorage.getItem("aT");
    let rtResult;
    if (url != null || accessToken != null) {
        return axios
            ({
                withCredentials: true,
                data: data,
                method: method,
                url: urlResult,
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then(function (res) {
                return Promise.resolve(res);
            })
            .catch(function (err) {
                if (err.status == 401) {
                    return RefreshToken()
                        .then((response) => {
                            rtResult = response;
                            return Promise.resolve(rtResult);
                        })
                        .catch((err) => {
                            console.error(
                                "Error on refresh token:",
                                err);
                        });
                }
                return Promise.reject(err);
            });
    }

}
export function RefreshToken() {
    const refreshToken = localStorage
        .getItem("rT");
    let tokens = {
        'RefreshToken': refreshToken
    }
    return axios
        ({
            method: 'post',
            data: tokens,
            url: `/api/auth/Refresh`,
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(function (res) {
            if (res.status == 200) {
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
            }
            return Promise.resolve(res);
        })
        .catch(function (err) {
            console.error("Error on request to refresh token", err);
            localStorage.clear();
            return Promise.reject(err);
        });
};
