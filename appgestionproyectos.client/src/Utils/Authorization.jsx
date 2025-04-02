import axios from 'axios';

export function AuthRequest(url) {
    const baseUrl = 'https://localhost:7233/';
    const urlResult = baseUrl.concat(url);
    const accessToken = localStorage.getItem("accessToken");
    let rtResult;
    if (url != null || accessToken != null) {
        return axios
            ({
                method: 'post',
                url: urlResult,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
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
                            rtResult = err;
                            return Promise.reject(err);
                        });
                }
                return Promise.reject(err);
            });
    }

}

export function RefreshToken() {
    const refreshToken = localStorage
        .getItem("refreshToken");
    let tokens = {
        'RefreshToken': refreshToken
    }
    return axios
        ({
            method: 'post',
            data: tokens,
            url: 'https://localhost:7233/auth/Refresh',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(function (res) {
            if (res.status == 200) {
                localStorage
                    .setItem(
                        "accessToken",
                        res.data.data.accessToken
                    );
                localStorage
                    .setItem(
                        "refreshToken",
                        res.data.data.refreshToken
                    );
            }
            return Promise.resolve(res);
        })
        .catch(function (err) {
            console.error("Error on request to refresh token",err);
            localStorage.clear();
            return Promise.reject(err);
        });
};