import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { userState } from "../states/recoilUserState";
import { useNavigate } from "react-router-dom";
import { REACT_APP_HOST } from "./configData";
import useGetData from "./useGetData";

function useCheckLogin() {
    const [user, setUser] = useRecoilState(userState);
    const [data, error] = useGetData('http://' + REACT_APP_HOST + ':3000/api/user');
    const navigate = useNavigate();

    useEffect(() => {
        if (!error && data) {
            setUser(data);
        }
        else {
            navigate('/');
        }
    }, [error, data]);

    useEffect(() => {
        if (user.id === -1 || user.userName === '')
            navigate('/');
    }, [user]);
}

export default useCheckLogin;