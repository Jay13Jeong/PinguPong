import React, { useState, useEffect, useContext } from "react";
import { SocketContext } from "../../states/contextSocket";
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
    const [avatarFile, setAvatarFile] = useState('');
    const socket = useContext(SocketContext);
    
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
                        odds : res.data.wins === 0? 0 : Math.floor(totalGame / res.data.wins),
                        record : [],
                    };
                    setUserInfo(myInfo);
                }
                axios.get('http://' + REACT_APP_HOST + ':3000/api/user/avatar/' + res.data.id, {withCredentials: true, responseType: 'blob'}) //blob : 파일전송용 큰 객체타입.
                .then(res2 => {
                    // console.log(res2.data);
                    setAvatarFile(URL.createObjectURL(res2.data));
                })
                .catch(err => {
                    // alert("111");
                    navigate('/');
                })
            } else {
                // alert("222");
                navigate('/');
            }
        })
        .catch(err => {
            // alert("333");
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
                    userInfo.myProfile ? 
                    <div className="profile-status">
                        <FontAwesomeIcon style={{color: "#400082"}} icon={faCircle}/> In Game
                    </div> : 
                    <button className="profile-status" onClick={watchHandler}>
                        <FontAwesomeIcon style={{color: "#400082"}} icon={faCircle}/> In Game
                    </button>
                );
            default:
                return (null);
        }
    }

    //친추.
    function handleFollow(event: React.MouseEvent<HTMLElement>) {
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
    function handleUnfollow(event: React.MouseEvent<HTMLElement>) {
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

    // 차단
    function handleBlock(event: React.MouseEvent<HTMLElement>) {
        event.preventDefault();
        axios.post('http://' + REACT_APP_HOST + ':3000/api/friend/block', {otherID : userInfo.id}, {withCredentials: true})
        .then(res => {
            alert('target block ok');
        })
        .catch(err => {
            alert('target block fail');
        })
    };

    // 차단 해제
    function handleUnblock(event: React.MouseEvent<HTMLElement>) {
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

    // 게임 관전 이동
    function watchHandler(event: React.MouseEvent<HTMLElement>) {
        /**
         * NOTE
         * - 게임 목록 받아오기
         * - 게임 목록에서 사용자 ID 찾기
         * - 모달 클리어
         * - 그 게임으로 이동
         */
        /* 게임 목록 받아오기 */
        socket.emit('api/get/roomlist');
        socket.on('api/get/roomlist', (data: {p1: string, p2: string}[]) => {
            let target: {p1: string, p2: string} = {p1: "", p2: ""};
            /* 게임 목록에서 사용자 ID 찾기 */
            if (data.some((game) => {
                if (game.p1 === userInfo.userName || game.p2 === userInfo.userName) {
                    target = {...game};
                    return true;
                }
                else
                    return false;
            })) {
                // 게임에 유저가 존재하니 이동이 가능하다.
                socket.off('api/get/roomlist');
                socket.emit('watchGame', `${target.p1}vs${target.p2}`);
                resetState();
                navigate(`/game/watch/${target.p1}vs${target.p2}`, {state: {
                    player1: target.p1,
                    player2: target.p2
                }});
            }
            socket.off('api/get/roomlist');
            resetState();
            // TODO - 만약에 목록에 동일한 이름의 유저가 없는 경우 (그 찰나에 게임이 종료됨) 어떻게 처리할지 확인해보기
        })
        // TODO - 이미 종료된 게임의 경우 어떻게 되는지 확인해보기
    }

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
                        {avatarFile !== '' ?
                        <img className="profile-image" src={avatarFile} alt={userInfo.userName + '-profile'} />
                        : <img className="profile-image" src="/favicon.ico" alt={userInfo.userName + '-profile'} />}
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