import React, { useEffect, useState } from "react";
import ModalBase from "./ModalBase";
import { useRecoilState } from "recoil";
import { profileEditModalState } from "../../states/recoilModalState";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { faL } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {  } from "@fortawesome/free-solid-svg-icons";

function ProfileEditModal(props: {name: string}) {
    const [showModal, setShowModal] = useRecoilState(profileEditModalState);
    const [avatar, setAvatar] = useState("https://cdn.myanimelist.net/images/characters/11/421848.jpg");
    const [username, setUsername] = useState(props.name);
    const [status2fa, setStatus2fa] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // TODO: 유저 정보를 받아온다.
        // setUserInfo();
        axios.get('http://localhost:3000/api/fa2/status', {withCredentials: true}) //쿠키와 함께 보내기 true.
        .then(res => {
            if (res.data){
                setStatus2fa(res.data.twofa);
            } else {
                console.log('nodata 2fa : ' + res.data);
            }
        })
        .catch(err => {
            // if (err.response.data.statusCode === 401)
            // navigate('/'); //로그인 안되어 있다면 로그인페이지로 돌아간다.
        })
    }, []);

    //프로필 아바타 및 이름 변경.
    function handleSubmit(event : any) {
        event.preventDefault();
        axios.patch('http://localhost:3000/api/user', {avatar : avatar, username : username}, {withCredentials: true})
        .then(res => {
            // console.log(res.status);
            //변경 성공.
            setShowModal(false);
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
            setStatus2fa(true);
            // alert('2fa on');
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
            setStatus2fa(false);
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
                    Avatar : 
                    <select onChange={event => setAvatar(event.target.value)} value={avatar}>
                        <option value="default.jpeg" key="default.jpeg">Pinga</option>
                        <option value="favicon.ico" key="favicon.ico">Pingu</option>
                        <option value="logo192.png" key="logo192.png">React</option>
                    </select>
                    Name : <input id="username" name="username" type="text" placeholder="" onChange={event => setUsername(event.target.value)} value={username} />
                    <button className="profile-button" onClick={handleSubmit}>
                        수정
                    </button>
                </div>
                <div className="profile-button-wrapper">
                    {!status2fa?
                    <button className="profile-button" onClick={handle2FASubmit}>
                        2단계 활성화
                    </button> :
                    <button className="profile-button" onClick={handleOff2FASubmit}>
                    2단계 비활성화
                    </button>}
                </div>
            </ModalBase>
        )
    }
    return null;
}

export default ProfileEditModal;
