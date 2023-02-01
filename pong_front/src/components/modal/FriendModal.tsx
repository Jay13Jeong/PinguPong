import React, {useEffect, useState} from "react";
import { useRecoilState } from "recoil";
import { friendModalState } from "../../states/recoilModalState";
import UserCardButtonList from "../util/card/UserCardButtonList";
import * as types from "../profile/User"
import ModalBase from "./ModalBase"

function FriendModal() {
    const [showModal, setShowModal] = useRecoilState(friendModalState);
    const [friendList, setFriendList] = useState<types.friend[]>([
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

    useEffect(() => {
        // TODO: 친구 정보를 받아온다.
        // setFriendList();
    }, []);

    if (showModal) {
        return (
            <ModalBase setter={setShowModal}>
                <h1>Friend List</h1>
                <UserCardButtonList friends={friendList}/>
            </ModalBase>
        );
    }
    return null;
}

export default FriendModal;