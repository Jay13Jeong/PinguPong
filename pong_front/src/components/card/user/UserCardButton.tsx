import React, { useContext, useEffect, useState } from "react";
import { useResetRecoilState, useSetRecoilState } from "recoil";
import { SocketContext } from "../../../common/states/contextSocket";
import { profileModalState } from "../../../common/states/recoilModalState";
import { Friend, User } from "../../../common/types/User";
import {CardButton} from "../Card.style";
import * as states from "../../../common/states/recoilModalState";

function UserCardButton(props: {friend: Friend, userID: number, userName: string, userStatus: string, relate?: string}) {
    const profileState = useSetRecoilState(profileModalState);
    const [onlineStatus, setOnlineStatus] = useState<string>('offline');
    const resetFriendState =  useResetRecoilState(states.friendModalState);
    const resetPendingState =  useResetRecoilState(states.pendingModalState);
    const resetBlockState =  useResetRecoilState(states.blockModalState);
    const socket = useContext(SocketContext);

    useEffect(() => {
        socket.emit('getUserStatus', props.userID);    
        socket.on('getUserStatus', (status, targetId) => {
            if (targetId === props.userID)
                setOnlineStatus(status);
        })
        return (() => {
            socket.off('getUserStatus');
        })
    }, [socket]);

    function clickHandler(value: number, e?: any) {
        profileState({ userId: value, show: true });
        resetFriendState();
        resetPendingState();
        resetBlockState();
    }

    function showStatus(status: string) {
        switch(status) {
            case "ingame" : 
                return (
                    <span className="status">
                        ingame
                    </span>
                );
            case "offline" :
                return (
                    <span className="status">
                        offline
                    </span>
                );
            default:
                return (
                    <span className="status">
                        online
                    </span>
                );
        }
    }

    function showRelate(relate: string | undefined) {
        switch(relate) {
            case "accepted" :
                return (
                    <span className="relate">
                        친구
                    </span>
                );
            case "blocked" :
                return (
                    <span className="relate">
                        차단중
                    </span>
                );
            case "pending" : 
                return (
                    <span className="relate">
                        보류중
                    </span>
                );
            default:
                return (null);
        }
    }

    return (
        <CardButton onClick={(e) => clickHandler(props.userID, e)}>
            {/* {showRelate(props.relate)} */}
            <span className="user-id">{props.userName}</span>
            {showStatus(onlineStatus)}
            {/* {onlineStatus} */}
        </CardButton>
    );
}

export default UserCardButton;