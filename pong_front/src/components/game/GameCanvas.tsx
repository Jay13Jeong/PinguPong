import React, {useRef, useState, useEffect} from 'react';
// import { Space } from 'antd';

function GameCanvas(props: any) {

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

    // const playGameInfo: gameInfo = {
        
    // }

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
        }
    }, []);

    return (
        <canvas id="gameCanvas" width="600" height="300" className='canvas'>
        </canvas>
    );
}

export default GameCanvas