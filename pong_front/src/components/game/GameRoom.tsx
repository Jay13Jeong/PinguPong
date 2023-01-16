import React, {useRef, useState, useEffect} from "react";
import GameCanvas from "./GameCanvas";
import {Center} from "../../styles/Layout";


function GameRoom(props: any) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    interface position {
        x: number,
        y: number,
        velocity: {
            x: number,
            y: number
        }
    }

    interface gameInfo {
        player1: position,
        player2: position,
        ball: position
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
        }
    }, []);

    return (
        <Center>
            {/* TODO 변수로 전달할지 state로 관리할지 고민 */}
            {/* <GameScore /> */}
            {/* <GameUsers/> */}
            <GameCanvas/>
        </Center>
    );
}

export default GameRoom;