import React from "react";
import { Link } from "react-router-dom";
import "./Card.scss"

function GameCard (props: {p1: string, p2: string, s1: number, s2: number}) {
    return (
        <Link to={`/game/watch/${props.p1}vs${props.p2}`} style={{ textDecoration: "none" }}>
        <button className="game-card">
            <div className="player1">{props.p1}</div>
            <div className="player2">{props.p2}</div>
            <div className="score1">{props.s1}</div>
            <div className="score2">{props.s2}</div>
        </button>
        </Link>
    )
}

export default GameCard