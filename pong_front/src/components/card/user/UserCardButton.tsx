import { useContext, useEffect, useState } from "react";
import { useResetRecoilState, useSetRecoilState } from "recoil";
import { SocketContext } from "../../../common/states/contextSocket";
import { profileModalState } from "../../../common/states/recoilModalState";
import { Friend, } from "../../../common/types/User";
import {CardButton} from "../Card.style";
import * as states from "../../../common/states/recoilModalState";

import { CardActionArea, Typography } from "@mui/material";
import { CardBase } from "../CardBase";
import CircleIcon from '@mui/icons-material/Circle';

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

    function clickHandler(value: number) {
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

    return (
        // <CardButton onClick={(e) => clickHandler(props.userID, e)}>
        //     <span className="user-id">{props.userName}</span>
        //     {showStatus(onlineStatus)}
        // </CardButton>
        <CardBase>
            <CardActionArea onClick={() => clickHandler(props.userID)}>
                <Typography variant="subtitle2" component="span" sx={{minWidth: "400px"}}>{props.userName}</Typography>
                <Typography variant="subtitle2" component="span" sx={{minWidth: "100px"}}>
                {(() => {
                    switch (onlineStatus) {
                        case "offline" :
                            return <Typography variant="subtitle1" component='span'><><CircleIcon sx={{color: "#FE346E"}}/>Offline</></Typography>
                        case "ingame":
                            return <Typography variant="subtitle1" component='span'><><CircleIcon sx={{color: "#400082"}}/>In Game</></Typography>
                        default:
                            return <Typography variant="subtitle1" component='span'><><CircleIcon sx={{color: "#00BDAA"}}/>Online</></Typography>
                    }
                })()}
                </Typography>
            </CardActionArea>
        </CardBase>
    );
}

export default UserCardButton;