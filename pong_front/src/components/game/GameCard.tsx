import React from "react";
import { useNavigate } from "react-router-dom";
import "./Card.scss"

function GameCard (props: {p1: string, p2: string, s1: number, s2: number}) {
    const navigate = useNavigate();
    
    function clickHandler(e: any) {
        // TODO - 관전 요청 보내주기
        navigate(`/game/watch/${props.p1}vs${props.p2}`, {state: {
            player1: props.p1,
            player2: props.p2
        }});
    }

    return (
        <button onClick={clickHandler} className="game-card">
            <div className="player1">{props.p1}</div>
            <div className="player2">{props.p2}</div>
            <div className="score1">{props.s1}</div>
            <div className="score2">{props.s2}</div>
        </button>
    )
}

export default GameCard