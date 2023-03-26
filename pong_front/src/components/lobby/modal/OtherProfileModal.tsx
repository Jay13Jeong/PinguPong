import React, { useState, useEffect, useContext } from "react";
import { SocketContext } from "../../../common/states/contextSocket";
import { useNavigate } from "react-router-dom";
import ModalBase from "../../modal/ModalBase";
import GameRecordList from "../../card/game/GameRecordList";
import { useResetRecoilState, useRecoilValue } from "recoil"
import { otherProfileModalState, } from "../../../common/states/recoilModalState";
import * as types from "../../../common/types/User"
import axios from "axios";
import ProfileEditModal from "./ProfileEditModal";
import { REACT_APP_HOST } from "../../../common/configData";
import { toast } from "react-toastify";

import { Grid, Avatar, Typography, Divider, Stack, ButtonGroup } from '@mui/material'
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import GroupRemoveIcon from '@mui/icons-material/GroupRemove';
import PersonIcon from '@mui/icons-material/Person';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import SendIcon from '@mui/icons-material/Send';
import CircleIcon from '@mui/icons-material/Circle';
import { DefaultButton } from "../../common";

function OtherProfileModal() {
    const showModal = useRecoilValue(otherProfileModalState);
    const resetState = useResetRecoilState(otherProfileModalState);
    const [avatarFile, setAvatarFile] = useState(''); //대상의 아바타.
    const [onlineStatus, setOnlineStatus] = useState('offline'); // 대상의 상태 (온,오프,게임중).
    const [rank, setRank] = useState<number>(0); // 대상의 게임순위.
    const [relate, setRelate] = useState<string>('nothing');// 대상과 나의 관계.
    const socket = useContext(SocketContext); //소켓.
    const [userInfo, setUserInfo] = useState<types.User>({ //유저정보 기본값.
        id: 0,
        avatar: "https://cdn.myanimelist.net/images/characters/11/421848.jpg",
        userName: "pinga", myProfile: true, userStatus: "offline",rank: 0,odds: 0,record: []
    });    // 유저 정보

    const navigate = useNavigate();

    useEffect(() => {
        if (showModal.userId === 0)
            return;
        const initProfileData = async () => {
            try{
                await initUserInfo(showModal.userId);           
                getAvatarData(showModal.userId);
            }catch{ }
        }
        initProfileData();
        const getRank = async () =>{
            try{
                const res = await axios.get('http://' + REACT_APP_HOST + '/api/user/rank/' + (showModal.userId !== 0 ? showModal.userId : userInfo.id) , {withCredentials: true}) //쿠키와 함께 보내기 true.
                if (res.data && res.data.rank)
                    setRank(res.data.rank);
            }catch{
                navigate('/'); //로그인 안되어 있다면 로그인페이지로 돌아간다.
            }
        }
        getRank();
    }, [showModal]);

    useEffect(() => {
        checkOnline(userInfo.id);
        initRelate();
    }, [userInfo]);

    const getAvatarData = async (id : any) => {
        try{
            const avatarDataRes = await axios.get('http://' + REACT_APP_HOST + '/api/user/avatar/' + id, {withCredentials: true, responseType: 'blob'}) //blob : 파일전송용 큰 객체타입.
            setAvatarFile(URL.createObjectURL(avatarDataRes.data));
        }catch{
            //no avatar data...
        }
    }

    async function initRelate() {
        try{
            const res = await axios.get('http://' + REACT_APP_HOST + '/api/friend/relate/' + userInfo.id, {withCredentials: true});
            setRelate(res.data);
        }catch{
            //nothing relate...
        }
    }

    async function initUserInfo(userId: number){
        try{
            const res = await axios.get('http://' + REACT_APP_HOST + '/api/user/' + showModal.userId, {withCredentials: true});
            let totalGame = res.data.wins + res.data.loses;
            let myInfo : types.User = {
                id : res.data.id,
                avatar: res.data.avatar,
                userName : res.data.username as string,
                myProfile : false,
                userStatus : 'off',
                rank : 0,
                odds : !res.data.wins ? 0 : Math.floor(100 / (totalGame / (res.data.wins ? res.data.wins : 1))),
                record : [],
            };
            setUserInfo(myInfo);
        }catch{
            //nothing res...
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

    //친추.
    async function handleFollow(event: React.MouseEvent<HTMLElement>) {
        event.preventDefault();
        try{
            const res = await axios.post('http://' + REACT_APP_HOST + '/api/friend', {otherID : userInfo.id}, {withCredentials: true})
            toast.success('send follow');
            await initRelate();
        }catch(err: any){   
            toast.error(err.response.data.message);
            await initRelate();
        }
    };

    //언팔.
    async function handleUnfollow(event: React.MouseEvent<HTMLElement>) {
        event.preventDefault();
        try{
            const res = await axios.patch('http://' + REACT_APP_HOST + '/api/friend', {otherID : userInfo.id}, {withCredentials: true})
            toast.success('unfollow ok');
            await initRelate();
        }catch(err: any){   
            toast.error(err.response.data.message);
            await initRelate();
        }
    };

    // 차단
    async function handleBlock(event: React.MouseEvent<HTMLElement>) {
        event.preventDefault();
        try{
            await axios.post('http://' + REACT_APP_HOST + '/api/friend/block', {otherID : userInfo.id}, {withCredentials: true})
            toast.success('target block ok');
            await initRelate();
        }catch(err: any){   
            toast.error(err.response.data.message);
            await initRelate();
        }
    };

    // 차단 해제
    async function handleUnblock(event: React.MouseEvent<HTMLElement>) {
        event.preventDefault();
        try{
            await axios.patch('http://' + REACT_APP_HOST + '/api/friend/block', {otherID : userInfo.id}, {withCredentials: true})
            toast.success('target unblock ok');
            await initRelate();
        }catch(err: any){   
            toast.error(err.response.data.message);
            await initRelate();
        }
    };

    // 게임 관전 이동
    function watchHandler(event: React.MouseEvent<HTMLElement>) {
        if (showModal.userId !== 0){
            checkOnline(showModal.userId);
        } else {
            checkOnline(userInfo.id);
        }
        if (onlineStatus !== 'ingame'){
            toast.error('게임 중이 아님');
            return ;
        }
        /* 게임 목록 받아오기 */
        socket.emit('pingGetRoomList');
        socket.on('pingGetRoomList', (data: {p1: string, p2: string}[]) => {
            let target: {p1: string, p2: string} = {p1: "", p2: ""};
            /* 게임 목록에서 사용자 ID 찾기 */
            if (data.some((game) => {
                if (game.p1 === userInfo.userName || game.p2 === userInfo.userName) {
                    target = {...game};
                    return true;
                }
                else
                    return false;
            })) {
                // 게임에 유저가 존재하니 이동이 가능하다.
                socket.off('pingGetRoomList');
                socket.emit('watchGame', `${target.p1}vs${target.p2}`);
                resetState();
                navigate(`/game/watch/${target.p1}vs${target.p2}`, {state: {
                    player1: target.p1,
                    player2: target.p2
                }});
            }
            socket.off('pingGetRoomList');
            resetState();
        })
    }

    function sendDm(event: React.MouseEvent<HTMLElement>) {
        resetState();
        navigate(`/dm/${userInfo.id}`, {state: {
            targetId: userInfo.id
        }});
    }

    // const getClickUser = () : types.User => {
    //     return userInfo;
    // }

    const profileItems = [
        { width: 2, element: <Avatar src={avatarFile !== '' ? avatarFile : '/favicon.ico'} alt={userInfo.userName + '-profile'} variant="rounded" sx={{ width: 150, height: 150 }} />},
        { width: 4, element: 
            <ButtonGroup>
                { relate === 'accepted' ? 
                <DefaultButton onClick={handleUnfollow} startIcon={<GroupRemoveIcon/>}>Unfollow</DefaultButton> :
                <DefaultButton onClick={handleFollow} startIcon={<GroupAddIcon/>}>Follow</DefaultButton> }
                { relate === 'blocked' ? 
                <DefaultButton onClick={handleUnblock} startIcon={<PersonIcon/>}>Unblock</DefaultButton> :
                <DefaultButton onClick={handleBlock} startIcon={<PersonOffIcon/>}>Block</DefaultButton> }
                <DefaultButton onClick={sendDm} startIcon={<SendIcon/>}>DM</DefaultButton>
            </ButtonGroup> },
        { width: 3, element: <Typography variant="subtitle1" component='div'>ID : {userInfo.userName}</Typography> },
        {width: 3, element: 
            (() => {
                switch (onlineStatus) {
                    case "offline" :
                        return <div>
                                <CircleIcon sx={{color: "#FE346E", display: "inline-block", verticalAlign: "middle"}}/>
                                <Typography variant="subtitle1" component='span' sx={{display: "inline-block", verticalAlign: "middle"}}>Offline</Typography>
                            </div>
                    case "ingame":
                        return <div onClick={watchHandler}>
                            <CircleIcon sx={{color: "#400082", display: "inline-block", verticalAlign: "middle"}}/>
                            <Typography variant="subtitle1" component='span' sx={{display: "inline-block", verticalAlign: "middle"}}>In Game</Typography>
                        </div>
                    default:
                        return <div>
                            <CircleIcon sx={{color: "#00BDAA", display: "inline-block", verticalAlign: "middle"}}/>
                            <Typography variant="subtitle1" component='span' sx={{display: "inline-block", verticalAlign: "middle"}}>Online</Typography>
                        </div>
                }
            })() },
        {width: 3, element: <Typography variant="subtitle1" component='div'>Rank : {rank}</Typography> },
        {width: 3, element: <Typography variant="subtitle1" component='div'>Odds : {userInfo.odds} %</Typography> },
    ];

    return (
        <ModalBase open={showModal.show} reset={resetState} closeButton>
            <ProfileEditModal name={userInfo.userName}/>
            <Stack 
                justifyContent="center"
                alignItems="center"
                sx={{ flexGrow: 1 }}
            >
                <Typography variant="h2" gutterBottom >🤩 Profile 🤩</Typography>
                <Grid container columns={6} rowSpacing={1}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    { profileItems.map((item, index) => (
                        <Grid item key={index} xs={item.width} 
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                        >
                            {item.element}
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
export default OtherProfileModal;