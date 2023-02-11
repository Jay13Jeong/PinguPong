import React, {useEffect, useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useResetRecoilState } from "recoil";

import { blockModalState, profileModalState } from "../../../common/states/recoilModalState";
import UserCardButtonList from "../../card/user/UserCardButtonList";
import * as types from "../../../common/types/User"
import ModalBase from "../../modal/ModalBase"
import { REACT_APP_HOST } from "../../../common/configData";

function FriendModal() {
    const showProfileModal = useRecoilValue(profileModalState);
    const showModal = useRecoilValue(blockModalState);
    const resetState = useResetRecoilState(blockModalState);
    const [friendList, setFriendList] = useState<types.Friend[]>([
        {
            userId: 1,
            userName: "pingu",
            userStatus: "off"
        },
        {
            userId: 2,
            userName: "Robby",
            userStatus: "on"
        },
        {
            userId: 3,
            userName: "papa",
            userStatus: "game"
        },
        {
            userId: 4,
            userName: "mama",
            userStatus: "off"
        },
        {
            userId: 5,
            userName: "jeyoon",
            userStatus: "on"
        },
        {
            userId: 6,
            userName: "cheolee",
            userStatus: "game"
        },
        {
            userId: 7,
            userName: "jjeong",
            userStatus: "game"
        }
    ])

    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://' + REACT_APP_HOST + ':3000/api/user', {withCredentials: true}) //쿠키와 함께 보내기 true.
        .then(res2 => {
            /////
            axios.get('http://' + REACT_APP_HOST + ':3000/api/friend/block', {withCredentials: true}) //쿠키와 함께 보내기 true.
            .then(res => {
                if (res.data){
                    let myFriends : types.Friend[] = res.data.map((friend: any) => {
                        const myUserInfo = ((friend.sender.id !== res2.data.id) ? friend.reciever : friend.sender);
                        const otherUserInfo = ((friend.sender.id == res2.data.id) ? friend.reciever : friend.sender);
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
                                odds : myUserInfo.wins === 0? 0 : Math.floor((myUserInfo.wins + myUserInfo.loses) / myUserInfo.wins),
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
                                odds : otherUserInfo.wins === 0? 0 : Math.floor((otherUserInfo.wins + otherUserInfo.loses) / otherUserInfo.wins),
                                record : [],
                                relate : friend.status,
                                // block : false,
                            },
                        }
                    });
                    setFriendList(myFriends);
                }
            })
            .catch(err => {
                if (err.response.data.statusCode === 401)
                navigate('/'); //로그인 안되어 있다면 로그인페이지로 돌아간다.
            })
        ////
        })
        .catch(err => {
            // if (err.response.data.statusCode === 401)
            // navigate('/'); //로그인 안되어 있다면 로그인페이지로 돌아간다.
        })
        
    }, [showModal, showProfileModal]);

    if (showModal) {
        return (
            <ModalBase reset={resetState}>
                <h1>🚫 Block List 🚫</h1>
                <UserCardButtonList friends={friendList}/>
            </ModalBase>
        );
    }
    return null;
}

export default FriendModal;