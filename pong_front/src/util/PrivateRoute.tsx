import React, { Component } from "react";
import { Route, Navigate, Outlet} from "react-router-dom";
import checkLogin, {Login} from "./checkLogin";

interface PrivateRouteProps {
    children ?: React.ReactElement;
    needLogin: boolean;
}

export default function PrivateRoute({needLogin}:PrivateRouteProps) {
    const loginStatus: Login = checkLogin();
    // 로그인 === false : "logout"
    // 로그인 === true && 프로필 설정 === false : "profile-init"
    // 로그인 === true && 프로필 설정 === true : "login"

    if(needLogin === true) {
        console.log("** ", needLogin, " ", loginStatus);
        switch (loginStatus) {
            case "login" :
                return <Outlet/>;
            case "logout" :
                return <Navigate to="/"/>
            case "profile-init" :
                return <Navigate to="/profile/init"/>
            default :
                return <Navigate to="/"/>
        }
    }
    else {
        console.log("&& ", needLogin, " ", loginStatus);
        switch (loginStatus) {
            case "login" :
                return <Navigate to="/"/>
            case "logout" :
                return <Outlet/>;
            case "profile-init" :
                return <Navigate to="/"/>
            default :
                return <Navigate to="/"/>
        }
    }
}