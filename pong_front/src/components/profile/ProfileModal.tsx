import React, { useState, useEffect } from "react";
import ModalBase from "./ModalBase";
import GameRecordList from "./GameRecordList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPen, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import "./ProfileModal.scss"
import * as types from "./User"

function ProfileModal(props: {setter: Function}) {

    const [userInfo, setUserInfo] = useState<types.user>({
        userName: "pinga",
        myProfile: false,    // TODO - 더 좋은 방법이 있을지 생각해보기
        userStatus: false,
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

    useEffect(() => {
        // TODO: 유저 정보를 받아온다.
        // setUserInfo();
    }, []);

    return (
        <ModalBase setter={props.setter}>
            {/* TODO - 프로필 이미지? */}
            <div className="profile-wrapper">
                <div className="profile-box">
                    <img className="profile-image" src="https://cdn.myanimelist.net/images/characters/11/421848.jpg" alt="{userInfo.userName}-profile" />
                </div>
                {userInfo.myProfile ? 
                    <button className="profile-button">
                        <FontAwesomeIcon icon={faUserPen}/> Edit Profile</button> : 
                    <button className="profile-button">
                        <FontAwesomeIcon icon={faUserPlus}/> Follow</button>}
                <div className="profile-name">
                    ID : {userInfo.userName}
                </div>
                <div className="profile-status">
                    Status : {userInfo.userStatus ? "Online" : "Offline"}
                </div>
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

export default ProfileModal;