import React, {useEffect, useState} from "react";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import { friendModalState, profileModalState } from "../../../common/states/recoilModalState";
import UserCardButtonList from "../../card/user/UserCardButtonList";
import * as types from "../../../common/types/User"
import ModalBase from "../../modal/ModalBase";
import axios from "axios";
import { REACT_APP_HOST } from "../../../common/configData";
import useGetData from "../../../util/useGetData";
import { toast } from "react-toastify";

function FriendModal() {
    const [target, setTarget] = useState('');
    const showProfileModal = useRecoilValue(profileModalState);
    const showModal = useRecoilValue(friendModalState);
    const resetState = useResetRecoilState(friendModalState);
    const [friendList, setFriendList] = useState<types.Friend[]>([]);
    const [data] = useGetData('http://' + REACT_APP_HOST + ':3000/api/user');

    useEffect(() => {
        // TODO: 친구 정보를 받아온다.
        const calOdds = (win: number, lose: number): number => {
            if (win === 0)
                return 0;
            return Math.floor(100 / ((win + lose) / (win ? win : 1)));
        }

        const callFriendData = async () => {
            try{
                const res = await axios.get('http://' + REACT_APP_HOST + ':3000/api/friend', {withCredentials: true}) //쿠키와 함께 보내기 true.
                if (res === null || res === undefined)
                {
                    toast.error("friend fail..");
                    return;
                }
                let myFriends : types.Friend[] = res.data.map((friend: any) => {
                    const myUserInfo = ((friend.sender.id !== data.id) ? friend.reciever : friend.sender);
                    const otherUserInfo = ((friend.sender.id == data.id) ? friend.reciever : friend.sender);
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
        // handleAddFriendSubmit,
    ]);

    const handleAddFriendSubmit = async (event : any) => {
        event.preventDefault();
        try{
            const res = await axios.post('http://' + REACT_APP_HOST + ':3000/api/friend/name', {username : target}, {withCredentials: true});
            toast.success(target + "에게 친구요청 성공");
        }catch(err : any){
            toast.error(err.response.data.message);
        }
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