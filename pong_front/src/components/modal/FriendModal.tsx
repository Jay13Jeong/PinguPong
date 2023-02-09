import React, {useEffect, useState} from "react";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import { friendModalState, profileModalState } from "../../states/recoilModalState";
import UserCardButtonList from "../util/card/UserCardButtonList";
import * as types from "../profile/User"
import ModalBase from "./ModalBase"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { REACT_APP_HOST } from "../../util/configData";

function FriendModal() {
    const [target, setTarget] = useState('');
    // const [showProfileModal, setShowProfileModal] = useRecoilState(profileModalState);
    const showProfileModal = useRecoilValue(profileModalState);
    // const [showModal, setShowModal] = useRecoilState(friendModalState);
    const showModal = useRecoilValue(friendModalState);
    const resetState = useResetRecoilState(friendModalState);
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
        // TODO: 친구 정보를 받아온다.
        // setFriendList();
        axios.get('http://' + REACT_APP_HOST + ':3000/api/user', {withCredentials: true}) //쿠키와 함께 보내기 true.
        .then(res2 => {
            /////
            axios.get('http://' + REACT_APP_HOST + ':3000/api/friend', {withCredentials: true}) //쿠키와 함께 보내기 true.
            .then(res => {
                if (res.data){
                    let myFriends : types.Friend[] = res.data.map((friend: any) => {
                        const myUserInfo = ((friend.sender.id !== res2.data.id) ? friend.reciever : friend.sender);
                        const otherUserInfo = ((friend.sender.id == res2.data.id) ? friend.reciever : friend.sender);
                        // console.log(friend.sender.id , res2.data.id)
                        // console.log(otherUserInfo);
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
                                odds : myUserInfo.wins == 0? 0 : Math.floor((myUserInfo.wins + myUserInfo.loses) / myUserInfo.wins),
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
                                odds : otherUserInfo.wins == 0? 0 : Math.floor((otherUserInfo.wins + otherUserInfo.loses) / otherUserInfo.wins),
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
                // if (err.response.data.statusCode === 401)
                // navigate('/'); //로그인 안되어 있다면 로그인페이지로 돌아간다.
            })
        ////
        })
        .catch(err => {
            // if (err.response.data.statusCode === 401)
            // navigate('/'); //로그인 안되어 있다면 로그인페이지로 돌아간다.
        })
    }, [
        showModal,
        showProfileModal,
        // handleAddFriendSubmit
    ]);

    function handleAddFriendSubmit(event : any) {
        event.preventDefault();
        axios.post('http://' + REACT_APP_HOST + ':3000/api/friend/name', {username : target}, {withCredentials: true})
        .then(res => {
            alert('follow ' + target);
        })
        .catch(err => {
            alert(err.response.data.message);
        })
    };

    if (showModal) {
        return (
            <ModalBase reset={resetState}>
                <h1>👥 Friend List 👥</h1>
                <input type="text" placeholder="이름으로 요청" onChange={event => setTarget(event.target.value)} value={target} />
                <button className="profile-button" onClick={handleAddFriendSubmit}>
                    친구요청
                </button>
                <UserCardButtonList friends={friendList}/>
            </ModalBase>
        );
    }
    return null;
}

export default FriendModal;