import React, { useContext, useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { SocketContext } from "../../../common/states/contextSocket";
import { profileModalState } from "../../../common/states/recoilModalState";
import { Friend, User } from "../../../common/types/User";
import {CardButton} from "../Card.style";

function UserCardButton(props: {friend: Friend, userID: number, userName: string, userStatus: string, relate?: string}) {
    const profileState = useSetRecoilState(profileModalState);
    const [onlineStatus, setOnlineStatus] = useState<string>('offline');
    const socket = useContext(SocketContext);

    useEffect(() => {
        socket.emit('api/get/user/status', props.userID);    
        socket.on('api/get/user/status', (status, targetId) => {
            if (targetId === props.userID)
                setOnlineStatus(status);
        })
        return (() => {
            socket.off('api/get/user/status');
        })
    }, [socket]);

    function clickHandler(user?: User, value?: number, e?: any) {
        profileState({user: user, userId: (value? value : 0), show: true});
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
        <CardButton onClick={(e) => clickHandler(props.friend.you, props.userID, e)}>
            {/* {showRelate(props.relate)} */}
            <span className="user-id">{props.userName}</span>
            {showStatus(onlineStatus)}
            {/* {onlineStatus} */}
        </CardButton>
    );
}

export default UserCardButton;