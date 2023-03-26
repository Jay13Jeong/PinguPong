import React, { useContext } from "react";
import { SocketContext } from "../../../common/states/contextSocket";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { RoutePath } from "../../../common/configData";

import { Typography, CardActionArea } from "@mui/material";
import { CardBase } from "../CardBase";

function GameCardButton (props: {p1: string, p2: string}) {
    const navigate = useNavigate();
    const socket = useContext(SocketContext);
    
    function clickHandler(e: React.MouseEvent<HTMLElement>) {
        /* 관전 요청 */
        socket.emit('gameRoomCheck', `${props.p1}vs${props.p2}`);
        socket.on('gameRoomCheck', (result) => {
            socket.off('gameRoomCheck');
            if (result === true) {
                navigate(`/game/watch/${props.p1}vs${props.p2}`, {state: {
                    player1: props.p1,
                    player2: props.p2
                }});
            }
            else {
                toast.error("존재하지 않는 게임입니다!");
                navigate(RoutePath.lobby);
            }
        })
    }

    return (
        <CardBase>
            <CardActionArea onClick={clickHandler}>
                <Typography variant="subtitle2" sx={{minWidth: "400px"}}>{props.p1} ⚔️ {props.p2}</Typography>
            </CardActionArea>
        </CardBase>
    )
}

export default GameCardButton;