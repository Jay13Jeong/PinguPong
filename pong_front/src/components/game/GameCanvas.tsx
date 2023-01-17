import React, {useRef, useState, useEffect} from 'react';
import {useRecoilValue} from 'recoil';
import {gamePos} from '../../recoil/gamePos'
import { Center, Stack } from '../../styles/Layout';

function GameCanvas(props: any) {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [ctx, setCtx] = useState<CanvasRenderingContext2D>();
    const getGamePos = useRecoilValue(gamePos);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const context = canvas.getContext('2d');
            if (context)
                setCtx(context);
            canvas.width = window.innerWidth / 2;
            canvas.height = window.innerHeight / 2;
        }
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.focus();
        }
    })

    return (
        <Center>
            <Stack>
            {getGamePos.player1 ? <div>{getGamePos.player1}</div> : <div>NULL</div>}
            <canvas id="gameCanvas" style={{background: "grey"}} ref={canvasRef} onKeyDown={props.keyHander ? props.keyHander : null} tabIndex={0}>
            </canvas>
            </Stack>
        </Center>
    );
}

export default GameCanvas