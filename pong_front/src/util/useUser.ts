import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import {User} from "../components/profile/User"
import axios from "axios";

// userID : 검색하려는 유저 ID

function useUser(userid?: number) {
    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState<User>({
        id: 0,
        userName: "pinga",
        myProfile: true,    // TODO - 더 좋은 방법이 있을지 생각해보기
        userStatus: "off",
        rank: 0,
        odds: 0,
        record: []
    })

    useEffect(() => {
        // console.log("000000");
        axios.get('http://localhost:3000/api/user', {withCredentials: true}) //쿠키와 함께 보내기 true.
        .then(res => {
            // console.log("useUser", userInfo.userName);
            if (res.data){
                let myInfo : User = {
                    id : res.data.id,
                    userName : res.data.username as string,
                    myProfile : true,
                    userStatus : 'off',
                    rank : 0,
                    odds : 50,
                    record : [],
                };
                setUserInfo(myInfo);
            }
        })
        .catch(err => {
            if (err.response.data.statusCode === 401)
                navigate('/'); //로그인 안되어 있다면 로그인페이지로 돌아간다.
        })
    }, []);
    return userInfo;

}

export default useUser;