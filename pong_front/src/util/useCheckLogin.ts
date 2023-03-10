import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { REACT_APP_HOST } from "../common/configData";
import useGetData from "./useGetData";

function useCheckLogin(isLoginPage?: boolean) {
    const [data, error] = useGetData('http://' + REACT_APP_HOST + '/api/user');
    const navigate = useNavigate();

    useEffect(() => {
        if (!data && !error)
            return ;
        if (!error && data) {
            if (isLoginPage === true)
                navigate('/lobby');
        }
        else {
            navigate('/');
        }
    }, [error, data, navigate]);
}

export default useCheckLogin;