import { useState, useEffect, useContext } from "react";
import { SocketContext } from "../../../common/states/contextSocket";
import { useNavigate } from "react-router-dom";
import ModalBase from "../../modal/ModalBase";
import GameRecordList from "../../card/game/GameRecordList";
import { useSetRecoilState , useResetRecoilState, useRecoilValue } from "recoil"
import { otherProfileModalState, profileEditModalState, profileModalState } from "../../../common/states/recoilModalState";
import * as types from "../../../common/types/User"
import axios from "axios";
import ProfileEditModal from "./ProfileEditModal";
import { REACT_APP_HOST } from "../../../common/configData";

import { Grid, Avatar, Typography, Divider, Stack } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit';
import CircleIcon from '@mui/icons-material/Circle';
import { DefaultButton } from "../../common";

function ProfileModal() {
    const showEditModal = useRecoilValue(profileEditModalState);
    const showModal = useRecoilValue(profileModalState);
    const setProfileEditState = useSetRecoilState(profileEditModalState);
    const setOtherProfileEditState = useSetRecoilState(otherProfileModalState);
    const resetState = useResetRecoilState(profileModalState);
    const [avatarFile, setAvatarFile] = useState(''); //대상의 아바타.
    const [onlineStatus, setOnlineStatus] = useState('offline'); // 대상의 상태 (온,오프,게임중).
    const [rank, setRank] = useState<number>(0); // 대상의 게임순위.
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
                const res = await axios.get('http://' + REACT_APP_HOST + '/api/user', {withCredentials: true}) //쿠키와 함께 보내기 true.
                if (res.data === null || res.data === undefined)
                    return ;
                if (showModal.userId !== res.data.id && showModal.userId !== 0){ //id 0은 빈 값.
                    setOtherProfileEditState({
                        userId: showModal.userId,
                        show: true,
                    });
                    resetState();
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
                    getAvatarData(res.data.id);
                }
            }catch{ }
        }
        initProfileData();
    }, [showModal, showEditModal]);

    useEffect(() => {
        const getRank = async () =>{
            try{
                const res = await axios.get('http://' + REACT_APP_HOST + '/api/user/rank/' + (showModal.userId !== 0 ? showModal.userId : userInfo.id) , {withCredentials: true}) //쿠키와 함께 보내기 true.
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

    const getAvatarData = async (id : any) => {
        try{
            const avatarDataRes = await axios.get('http://' + REACT_APP_HOST + '/api/user/avatar/' + id, {withCredentials: true, responseType: 'blob'}) //blob : 파일전송용 큰 객체타입.
            setAvatarFile(URL.createObjectURL(avatarDataRes.data));
        }catch{
            //no avatar data...
        }
    }

    //온오프라인 게임중 검사하는 메소드.
    function checkOnline(userId: number){
        socket.emit('getUserStatus', userId); 
        socket.on('getUserStatus', (status, targetId) => {
            if (targetId !== 0)
                setOnlineStatus(status);
        })
        return (() => {
            socket.off('getUserStatus');
        })
    }

    const profileItems = [
        <Avatar src={avatarFile !== '' ? avatarFile : '/favicon.ico'} alt={userInfo.userName + '-profile'} variant="rounded" sx={{ width: 150, height: 150 }} />,
        <DefaultButton startIcon={<EditIcon/>} onClick={() => setProfileEditState(true)}>
            Edit Profile
        </DefaultButton>,
        <Typography variant="subtitle1" component='div'>ID : {userInfo.userName}</Typography>,
        (() => {
                switch (onlineStatus) {
                    case "offline" :
                        return <div>
                                <CircleIcon sx={{color: "#FE346E", display: "inline-block", verticalAlign: "middle"}}/>
                                <Typography variant="subtitle1" component='span' sx={{display: "inline-block", verticalAlign: "middle"}}>Offline</Typography>
                            </div>
                    case "ingame":
                        return <div>
                            <CircleIcon sx={{color: "#400082", display: "inline-block", verticalAlign: "middle"}}/>
                            <Typography variant="subtitle1" component='span' sx={{display: "inline-block", verticalAlign: "middle"}}>In Game</Typography>
                        </div>
                    default:
                        return <div>
                            <CircleIcon sx={{color: "#00BDAA", display: "inline-block", verticalAlign: "middle"}}/>
                            <Typography variant="subtitle1" component='span' sx={{display: "inline-block", verticalAlign: "middle"}}>Online</Typography>
                        </div>
                }
            })(),
        <Typography variant="subtitle1" component='div'>Rank : {rank}</Typography>,
        <Typography variant="subtitle1" component='div'>Odds : {userInfo.odds} %</Typography>
    ]

    return (
        <ModalBase open={showModal.show} reset={resetState} closeButton>
            <ProfileEditModal name={userInfo.userName}/>
            <Stack 
                justifyContent="center"
                alignItems="center"
            >
                <Typography variant="h2" gutterBottom >🤩 Profile 🤩</Typography>
                <Grid container columns={2} rowSpacing={1}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    { profileItems.map((item, index) => (
                        <Grid item key={index} xs={1} 
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                        >
                            {item}
                        </Grid>
                    )) }
                </Grid>
                <Divider />
                <Typography variant="subtitle2" >최근 10경기 전적</Typography>
                <GameRecordList user={userInfo}/>
            </Stack>
        </ModalBase>
    )
}
export default ProfileModal;