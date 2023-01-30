import React from "react";
import { useNavigate } from "react-router-dom";
import {CardButton} from "./Card";

function GameCardButton (props: {p1: string, p2: string, s1: number, s2: number}) {
    const navigate = useNavigate();
    
    function clickHandler(e: any) {
        // TODO - 관전 요청 보내주기
        navigate(`/game/watch/${props.p1}vs${props.p2}`, {state: {
            player1: props.p1,
            player2: props.p2
        }});
    }

    return (
        <CardButton onClick={clickHandler}>
            <span className="player">{props.p1} ⚔️ {props.p2}</span>
            <span className="score">{props.s1} : {props.s2}</span>
        </CardButton>
    )
}

export default GameCardButton;