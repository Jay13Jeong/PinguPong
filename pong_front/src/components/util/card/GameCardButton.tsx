import React, { useContext } from "react";
import { SocketContext } from "../../../common/states/contextSocket";
import { useNavigate } from "react-router-dom";
import {CardButton} from "./Card";

function GameCardButton (props: {p1: string, p2: string}) {
    const navigate = useNavigate();
    const socket = useContext(SocketContext);
    
    function clickHandler(e: React.MouseEvent<HTMLElement>) {
        /* 관전 요청 */
        socket.emit('watchGame', `${props.p1}vs${props.p2}`);
        navigate(`/game/watch/${props.p1}vs${props.p2}`, {state: {
            player1: props.p1,
            player2: props.p2
        }});
    }

    return (
        <CardButton onClick={clickHandler}>
            <span className="player">{props.p1} ⚔️ {props.p2}</span>
            {/* <span className="score">{props.s1} : {props.s2}</span> */}
        </CardButton>
    )
}

export default GameCardButton;