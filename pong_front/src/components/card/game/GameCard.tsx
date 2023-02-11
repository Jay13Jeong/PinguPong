import React from "react";
import {Card} from "../Card.style";

function GameCard (props: {p1: string, p2: string, s1: number, s2: number}) {
    return (
        <Card>
            <span className="player">{props.p1} ⚔️ {props.p2}</span>
            <span className="score">{props.s1} : {props.s2}</span>
        </Card>
    )
}

export default GameCard