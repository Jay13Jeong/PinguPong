import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ModalBase from "./ModalBase";
import GameRecordList from "../util/card/GameRecordList";
import { useSetRecoilState , useRecoilState } from "recoil"
import { profileEditModalState, profileModalState } from "../../states/recoilModalState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faUserPen, faUserPlus, faUserMinus, faUser, faUserSlash, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import "./ProfileModal.scss"
import * as types from "./User"

/**
 * profileModalState
 * default: {
        userId: 0,
        show: false
    }
 */

function ProfileModal() {
    const  [showModal, setShowModal] = useRecoilState(profileModalState);
    const setProfileEditState = useSetRecoilState(profileEditModalState);

    // const [userInfo, setUserInfo] = useState<types.user>({
    //     userName: "pinga",
    //     myProfile: true,    // TODO - 더 좋은 방법이 있을지 생각해보기
    //     userStatus: "on",
    //     rank: 0,
    //     odds: 0,
    //     record: [
    //         {idx: 1, p1: "cheolee", p2: "jjeong", p1Score: 10, p2Score: 2},
    //         {idx: 2, p1: "cheolee", p2: "jjeong", p1Score: 10, p2Score: 1},
    //         {idx: 3, p1: "cheolee", p2: "jjeong", p1Score: 10, p2Score: 10},
    //         {idx: 4, p1: "cheolee", p2: "jjeong", p1Score: 1, p2Score: 10},
    //         {idx: 5, p1: "cheolee", p2: "jjeong", p1Score: 10, p2Score: 10},
    //         {idx: 6, p1: "jeyoon", p2: "jjeong", p1Score: 10, p2Score: 5}
    //     ]
    // });    // 유저 정보

    const [userInfo, setUserInfo] = useState<types.user>({
        userName: "pingi",
        myProfile: false,    // TODO - 더 좋은 방법이 있을지 생각해보기
        userStatus: "game",
        rank: 0,
        odds: 0,
        record: [
            {idx: 1, p1: "cheolee", p2: "jjeong", p1Score: 10, p2Score: 2},
            {idx: 2, p1: "cheolee", p2: "jjeong", p1Score: 10, p2Score: 1}
        ],
        following: false,
        block: false,
    });    // 유저 정보

    useEffect(() => {
        // TODO: 유저 정보를 받아온다.
        // setUserInfo();
    }, []);

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
                {userInfo.following ? 
                <button className="profile-button">
                    <FontAwesomeIcon icon={faUserMinus}/> Unfollow
                </button> :
                <button className="profile-button">
                    <FontAwesomeIcon icon={faUserPlus}/> Follow
                </button>}
                {userInfo.block ? 
                <button className="profile-button">
                    <FontAwesomeIcon icon={faUser}/> Unblock
                </button> :
                <button className="profile-button">
                    <FontAwesomeIcon icon={faUserSlash}/> Block
                </button>}
                <button className="profile-button">
                    <FontAwesomeIcon icon={faPaperPlane}/> DM
                </button>
            </div>
        )
    }

    

    if (showModal.show) {
        return (
            <ModalBase setter={setShowModal}>
                {/* TODO - 프로필 이미지? */}
                <div className="profile-wrapper">
                    <div className="profile-box">
                        <img className="profile-image" src="https://cdn.myanimelist.net/images/characters/11/421848.jpg" alt="{userInfo.userName}-profile" />
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