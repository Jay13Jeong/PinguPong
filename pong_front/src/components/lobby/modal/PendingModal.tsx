import {useEffect, useState} from "react";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { pendingModalState, profileModalState } from "../../../common/states/recoilModalState";
import UserCardButtonList from "../../card/user/UserCardButtonList";
import * as types from "../../../common/types/User"
import ModalBase from "../../modal/ModalBase";
import axios from "axios";
import { REACT_APP_HOST } from "../../../common/configData";
import useGetData from "../../../util/useGetData";
import { toast } from "react-toastify";
import { Typography, Stack } from '@mui/material'

function PendingModal() {
    const showProfileModal = useRecoilValue(profileModalState);
    const showModal = useRecoilValue(pendingModalState);
    const resetState = useResetRecoilState(pendingModalState);
    const [pendingList, setPendingList] = useState<types.Friend[]>([]);
    const [data] = useGetData('http://' + REACT_APP_HOST + '/api/user');

    useEffect(() => {
        const calOdds = (win: number, lose: number): number => {
            if (win === 0)
                return 0;
            return Math.floor(100 / ((win + lose) / (win ? win : 1)));
        }

        const callPendingData = async () => {
            try{
                const res = await axios.get('http://' + REACT_APP_HOST + '/api/friend/pendings', {withCredentials: true}) //쿠키와 함께 보내기 true.
                if (res === null || res === undefined)
                {
                    toast.error("pending fail..");
                    return;
                }
                let myPendings : types.Friend[] = res.data.map((pending: any) => {
                    const myUserInfo = ((pending.sender.id !== data.id) ? pending.reciever : pending.sender);
                    const otherUserInfo = ((pending.sender.id === data.id) ? pending.reciever : pending.sender);
                    return {
                        userId: otherUserInfo.id,
                        userName: otherUserInfo.username,
                        userStatus: 'on', //실시간적용 필요(기능 추가해줘야함).
                        relate: pending.status,
                        me: {
                            id : myUserInfo.id,
                            avatar: myUserInfo.avatar,
                            userName : myUserInfo.username as string,
                            myProfile : true,
                            userStatus : 'off',
                            rank : 0,
                            odds : calOdds(myUserInfo.wins, myUserInfo.loses),
                            record : [],
                            relate : pending.status,
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
                            relate : pending.status,
                        },
                    }
                });
                setPendingList(myPendings);
            }catch (err : any){
                // alert("no friend data")
            }
        }
        callPendingData();
    }, [
        showModal,
        showProfileModal,
    ]);

    return (
        <ModalBase open={showModal} reset={resetState} closeButton>
            <Stack 
                justifyContent="center"
                alignItems="center"
            >
                <Typography variant="h2" gutterBottom>👥 Pending Friend List 👥</Typography>
                <UserCardButtonList friends={pendingList}/>
            </Stack>
        </ModalBase>
    )
}
export default PendingModal;