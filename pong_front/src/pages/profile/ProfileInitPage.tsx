import React, {useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import useCheckLogin from '../../util/useCheckLogin';
import { REACT_APP_HOST } from '../../common/configData';
import { RoutePath } from '../../common/configData';
import { toast } from 'react-toastify';

import { Typography, Avatar, Stack, IconButton,TextField } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';

import { DefaultBox, DefaultButton } from '../../components/common';

export default function ProfileInitPage() {
  useCheckLogin();

  const [username, setUsername] = useState('');
  const inputRef = useRef<HTMLInputElement | null> (null);
  const [avatarFile, setAvatarFile] = useState('');
  const [error, setError] = useState<boolean>(false);
  const [helperText, setHelperText] = useState<string>("10글자 이내로 입력해주세요.");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://' + REACT_APP_HOST + '/api/user/init/status', {withCredentials: true})
    .then(res => {
      if (res.data && res.data.msg === true)
        navigate(RoutePath.lobby);
    })
    .catch(err => {
        navigate(RoutePath.root); //로그인 안되어 있다면 로그인페이지로 돌아간다.
    });
  }, []);

  //프로필 아바타 및 이름 변경.
  function handleInitSubmit(event : any) {
    event.preventDefault();
      axios.patch('http://' + REACT_APP_HOST + '/api/user', { username : username }, {withCredentials: true})
      .then(res => {
          if (inputRef.current && inputRef.current.value)
          {
            axios.post('http://' + REACT_APP_HOST + '/api/user/avatar', {file: inputRef.current.files![0]}, {withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' }})
            .then((res) => {
              navigate(RoutePath.lobby);
            })
            .catch((err) => {
              toast.error("img upload fail");
            })
            return ;
          }
          navigate(RoutePath.lobby);
      })
      .catch(err => {
        setError(true);
        setHelperText(err.response.data.message);
      });
  };

  function onAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const image: File = e.target.files![0];
    setAvatarFile(URL.createObjectURL(image));
  }
  return (
    <DefaultBox>
    <Stack
      spacing={2}
    >
      <Typography variant='h2' component='h1' sx={{marginBottom: '10px'}}>Profile Init</Typography>
      <Stack 
        direction="row"
        spacing={1}
        alignItems="center"
      >
        <Avatar src={avatarFile} alt="profile avatar" variant="rounded" sx={{ width: 150, height: 150 }} />
        <IconButton color="primary" aria-label="upload-avatar" component="label" size="large" >
          <input ref={inputRef} onChange={onAvatar} id="avatar" name="avatar" hidden accept="image/*" type="file" />
          <PhotoCamera />
        </IconButton>
      </Stack>
      <TextField 
        id="username" 
        label="user name" 
        variant="outlined" 
        size="small"
        helperText={helperText}
        error={error ? true : false}
        onChange={event => setUsername(event.target.value)}
      />
      <DefaultButton onClick={handleInitSubmit}>
          완료
      </DefaultButton>
    </Stack>
    </DefaultBox>
  );
}