import {useEffect, useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { blockModalState, profileModalState } from "../../../common/states/recoilModalState";
import UserCardButtonList from "../../card/user/UserCardButtonList";
import * as types from "../../../common/types/User"
import ModalBase from "../../modal/ModalBase"
import { REACT_APP_HOST } from "../../../common/configData";
import { Typography, Stack } from '@mui/material'

function BlockModal() {
    const showProfileModal = useRecoilValue(profileModalState);
    const showModal = useRecoilValue(blockModalState);
    const resetState = useResetRecoilState(blockModalState);
    const [blockList, setBlockList] = useState<types.Friend[]>([])

    const navigate = useNavigate();

    useEffect(() => {
        const calOdds = (win: number, lose: number): number => {
            if (win === 0)
                return 0;
            return Math.floor(100 / ((win + lose) / (win ? win : 1)));
        }
        axios.get('http://' + REACT_APP_HOST + '/api/user', {withCredentials: true}) //쿠키와 함께 보내기 true.
        .then(userRes => {
            axios.get('http://' + REACT_APP_HOST + '/api/friend/block', {withCredentials: true}) //쿠키와 함께 보내기 true.
            .then(blockRes => {
                if (blockRes.data){
                    let myFriends : types.Friend[] = blockRes.data.map((friend: any) => {
                        const myUserInfo = ((friend.sender.id !== userRes.data.id) ? friend.reciever : friend.sender);
                        const otherUserInfo = ((friend.sender.id == userRes.data.id) ? friend.reciever : friend.sender);
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
                    setBlockList(myFriends);
                }
            })
            .catch(err => {
                if (err.response.data.statusCode === 401)
                navigate('/'); //로그인 안되어 있다면 로그인페이지로 돌아간다.
            })
        })
        .catch(err => { })
    }, [showModal, showProfileModal]);

    return (
        <ModalBase open={showModal} reset={resetState} closeButton>
            <Stack 
                justifyContent="center"
                alignItems="center"
            >
                <Typography variant="h2" gutterBottom>🚫 Block List 🚫</Typography>
                <UserCardButtonList friends={blockList}/>
            </Stack>
        </ModalBase>
    )
}

export default BlockModal;