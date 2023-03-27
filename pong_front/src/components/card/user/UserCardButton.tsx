import { useContext, useEffect, useState } from "react";
import { useResetRecoilState, useSetRecoilState } from "recoil";
import { SocketContext } from "../../../common/states/contextSocket";
import { profileModalState } from "../../../common/states/recoilModalState";
import { Friend, } from "../../../common/types/User";
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

    return (
        <CardBase>
            <CardActionArea onClick={() => clickHandler(props.userID)} sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <Typography variant="subtitle2" component="span" align="center" sx={{minWidth: "400px"}}>{props.userName}</Typography>
                {(() => {
                    switch (onlineStatus) {
                        case "offline" :
                            return <div style={{marginLeft: "auto"}}>
                                    <CircleIcon sx={{color: "#FE346E", display: "inline-block", verticalAlign: "middle"}}/>
                                    <Typography variant="subtitle1" component='span' sx={{display: "inline-block", verticalAlign: "middle"}}>Offline</Typography>
                                </div>
                        case "ingame":
                            return <div style={{marginLeft: "auto"}}>
                                <CircleIcon sx={{color: "#400082", display: "inline-block", verticalAlign: "middle"}}/>
                                <Typography variant="subtitle1" component='span' sx={{display: "inline-block", verticalAlign: "middle"}}>In Game</Typography>
                            </div>
                        default:
                            return <div style={{marginLeft: "auto"}}>
                                <CircleIcon sx={{color: "#00BDAA", display: "inline-block", verticalAlign: "middle"}}/>
                                <Typography variant="subtitle1" component='span' sx={{display: "inline-block", verticalAlign: "middle"}}>Online</Typography>
                            </div>
                    }
                })()}
            </CardActionArea>
        </CardBase>
    );
}

export default UserCardButton;