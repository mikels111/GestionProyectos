import { ToastContainer, toast } from 'react-toastify';
//https://fkhadra.github.io/react-toastify/introduction
export function Notify() {
    const warn = (messag) => {
        return toast.warn(messag, { position: "bottom-center" });
    }
    const info = (messag) => {
        return toast.info(messag, { position: "bottom-center" });
    }
    return { warn, info };
}