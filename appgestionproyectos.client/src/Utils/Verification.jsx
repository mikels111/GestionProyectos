import axios from 'axios';

export function verifyCodeFunction(e, user) {
    //mandar peticion a /verify con el codigo introducido y el mail guardado en state
    //e.preventDefault();
    const formData = new FormData(e.target);
    const jsonFormData = Object.fromEntries(formData.entries());

    jsonFormData['Mail'] = user.mail;
    console.log(user);
    axios.post(`https://localhost:7233/auth/verify`,
        jsonFormData,
        {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((res) => {
            if (res.status == 200) {
                localStorage.setItem("aT", res.data.data.accessToken);
                localStorage.setItem("rT", res.data.data.refreshToken);
                navigate("/dashboard");
            } else {
                console.log(res.data.message);
            }
        })
        .catch((err) => {
            switch (err.status) {
                case 400:
                    console.log(err.response.data.message);
                    break;
                case 401:
                    console.log(err.response.data.message);
                    break;
                case 500:
                    console.log(err.response.data.message);
                    break;
            }
        })
}

export async function verifyMailFunction(jsonFormData) {
    return axios
        ({
            method: 'post',
            url: `https://localhost:7233/register/CheckMail`,
            data: jsonFormData,
            headers: {
                'Content-Type': 'application/json'
            }
        });
}