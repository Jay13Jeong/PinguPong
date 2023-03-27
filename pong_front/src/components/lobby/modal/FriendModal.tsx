import React, {useEffect, useState} from "react";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { friendModalState, profileModalState } from "../../../common/states/recoilModalState";
import UserCardButtonList from "../../card/user/UserCardButtonList";
import * as types from "../../../common/types/User"
import ModalBase from "../../modal/ModalBase";
import axios from "axios";
import { REACT_APP_HOST } from "../../../common/configData";
import useGetData from "../../../util/useGetData";
import { toast } from "react-toastify";

import { Typography, Stack, Grid, TextField } from '@mui/material'
import { DefaultButton } from "../../common";

function FriendModal() {
    const [isChange, setIsChange] = useState(0); //변화감지용 변수.
    const [target, setTarget] = useState('');
    const showProfileModal = useRecoilValue(profileModalState);
    const showModal = useRecoilValue(friendModalState);
    const resetState = useResetRecoilState(friendModalState);
    const [friendList, setFriendList] = useState<types.Friend[]>([]);
    const [data] = useGetData('http://' + REACT_APP_HOST + '/api/user');

    useEffect(() => {
        const calOdds = (win: number, lose: number): number => {
            if (win === 0)
                return 0;
            return Math.floor(100 / ((win + lose) / (win ? win : 1)));
        }

        const callFriendData = async () => {
            try{
                const res = await axios.get('http://' + REACT_APP_HOST + '/api/friend', {withCredentials: true}) //쿠키와 함께 보내기 true.
                if (res === null || res === undefined)
                {
                    toast.error("friend fail..");
                    return;
                }
                let myFriends : types.Friend[] = res.data.map((friend: any) => {
                    const myUserInfo = ((friend.sender.id !== data.id) ? friend.reciever : friend.sender);
                    const otherUserInfo = ((friend.sender.id === data.id) ? friend.reciever : friend.sender);
                    return {
                        userId: otherUserInfo.id,
                        userName: otherUserInfo.username,
                        userStatus: 'on', //실시간적용 필요(기능 추가해줘야함).
                        relate: friend.status,
                        me: {
                            id : myUserInfo.id,
                            avatar: myUserInfo.avatar,
                            userName : myUserInfo.username as string,
                            myProfile : true,
                            userStatus : 'off',
                            rank : 0,
                            odds : calOdds(myUserInfo.wins, myUserInfo.loses),
                            record : [],
                            relate : friend.status,
                        },
                        you: {
                            id : otherUserInfo.id,
                            avatar: otherUserInfo.avatar,
                            userName : otherUserInfo.username as string,
                            myProfile : false,
                            userStatus : 'off',
                            rank : 0,
                            odds : calOdds(otherUserInfo.wins, otherUserInfo.loses),
                            record : [],
                            relate : friend.status,
                        },
                    }
                });
                setFriendList(myFriends);
            }catch (err : any){
                // alert("no friend data")
            }
        }
        callFriendData();
    }, [
        showModal,
        showProfileModal,
        isChange,
    ]);

    const handleAddFriendSubmit = async (event : any) => {
        event.preventDefault();
        try{
            const res = await axios.post('http://' + REACT_APP_HOST + '/api/friend/name', {username : target}, {withCredentials: true});
            toast.success(target + "에게 친구요청 성공");
            setIsChange((isChange < 9999 ? isChange + 1 : 0));
        }catch(err : any){
            toast.error(err.response.data.message);
        }
    };

    function handleSearchKey(event : React.KeyboardEvent<HTMLDivElement>) {
        if (event.key !== 'Enter')
          return ;
        event.preventDefault();
        handleAddFriendSubmit(event);
    };
    return (
        <ModalBase open={showModal} reset={resetState} closeButton>
            <Stack 
                justifyContent="center"
                alignItems="center"
            >
                <Typography variant="h2" gutterBottom>👥 Friend List 👥</Typography>
                <Grid container 
                    columns={4}
                    columnSpacing={2} 
                >
                    <Grid item xs={3}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <TextField 
                            fullWidth
                            id="username" 
                            label="친구 추가할 유저의 이름을 입력해주세요." 
                            variant="outlined" 
                            size="small"
                            onChange={event => setTarget(event.target.value)}
                            onKeyDown={handleSearchKey}
                        />
                    </Grid>
                    <Grid item xs={1}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <DefaultButton onClick={handleAddFriendSubmit} sx={{marginLeft: 0, marginRight: 0, width: "100%"}}>친구 추가하기</DefaultButton>
                    </Grid>
                </Grid>
                <UserCardButtonList friends={friendList}/>
            </Stack>
        </ModalBase>
    )
}
export default FriendModal;