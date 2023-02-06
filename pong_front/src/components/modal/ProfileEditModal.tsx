import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import ModalBase from "./ModalBase";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { profileEditModalState, profileModalState } from "../../states/recoilModalState";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { REACT_APP_HOST } from "../../util/configData";

function ProfileEditModal(props: {name: string}) {
    // const [showModal, setShowModal] = useRecoilState(profileEditModalState);
    const showModal = useRecoilValue(profileEditModalState);
    const resetState = useResetRecoilState(profileEditModalState);
    const resetParentState = useResetRecoilState(profileModalState);
    const [avatar, setAvatar] = useState("https://cdn.myanimelist.net/images/characters/11/421848.jpg");
    const [username, setUsername] = useState(props.name);
    const [status2fa, setStatus2fa] = useState(false);
    const [avatarFile, setAvatarFile] = useState('');
    const inputRef = useRef<HTMLInputElement | null> (null);
    const navigate = useNavigate();

    useEffect(() => {
        // TODO: 유저 정보를 받아온다.
        // setUserInfo();
        axios.get('http://' + REACT_APP_HOST + ':3000/api/fa2/status', {withCredentials: true}) //쿠키와 함께 보내기 true.
        .then(res => {
            if (res.data){
                setStatus2fa(res.data.twofa);
            } else {
                alert('nodata 2fa : ' + res.data);
            }
        })
        .catch(err => {
            console.log(err.response);
            navigate('/');
        })
    }, []);

    //프로필 아바타 및 이름 변경.
    function handleSubmit(event : any) {
        event.preventDefault();
        axios.patch('http://' + REACT_APP_HOST + ':3000/api/user', {avatar : avatar, username : username}, {withCredentials: true})
        .then(res => {
            //변경 성공.
            resetState();
        })
        .catch(err => {
            alert("Name in use");
        })
    };
    //2단계 켜기.
    function handle2FASubmit(event : any) {
        event.preventDefault();
        axios.patch('http://' + REACT_APP_HOST + ':3000/api/fa2', {}, {withCredentials: true})
        .then(res => {
          if (res.status === 200)
            setStatus2fa(true);
        })
        .catch(err => {
        //   alert('invalid : 2fa on');
        })
        navigate('/');
        resetState();
        resetParentState();
    };

    //2단계 끄기.
    function handleOff2FASubmit(event : any) {
        event.preventDefault();
        axios.delete('http://' + REACT_APP_HOST + ':3000/api/fa2', {withCredentials: true})
        .then(res => {
          if (res.status === 200)
            setStatus2fa(false);
        })
        .catch(err => {
            navigate('/');
            resetState();
            resetParentState();
        })
    };

    //파일 업로드.
    function handleFileSubmit(event : any) {
        event.preventDefault();
        if (inputRef.current && inputRef.current.value)
		{
			//update Avatar here
			axios.post('http://' + REACT_APP_HOST + ':3000/api/user/avatar', {file: inputRef.current.files![0]}, {withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' }})
			.then((res) => {
				alert("upload success");
			})
			.catch((err) => {
				alert("upload fail");
			})
		}
    };

    function onAvatar(e: ChangeEvent<HTMLInputElement>) {
		const image: File = e.target.files![0];
		setAvatarFile(URL.createObjectURL(image));
	}

    if (showModal) {
        return (
            <ModalBase reset={resetState}>
                <h1>Profile Edit Modal</h1>
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
                <div className="profile-button-wrapper">
                    <input ref={inputRef} type="file" id="img" name="img" accept="image/*" onChange={onAvatar}/>
                    <button className="profile-button" onClick={handleFileSubmit}>
                        업로드
                    </button>
                </div>
            </ModalBase>
        )
    }
    return null;
}
export default ProfileEditModal;
