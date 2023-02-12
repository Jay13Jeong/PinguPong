// import React, { useState, useEffect, useContext } from "react";
// import { SocketContext } from "../../states/contextSocket";
// import { Link, useNavigate } from "react-router-dom";
// import ModalBase from "./ModalBase";
// import GameRecordList from "../util/card/GameRecordList";
// import { useSetRecoilState , useRecoilState, useResetRecoilState, useRecoilValue } from "recoil"
// import { profileEditModalState, profileModalState } from "../../states/recoilModalState";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCircle, faUserPen } from "@fortawesome/free-solid-svg-icons";
// import "./ProfileModal.scss"
// import * as types from "../profile/User"
// import axios from "axios";
// import ProfileEditModal from "./ProfileEditModal";
// import { REACT_APP_HOST } from "../../util/configData";
// import useGetData from "../../util/useGetData";

// function ProfileModal() {
//     const showEditModal = useRecoilValue(profileEditModalState);
//     const showModal = useRecoilValue(profileModalState);
//     const setProfileEditState = useSetRecoilState(profileEditModalState);
//     const resetState = useResetRecoilState(profileModalState);
//     const [avatarFile, setAvatarFile] = useState('');
//     const [onlineStatus, setOnlineStatus] = useState('offline');
//     const [rank, setRank] = useState<number>(0);
//     // const [data, error, isLoading] = useGetData('http://' + REACT_APP_HOST + ':3000/api/user');

//     const socket = useContext(SocketContext);
    
//     const [userInfo, setUserInfo] = useState<types.User>({
//         id: 0,
//         avatar: "https://cdn.myanimelist.net/images/characters/11/421848.jpg",
//         userName: "pinga", myProfile: true, userStatus: "on",rank: 0,odds: 0,record: []
//     });    // 유저 정보

//     const navigate = useNavigate();

//     useEffect(() => {
//         // TODO: 유저 정보를 받아온다.
//         const initProfileData = async () => {
//             try{
//                 const res = await axios.get('http://' + REACT_APP_HOST + ':3000/api/user', {withCredentials: true}) //쿠키와 함께 보내기 true.
//                 if (res.data === null || res.data === undefined)
//                     return ;
//                 if (showModal.userId !== res.data.id && showModal.userId !== 0){ //id 0은 빈 값.
//                     setUserInfo(showModal.user? showModal.user : userInfo);
//                 } else {
//                     let totalGame = res.data.wins + res.data.loses;
//                     let myInfo : types.User = {
//                         id : res.data.id,
//                         avatar: res.data.avatar,
//                         userName : res.data.username as string,
//                         myProfile : true,
//                         userStatus : 'off',
//                         rank : 0,
//                         odds : !res.data.wins ? 0 : Math.floor(100 / (totalGame / (res.data.wins ? res.data.wins : 1))),
//                         record : [],
//                     };
//                     setUserInfo(myInfo);
//                 }
//                 let targetId = res.data.id;
//                 if (showModal.userId !== res.data.id && showModal.userId !== 0){
//                     targetId = showModal.userId;
//                 }
//                 const getAvatarData = async (id : any) => {
//                     try{
//                         const avatarDataRes = await axios.get('http://' + REACT_APP_HOST + ':3000/api/user/avatar/' + id, {withCredentials: true, responseType: 'blob'}) //blob : 파일전송용 큰 객체타입.
//                         setAvatarFile(URL.createObjectURL(avatarDataRes.data));
//                     }catch{
//                         //no avatar data...
//                     }
//                 }
//                 getAvatarData(targetId);
//             }catch{ }
//         }
//         initProfileData();
//     }, [showModal, showEditModal]);

//     useEffect(() => {
//         // TODO: 유저 랭크를 받아온다.
//         const getRank = async () =>{
//             try{
//                 const res = await axios.get('http://' + REACT_APP_HOST + ':3000/api/user/rank/' + (showModal.userId !== 0 ? showModal.userId : userInfo.id) , {withCredentials: true}) //쿠키와 함께 보내기 true.
//                 if (res.data && res.data.rank){
//                     setRank(res.data.rank);
//                 }
//             }catch{
//                 navigate('/'); //로그인 안되어 있다면 로그인페이지로 돌아간다.
//             }
//         }
//         getRank();
//     }, [showModal]);

//     useEffect(() => {
//         if (showModal.userId !== 0){
//             socket.emit('api/get/user/status', showModal.userId);        
//         } else {
//             socket.emit('api/get/user/status', userInfo.id);    
//         }
//         socket.on('api/get/user/status', (status, targetId) => {
//             if (targetId !== 0)
//                 setOnlineStatus(status);
//         })
//         console.log(userInfo.id,onlineStatus);
//         return (() => {
//             socket.off('api/get/user/status');
//         })
//     }, [showModal]);

//     function showStatus(status: string){
//         switch(status) {
//             case "offline":
//                 return (
//                     <div className="profile-status">
//                         <FontAwesomeIcon style={{color: "#FE346E"}} icon={faCircle}/> Offline
//                     </div>
//                 );
//             case "ingame":
//                 return (
//                     <div className="profile-status">
//                         <FontAwesomeIcon style={{color: "#400082"}} icon={faCircle}/> In Game
//                     </div>
//                 );
//             default:
//                 return (
//                     <div className="profile-status">
//                         <FontAwesomeIcon style={{color: "#00BDAA"}} icon={faCircle}/> Online
//                     </div>
//                 );
//         }
//     }

//     const getClickUser = () : types.User => {
//         if (showModal.user)
//             return showModal.user;
//         return userInfo;
//     }

//     if (showModal.show) {
//         return (
//             <ModalBase reset={resetState}>
//                 <ProfileEditModal name={userInfo.userName}/>
//                 <div className="profile-wrapper">
//                     <div className="profile-box">
//                         {avatarFile !== '' ?
//                         <img className="profile-image" src={avatarFile} alt={userInfo.userName + '-profile'} />
//                         : <img className="profile-image" src="/favicon.ico" alt={userInfo.userName + '-profile'} />}
//                     </div>
//                     <div className="profile-button-wrapper">
//                         <button className="profile-button"
//                             onClick={(e) => setProfileEditState(true)}>
//                             <FontAwesomeIcon icon={faUserPen}/> Edit Profile
//                         </button>
//                     </div>
//                     <div className="profile-name">
//                         ID : {userInfo.userName}
//                     </div>
//                     {showStatus(onlineStatus)}   
//                     <div className="profile-rank">
//                         Rank : {rank}
//                     </div>
//                     <div className="profile-odds">
//                         Odds : {userInfo.odds} %
//                     </div>
//                     <div className="record-title">최근 10경기 전적</div>
//                 </div>
//                 <GameRecordList user={getClickUser()}/>
//             </ModalBase>
//         )
//     }
//     return null;
// }

// export default ProfileModal;

export {}