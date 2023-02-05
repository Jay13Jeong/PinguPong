import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ModalBase from "./ModalBase";
import GameRecordList from "../util/card/GameRecordList";
import { useSetRecoilState , useRecoilState, useResetRecoilState, useRecoilValue } from "recoil"
import { profileEditModalState, profileModalState } from "../../states/recoilModalState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faUserPen, faUserPlus, faUserMinus, faUser, faUserSlash, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import "./ProfileModal.scss"
import * as types from "../profile/User"
import axios from "axios";
import ProfileEditModal from "./ProfileEditModal";
import { REACT_APP_HOST } from "../../util/configData";

/**
 * profileModalState
 * default: {
        userId: 0,
        show: false
    }
 */

function ProfileModal() {
    // const [showEditModal, setShowEditModal] = useRecoilState(profileEditModalState);
    const showEditModal = useRecoilValue(profileEditModalState);
    // const  [showModal, setShowModal] = useRecoilState(profileModalState);
    const showModal = useRecoilValue(profileModalState);
    const setProfileEditState = useSetRecoilState(profileEditModalState);
    const resetState = useResetRecoilState(profileModalState);
    
    const [userInfo, setUserInfo] = useState<types.User>({
        id: 0,
        avatar: "https://cdn.myanimelist.net/images/characters/11/421848.jpg",
        userName: "pinga",
        myProfile: true,    // TODO - 더 좋은 방법이 있을지 생각해보기
        userStatus: "on",
        rank: 0,
        odds: 0,
        record: [
            {idx: 1, p1: "cheolee", p2: "jjeong", p1Score: 10, p2Score: 2},
            {idx: 2, p1: "cheolee", p2: "jjeong", p1Score: 10, p2Score: 1},
            {idx: 3, p1: "cheolee", p2: "jjeong", p1Score: 10, p2Score: 10},
            {idx: 4, p1: "cheolee", p2: "jjeong", p1Score: 1, p2Score: 10},
            {idx: 5, p1: "cheolee", p2: "jjeong", p1Score: 10, p2Score: 10},
            {idx: 6, p1: "jeyoon", p2: "jjeong", p1Score: 10, p2Score: 5}
        ]
    });    // 유저 정보

    // const [userInfo, setUserInfo] = useState<types.User>({
    //     userName: "pingi",
    //     myProfile: false,    // TODO - 더 좋은 방법이 있을지 생각해보기
    //     userStatus: "game",
    //     rank: 0,
    //     odds: 0,
    //     record: [
    //         {idx: 1, p1: "cheolee", p2: "jjeong", p1Score: 10, p2Score: 2},
    //         {idx: 2, p1: "cheolee", p2: "jjeong", p1Score: 10, p2Score: 1}
    //     ],
    //     following: false,
    //     block: false,
    // });    // 유저 정보

    const navigate = useNavigate();

    // interface User {
    //     id: number;
    //     username: string;
    //   email: string;
    //     twofa: boolean;
    //     avatar: string;
    // }

    useEffect(() => {
        // TODO: 유저 정보를 받아온다.
        // setUserInfo();
        axios.get('http://' + REACT_APP_HOST + ':3000/api/user', {withCredentials: true}) //쿠키와 함께 보내기 true.
        .then(res => {
            // console.log(res.data);
            if (res.data){
                if (showModal.userId !== res.data.id && showModal.userId !== 0){ //id 0은 빈 값.
                    // console.log(showModal.user);
                    // console.log("=======");
                    setUserInfo(showModal.user? showModal.user : userInfo);
                } else {
                    let totalGame = res.data.wins + res.data.loses;
                    let myInfo : types.User = {
                        id : res.data.id,
                        avatar: res.data.avatar,
                        userName : res.data.username as string,
                        myProfile : true,
                        userStatus : 'off',
                        rank : 0,
                        odds : res.data.wins == 0? 0 : Math.floor(totalGame / res.data.wins),
                        record : [],
                    };
                    setUserInfo(myInfo);
                }
            }
        })
        .catch(err => {
            if (err.response.data.statusCode === 401)
            navigate('/'); //로그인 안되어 있다면 로그인페이지로 돌아간다.
        })
    }, [showModal, showEditModal]);

    // useEffect(() => {
    //     setUserInfo(userInfo);
    // }, [userInfo]);

    function showStatus(status: string){
        switch(status) {
            case "on":
                return (
                    <div className="profile-status">
                        <FontAwesomeIcon style={{color: "#00BDAA"}} icon={faCircle}/> Online
                    </div>
                );
            case "off":
                return (
                    <div className="profile-status">
                        <FontAwesomeIcon style={{color: "#FE346E"}} icon={faCircle}/> Offline
                    </div>
                );
            case "game":
                return (
                    // TODO 게임으로 가야 함.
                    // TODO 게임중인 본인이 게임 화면으로 이동하는 경우 문제 발생할 수 있음...
                    <button className="profile-status">
                        <FontAwesomeIcon style={{color: "#400082"}} icon={faCircle}/> In Game
                    </button>
                );
            default:
                return (null);
        }
    }

    //친추.
    function handleFollow(event : any) {
        event.preventDefault();
        axios.post('http://' + REACT_APP_HOST + ':3000/api/friend', {otherID : userInfo.id}, {withCredentials: true})
        .then(res => {
            if (res.status === 200)
                alert('send follow');
        })
        .catch(err => {
            alert('invalid');
        })
    };

    //언팔.
    function handleUnfollow(event : any) {
        event.preventDefault();
        axios.patch('http://' + REACT_APP_HOST + ':3000/api/friend', {otherID : userInfo.id}, {withCredentials: true})
        .then(res => {
            if (res.status === 200)
                alert('unfollow ok');
        })
        .catch(err => {
            alert('invalid');
        })
    };

    function handleBlock(event : any) {
        event.preventDefault();
        axios.post('http://' + REACT_APP_HOST + ':3000/api/friend/block', {otherID : userInfo.id}, {withCredentials: true})
        .then(res => {
            alert('target block ok');
        })
        .catch(err => {
            alert('target block fail');
        })
    };

    function handleUnblock(event : any) {
        event.preventDefault();
        axios.patch('http://' + REACT_APP_HOST + ':3000/api/friend/block', {otherID : userInfo.id}, {withCredentials: true})
        .then(res => {
            if (res.status === 200)
                alert('target unblock ok');
        })
        .catch(err => {
            alert('target unblock fail');
        })
    };

    function profileButton () {
        if (userInfo.myProfile) {
            return (
                <div className="profile-button-wrapper">
                    <button className="profile-button"
                        onClick={(e) => setProfileEditState(true)}>
                        <FontAwesomeIcon icon={faUserPen}/> Edit Profile
                    </button>
                </div>
            )
        }
        return (
            <div className="profile-button-wrapper">
                {userInfo.relate === 'accepted' ? 
                <button className="profile-button" onClick={handleUnfollow}>
                    <FontAwesomeIcon icon={faUserMinus}/> Unfollow
                </button> :
                <button className="profile-button" onClick={handleFollow}>
                    <FontAwesomeIcon icon={faUserPlus}/> Follow
                </button>}
                {userInfo.relate == 'blocked' ? 
                <button className="profile-button" onClick={handleUnblock}>
                    <FontAwesomeIcon icon={faUser}/> Unblock
                </button> :
                <button className="profile-button" onClick={handleBlock}>
                    <FontAwesomeIcon icon={faUserSlash}/> Block
                </button>}
                <button className="profile-button" >
                    <FontAwesomeIcon icon={faPaperPlane}/> DM
                </button>
            </div>
        )
    }

    

    if (showModal.show) {
        return (
            <ModalBase reset={resetState}>
                <ProfileEditModal name={userInfo.userName}/>
                {/* TODO - 프로필 이미지? */}
                <div className="profile-wrapper">
                    <div className="profile-box">
                        <img className="profile-image" src={userInfo.avatar} alt={userInfo.userName + '-profile'} />
                    </div>
                    {profileButton()}
                    <div className="profile-name">
                        ID : {userInfo.userName}
                    </div>
                    {showStatus(userInfo.userStatus)}   
                    <div className="profile-rank">
                        Rank : {userInfo.rank}
                    </div>
                    <div className="profile-odds">
                        Odds : {userInfo.odds} %
                    </div>
                    <div className="record-title">최근 10경기 전적</div>
                </div>
                <GameRecordList record={userInfo.record}/>
            </ModalBase>
        )
    }
    return null;
}

export default ProfileModal;