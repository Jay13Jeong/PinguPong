import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { REACT_APP_HOST } from "../common/configData";
import useGetData from "./useGetData";

function useCheckLogin() {
    // const [user, setUser] = useRecoilState(userState);
    const [data, error] = useGetData('http://' + REACT_APP_HOST + ':3000/api/user');
    const navigate = useNavigate();

    useEffect(() => {
        if (!data && !error)
            return ;
        if (!error && data) {
            // setUser(data);
        }
        else {
            navigate('/');
        }
    }, [error, data, navigate]);
}

export default useCheckLogin;