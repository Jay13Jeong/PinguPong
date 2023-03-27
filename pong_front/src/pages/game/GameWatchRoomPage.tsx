import React, {useState, useEffect, useContext} from "react";
import {useLocation, useNavigate, Link, useParams} from "react-router-dom";
import {useSetRecoilState, useResetRecoilState} from "recoil";
import { toast } from "react-toastify";

import {gameState} from "../../common/states/recoilGameState";
import { SocketContext } from "../../common/states/contextSocket";
import { RoutePath } from "../../common/configData";
import * as types from "../../common/types/Game";
import GameRoom from "../../components/game/GameRoom";
import useCheckLogin from "../../util/useCheckLogin";

import { Modal, Stack, Typography, Box } from "@mui/material";
import { DefaultBox, DefaultButton, DefaultLinearProgress } from "../../components/common";
import { modalSx } from "../../components/modal/Modal.style";

function GameWatchRoomPage() {
    useCheckLogin();

    const location = useLocation();
    const { id } = useParams();
    const navigate = useNavigate();
    const socket = useContext(SocketContext);
    const setGame = useSetRecoilState<types.gamePosInfo>(gameState);
    const [winner, setWinner] = useState<string>();
    const resetGame = useResetRecoilState(gameState);
    const [player1, setPlayer1] = useState<string>();
    const [player2, setPlayer2] = useState<string>();

    useEffect(() => {
        if (!location) {
            toast.error("존재하지 않는 게임입니다!");
            navigate(RoutePath.lobby);
        }
        socket.emit('gameRoomCheck', id);
        socket.on('gameRoomCheck', (result) => {
            socket.off('gameRoomCheck');
            if (result === true) {
                setPlayer1(location.state.player1);
                setPlayer2(location.state.player2);
                socket.emit('watchGame', id);
            }
            else {
                toast.error("존재하지 않는 게임입니다!");
                navigate(RoutePath.lobby);
            }
        })
        return (() => {
            socket.off('gameRoomCheck');
        })
    }, []);

    useEffect(() => {
        socket.on("ballPos", (data: types.gamePosInfo) => {
            setGame(data);
        })
        socket.on("endGame", (data: {winner: string}) => {
            setWinner(data.winner);
        })
        return (() => {
            socket.off("ballPos");
            socket.off("endGame");
        })
    }, [socket, setGame]);

    useEffect(() => {
        return (() => {
            resetGame();
        })
    }, [resetGame]);

    function endHandler(e: React.MouseEvent<HTMLButtonElement>) {
        socket.emit('stopwatchGame', `${player1}vs${player2}`);
        navigate(RoutePath.lobby);
    }

    return (
        <DefaultBox>
            {player1 && player2 ? 
            <>
            <Stack>
                <GameRoom p1={player1} p2={player2}/>
                <DefaultButton onClick={endHandler}>
                    관전 종료
                </DefaultButton>
            </Stack>
            <Modal open={winner ? true : false}>
                <Box sx={modalSx}>
                    <Stack>
                        <Typography variant="h3" component="h4" align="center">
                            `🎉 {winner}의 승리! 🎉`
                        </Typography>
                        <DefaultButton onClick={() => {navigate(RoutePath.lobby)}}>Go To Lobby</DefaultButton>
                    </Stack>
                </Box>
           </Modal>
            </>
            : 
            <>
                <Typography variant="subtitle1">게임 로딩중...</Typography>
                <DefaultLinearProgress/>
            </>}
        </DefaultBox>
    );
}

export default GameWatchRoomPage;