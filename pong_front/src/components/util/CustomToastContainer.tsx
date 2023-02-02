import { ToastContainer } from "react-toastify";

function CustomToastContainer () {
    return (
        <ToastContainer
            position="top-right"
            autoClose={500}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            rtl={false}
            draggable={false}
            theme="dark"
            />
    )
}

export default CustomToastContainer;