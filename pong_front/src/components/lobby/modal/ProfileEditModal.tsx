import { ChangeEvent, useEffect, useRef, useState } from "react";
import ModalBase from "../../modal/ModalBase";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { profileEditModalState, profileModalState } from "../../../common/states/recoilModalState";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { REACT_APP_HOST } from "../../../common/configData";
import { toast } from "react-toastify";

import { Typography, Stack, Avatar, Button, TextField, Divider } from '@mui/material'
import { PhotoCamera } from '@mui/icons-material';
import { DefaultButton } from "../../common";

function ProfileEditModal(props: {name: string}) {
    const showModal = useRecoilValue(profileEditModalState);
    const resetState = useResetRecoilState(profileEditModalState);
    const resetParentState = useResetRecoilState(profileModalState);
    const [username, setUsername] = useState(props.name);
    const [status2fa, setStatus2fa] = useState(false);
    const [avatarFile, setAvatarFile] = useState('');
    const inputRef = useRef<HTMLInputElement | null> (null);
    const navigate = useNavigate();

    useEffect(() => {
        // setUserInfo();
        axios.get('http://' + REACT_APP_HOST + '/api/fa2/status', {withCredentials: true}) //쿠키와 함께 보내기 true.
        .then(res => {
            if (res.data){
                setStatus2fa(res.data.twofa);
            } else {
                toast.error('nodata 2fa : ' + res.data);
            }
        })
        .catch(err => {

        })
    }, []);

    //프로필 아바타 및 이름 변경.
    function handleSubmit(event : any) {
        event.preventDefault();
        axios.patch('http://' + REACT_APP_HOST + '/api/user', {username : username}, {withCredentials: true})
        .then(res => {
            //변경 성공.
            resetState();
        })
        .catch(err => {
            //alert(err.response.data.message);
            toast.error("적절하지 않은 이름입니다.");
        })
    };
    //2단계 켜기.
    function handle2FASubmit(event : any) {
        event.preventDefault();
        axios.patch('http://' + REACT_APP_HOST + '/api/fa2', {}, {withCredentials: true})
        .then(res => {
          if (res.status === 200){
            toast.success("2단계 인증 활성화 완료.");
            setStatus2fa(true);

          } else {
            toast.error("2단계 인증 활성화 실패");
          }
        })
        .catch(err => {
            toast.error("서버 2단계 인증 지원안됨.");
        })
    };

    //2단계 끄기.
    function handleOff2FASubmit(event : any) {
        event.preventDefault();
        axios.delete('http://' + REACT_APP_HOST + '/api/fa2', {withCredentials: true})
        .then(res => {
          if (res.status === 200){
            toast.success("2단계 인증 비활성화 완료.");
            setStatus2fa(false);
          } else {
            toast.error("2단계 인증 비활성화 실패.")
          }
        })
        .catch(err => {
            toast.error("2단계 인증 비활성화 실패.")
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
			axios.post('http://' + REACT_APP_HOST + '/api/user/avatar', {file: inputRef.current.files![0]}, {withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' }})
			.then((res) => {
				toast.success("아바타 변경 완료");
			})
			.catch((err) => {
				toast.error("아바타 변경 실패");
			})
            return ;
        }
        toast.error("파일이 지정되지 않음");
    };

    function onAvatar(e: ChangeEvent<HTMLInputElement>) {
        try{
            const image: File = e.target.files![0];
            if (image.size >= ((1 << 20) * 4))
                throw("4MB미만 업로드 가능.");
            setAvatarFile(URL.createObjectURL(image));
        }catch(err: any){
            if (err){
                toast.error(err);
            } else {
                toast.error("이미지 파일 지정 취소됨.");
            }
        }
	}

    return (
        <ModalBase open={showModal} reset={resetState} closeButton>
            <Stack 
                justifyContent="center"
                alignItems="center"
                rowGap={2}
            >
                <Typography variant="h3" gutterBottom sx={{marginLeft: "2rem", marginRight: "2rem"}}> Edit Profile </Typography>
                <Stack 
                    direction="row"
                    spacing={1}
                    alignItems="center"
                >
                    <Avatar src={avatarFile} alt="profile avatar" variant="rounded" sx={{ width: 100, height: 100 }} />
                    <Button variant="outlined" startIcon={<PhotoCamera />} size="small" component="label">
                        <input ref={inputRef} onChange={onAvatar} id="avatar" name="avatar" hidden accept="image/*" type="file" />
                        파일 업로드
                    </Button>
                </Stack>
                <DefaultButton size="small" onClick={handleFileSubmit} fullWidth>아바타 변경</DefaultButton>
                <Divider sx={{width: "100%"}}/>
                <TextField 
                    id="username"
                    name="username"
                    label="Name"
                    variant="standard"
                    size="small"
                    defaultValue={props.name}
                    value={username}
                    onChange={event => setUsername(event.target.value)}
                />
                <DefaultButton size="small" onClick={handleSubmit} fullWidth>이름 변경</DefaultButton>
                { !status2fa?
                    <DefaultButton size="small" onClick={handle2FASubmit} fullWidth>
                        2단계 활성화
                    </DefaultButton> :
                    <DefaultButton size="small" onClick={handleOff2FASubmit} fullWidth>
                        2단계 비활성화
                    </DefaultButton> }
            </Stack>
        </ModalBase>
    )
}
export default ProfileEditModal;
