import React, { useState, useEffect, useContext } from "react";
import { SocketContext } from "../../../common/states/contextSocket";
import { useNavigate } from "react-router-dom";
import ModalBase from "../../modal/ModalBase";
import GameRecordList from "../../card/game/GameRecordList";
import { useSetRecoilState , useResetRecoilState, useRecoilValue } from "recoil"
import { profileEditModalState, profileModalState } from "../../../common/states/recoilModalState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faUserPen, faUserPlus, faUserMinus, faUser, faUserSlash, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import * as types from "../../../common/types/User"
import axios from "axios";
import ProfileEditModal from "./ProfileEditModal";
import { REACT_APP_HOST } from "../../../common/configData";
import ProfileModalWrapper from "./ProfileModal.style";
import { toast } from "react-toastify";

function ProfileModal() {
    const showEditModal = useRecoilValue(profileEditModalState);
    const showModal = useRecoilValue(profileModalState);
    const setProfileEditState = useSetRecoilState(profileEditModalState);
    const resetState = useResetRecoilState(profileModalState);
    const [avatarFile, setAvatarFile] = useState(''); //대상의 아바타.
    const [onlineStatus, setOnlineStatus] = useState('offline'); // 대상의 상태 (온,오프,게임중).
    const [rank, setRank] = useState<number>(0); // 대상의 게임순위.
    const [relate, setRelate] = useState<string>('nothing');// 대상과 나의 관계.
    const socket = useContext(SocketContext); //소켓.
    const [userInfo, setUserInfo] = useState<types.User>({ //유저정보 기본값.
        id: 0,
        avatar: "https://cdn.myanimelist.net/images/characters/11/421848.jpg",
        userName: "pinga", myProfile: true, userStatus: "offline",rank: 0,odds: 0,record: []
    });    // 유저 정보

    const navigate = useNavigate();

    useEffect(() => {
        const initProfileData = async () => {
            try{
                const res = await axios.get('http://' + REACT_APP_HOST + ':3000/api/user', {withCredentials: true}) //쿠키와 함께 보내기 true.
                if (res.data === null || res.data === undefined)
                    return ;
                if (showModal.userId !== res.data.id && showModal.userId !== 0){ //id 0은 빈 값.
                    await initUserInfo(showModal.userId);
                } else {
                    let totalGame = res.data.wins + res.data.loses;
                    let myInfo : types.User = {
                        id : res.data.id,
                        avatar: res.data.avatar,
                        userName : res.data.username as string,
                        myProfile : true,
                        userStatus : 'off',
                        rank : 0,
                        odds : !res.data.wins ? 0 : Math.floor(100 / (totalGame / (res.data.wins ? res.data.wins : 1))),
                        record : [],
                    };
                    setUserInfo(myInfo);
                }
                let targetId = res.data.id;
                if (showModal.userId !== res.data.id && showModal.userId !== 0){
                    targetId = showModal.userId;
                }
                const getAvatarData = async (id : any) => {
                    try{
                        const avatarDataRes = await axios.get('http://' + REACT_APP_HOST + ':3000/api/user/avatar/' + id, {withCredentials: true, responseType: 'blob'}) //blob : 파일전송용 큰 객체타입.
                        setAvatarFile(URL.createObjectURL(avatarDataRes.data));
                    }catch{
                        //no avatar data...
                    }
                }
                getAvatarData(targetId);
            }catch{ }
        }
        initProfileData();
    }, [showModal, showEditModal]);

    useEffect(() => {
        const getRank = async () =>{
            try{
                const res = await axios.get('http://' + REACT_APP_HOST + ':3000/api/user/rank/' + (showModal.userId !== 0 ? showModal.userId : userInfo.id) , {withCredentials: true}) //쿠키와 함께 보내기 true.
                if (res.data && res.data.rank){
                    setRank(res.data.rank);
                }
            }catch{
                navigate('/'); //로그인 안되어 있다면 로그인페이지로 돌아간다.
            }
        }
        getRank();
    }, [showModal]);

    useEffect(() => {
        checkOnline(userInfo.id);
    }, [userInfo]);

    useEffect(() => {
        initRelate();
    }, [userInfo]);

    async function initRelate() {
        try{
            const res = await axios.get('http://' + REACT_APP_HOST + ':3000/api/friend/relate/' + userInfo.id, {withCredentials: true});
            setRelate(res.data);
        }catch{
            //nothing relate...
        }
    }

    async function initUserInfo(userId: number){
        try{
            const res = await axios.get('http://' + REACT_APP_HOST + ':3000/api/user/' + showModal.userId, {withCredentials: true});
            let totalGame = res.data.wins + res.data.loses;
            let myInfo : types.User = {
                id : res.data.id,
                avatar: res.data.avatar,
                userName : res.data.username as string,
                myProfile : true,
                userStatus : 'off',
                rank : 0,
                odds : !res.data.wins ? 0 : Math.floor(100 / (totalGame / (res.data.wins ? res.data.wins : 1))),
                record : [],
            };
            setUserInfo(myInfo);
        }catch{
            //nothing res...
        }
    }

    //온오프라인 게임중 검사하는 메소드.
    function checkOnline(userId: number){
        socket.emit('api/get/user/status', userId); 
        socket.on('api/get/user/status', (status, targetId) => {
            if (targetId !== 0)
                setOnlineStatus(status);
        })
        return (() => {
            socket.off('api/get/user/status');
        })
    }

    function showStatus(status: string){
        switch(status) {
            case "offline":
                return (
                    <div className="profile-status">
                        <FontAwesomeIcon style={{color: "#FE346E"}} icon={faCircle}/> Offline
                    </div>
                );
            case "ingame":
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
                return (
                    <div className="profile-status">
                        <FontAwesomeIcon style={{color: "#00BDAA"}} icon={faCircle}/> Online
                    </div>
                );
        }
    }

    //친추.
    async function handleFollow(event: React.MouseEvent<HTMLElement>) {
        event.preventDefault();
        try{
            const res = await axios.post('http://' + REACT_APP_HOST + ':3000/api/friend', {otherID : userInfo.id}, {withCredentials: true})
            toast.success('send follow');
            await initRelate();
        }catch(err: any){   
            toast.error(err.response.data.message);
            await initRelate();
        }
    };

    //언팔.
    async function handleUnfollow(event: React.MouseEvent<HTMLElement>) {
        event.preventDefault();
        try{
            const res = await axios.patch('http://' + REACT_APP_HOST + ':3000/api/friend', {otherID : userInfo.id}, {withCredentials: true})
            toast.success('unfollow ok');
            await initRelate();
        }catch(err: any){   
            toast.error(err.response.data.message);
            await initRelate();
        }
    };

    // 차단
    async function handleBlock(event: React.MouseEvent<HTMLElement>) {
        event.preventDefault();
        try{
            await axios.post('http://' + REACT_APP_HOST + ':3000/api/friend/block', {otherID : userInfo.id}, {withCredentials: true})
            toast.success('target block ok');
            await initRelate();
        }catch(err: any){   
            toast.error(err.response.data.message);
            await initRelate();
        }
    };

    // 차단 해제
    async function handleUnblock(event: React.MouseEvent<HTMLElement>) {
        event.preventDefault();
        try{
            await axios.patch('http://' + REACT_APP_HOST + ':3000/api/friend/block', {otherID : userInfo.id}, {withCredentials: true})
            toast.success('target unblock ok');
            await initRelate();
        }catch(err: any){   
            toast.error(err.response.data.message);
            await initRelate();
        }
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
        if (showModal.userId !== 0){
            checkOnline(showModal.userId);
        } else {
            checkOnline(userInfo.id);
        }
        if (onlineStatus !== 'ingame'){
            toast.error('게임 중이 아님');
            return ;
        }
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
        })
    }

    function sendDm(event: React.MouseEvent<HTMLElement>) {
        resetState();
        navigate(`/dm/${userInfo.id}`, {state: {
            targetId: userInfo.id
        }});
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
                {relate === 'accepted' ? 
                <button className="profile-button" onClick={handleUnfollow}>
                    <FontAwesomeIcon icon={faUserMinus}/> Unfollow
                </button> :
                <button className="profile-button" onClick={handleFollow}>
                    <FontAwesomeIcon icon={faUserPlus}/> Follow
                </button>}
                {relate === 'blocked' ? 
                <button className="profile-button" onClick={handleUnblock}>
                    <FontAwesomeIcon icon={faUser}/> Unblock
                </button> :
                <button className="profile-button" onClick={handleBlock}>
                    <FontAwesomeIcon icon={faUserSlash}/> Block
                </button>}
                <button className="profile-button" onClick={sendDm}>
                    <FontAwesomeIcon icon={faPaperPlane}/> DM
                </button>
            </div>
        )
    }

    const getClickUser = () : types.User => {
        return userInfo;
    }

    if (showModal.show) {
        return (
            <ModalBase reset={resetState}>
                <ProfileEditModal name={userInfo.userName}/>
                <ProfileModalWrapper>
                    <div className="profile-box">
                        {avatarFile !== '' ?
                        <img className="profile-image" src={avatarFile} alt={userInfo.userName + '-profile'} />
                        : <img className="profile-image" src="/favicon.ico" alt={userInfo.userName + '-profile'} />}
                    </div>
                    {profileButton()}
                    <div className="profile-name">
                        ID : {userInfo.userName}
                    </div>
                    {showStatus(onlineStatus)}   
                    <div className="profile-rank">
                        Rank : {rank}
                    </div>
                    <div className="profile-odds">
                        Odds : {userInfo.odds} %
                    </div>
                    <div className="record-title">최근 10경기 전적</div>
                </ProfileModalWrapper>
                <GameRecordList user={getClickUser()}/>
            </ModalBase>
        )
    }
    return null;
}

export default ProfileModal;