import React, {useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import useCheckLogin from '../../util/useCheckLogin';
import { REACT_APP_HOST } from '../../common/configData';
import { ContentBox } from '../../common/styles/ContentBox';
import { InputTextWrapper } from '../../common/styles/InputTextWrapper';
import {ProfileBox} from '../../common/styles/ProfileBox.style';

export default function ProfileInitPage() {
  useCheckLogin();

  const [username, setUsername] = useState('');
  const inputRef = useRef<HTMLInputElement | null> (null);
  const [avatarFile, setAvatarFile] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://' + REACT_APP_HOST + ':3000/api/user/init/status', {withCredentials: true})
    .then(res => {
      if (res.data && res.data.msg === true)
        navigate('/lobby');
    })
    .catch(err => {
        navigate('/'); //로그인 안되어 있다면 로그인페이지로 돌아간다.
    });
  }, []);

  //프로필 아바타 및 이름 변경.
  function handleInitSubmit(event : any) {
    event.preventDefault();
      axios.patch('http://' + REACT_APP_HOST + ':3000/api/user', { username : username }, {withCredentials: true})
      .then(res => {
          if (inputRef.current && inputRef.current.value)
          {
            axios.post('http://' + REACT_APP_HOST + ':3000/api/user/avatar', {file: inputRef.current.files![0]}, {withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' }})
            .then((res) => {
              navigate('/lobby');
            })
            .catch((err) => {
              alert("img upload fail");
            })
            return ;
          }
          navigate('/lobby');
      })
      .catch(err => {
          alert("Name in use");
      });
  };

  function handleInitKey(event : React.KeyboardEvent<HTMLDivElement>) {
      if (event.key !== 'Enter')
        return ;
      event.preventDefault();
      handleInitSubmit(event);
  };

  function onAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const image: File = e.target.files![0];
    setAvatarFile(URL.createObjectURL(image));
  }
  return (
    <ContentBox>
      <h1>Profile Init</h1>
      <ProfileBox>
        {avatarFile !== '' ?
        <img className="profile-image" src={avatarFile}/>  
        : null}
      </ProfileBox>
      <InputTextWrapper>
        <span>Avatar : </span>
        <input ref={inputRef} type="file" id="img" name="img" accept="image/*" onChange={onAvatar}/>
      </InputTextWrapper>
      <InputTextWrapper>
        <span>Name : </span>
        <input onKeyDown={handleInitKey} type="text" placeholder="사용 할 이름" onChange={event => setUsername(event.target.value)} value={username} />
      </InputTextWrapper>
      <button className="profile-button" onClick={handleInitSubmit}>
          입장
      </button>
    </ContentBox>
  );
}