import React, { useState } from "react";
import ModalBase from "./ModalBase";
import { useRecoilState } from "recoil";
import { profileEditModalState } from "../../states/recoilModalState";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {  } from "@fortawesome/free-solid-svg-icons";

function ProfileEditModal() {
    const [showModal, setShowModal] = useRecoilState(profileEditModalState);
    const [avatar, setAvatar] = useState("https://cdn.myanimelist.net/images/characters/11/421848.jpg");
    const [username, setUsername] = useState("Pinga");
    // const navigate = useNavigate();

    //프로필 아바타 및 이름 변경.
    function handleSubmit(event : any) {
        event.preventDefault();
        axios.patch('http://localhost:3000/api/user', {code : avatar, username : username}, {withCredentials: true})
        .then(res => {
            // console.log(res.status);
            //변경 성공.
        })
        .catch(err => {
          console.log('invalid');
        })
    };

    //2단계 켜기.
    function handle2FASubmit(event : any) {
        event.preventDefault();
        axios.patch('http://localhost:3000/api/fa2', {}, {withCredentials: true})
        .then(res => {
          if (res.status === 200)
            console.log('2fa on');
        })
        .catch(err => {
          console.log('invalid');
        })
    };

    //2단계 끄기.
    function handleOff2FASubmit(event : any) {
        event.preventDefault();
        axios.delete('http://localhost:3000/api/fa2', {withCredentials: true})
        .then(res => {
          if (res.status === 200)
            console.log('2fa off');
        })
        .catch(err => {
          console.log('invalid');
        })
    };

    if (showModal) {
        return (
            <ModalBase setter={setShowModal}>
                <h1>Profile Edit Modal</h1>
                {/* <div className="profile-edit-wrapper">
                    <div className="profile-edit-box">
                            <img className="profile-edit-image" src="https://cdn.myanimelist.net/images/characters/11/421848.jpg" alt="{userInfo.userName}-profile" />
                    </div>
                </div> */}
                <div className="profile-button-wrapper">
                    Avatar : <input id="avatar" name="avatar" type="text" placeholder="https://cdn.myanimelist.net/images/characters/11/421848.jpg" onChange={event => setAvatar(event.target.value)} value={avatar} />
                    Name : <input id="username" name="username" type="text" placeholder="" onChange={event => setUsername(event.target.value)} value={username} />
                    <button className="profile-button" onClick={handleSubmit}>
                        수정
                    </button>
                </div>
                <div className="profile-button-wrapper">
                    <button className="profile-button" onClick={handle2FASubmit}>
                        2단계 활성화
                    </button>
                    <button className="profile-button" onClick={handleOff2FASubmit}>
                        2단계 비활성화
                    </button>
                </div>
                <div className="profile-button-wrapper">
                    [프로필 비공개 구현중...]
                    <button className="profile-button" >
                        프로필 공개
                    </button>
                    <button className="profile-button" >
                        프로필 비공개
                    </button>
                </div>
            </ModalBase>
        )
    }
    return null;
}

export default ProfileEditModal;

function userState(): [any, any] {
    throw new Error("Function not implemented.");
}
