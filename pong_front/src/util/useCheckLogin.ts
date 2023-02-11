import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { userState } from "../common/states/recoilUserState";
import { useNavigate } from "react-router-dom";
import { REACT_APP_HOST } from "../common/configData";
import useGetData from "./useGetData";

function useCheckLogin() {
    const [user, setUser] = useRecoilState(userState);
    // const [data, error] = useGetData('http://' + REACT_APP_HOST + ':3000/api/fa2/status');
    const [data, error] = useGetData('http://' + REACT_APP_HOST + ':3000/api/user');
    const navigate = useNavigate();

    useEffect(() => {
        if (!data && !error)
            return ;
        // else if(!(!error && data))
        //     navigate('/');
        /////////////
        // console.log(data,error);
        if (!error && data) {
            setUser(data);
        }
        else {
            navigate('/');
        }
    }, [error, data]);

    // useEffect(() => {
    //     if (user.id === -1 || user.userName === '')
    //         navigate('/');
    // }, [user]);
}

export default useCheckLogin;