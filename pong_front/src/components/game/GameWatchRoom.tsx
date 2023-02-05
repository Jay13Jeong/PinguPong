import React, {useEffect} from "react";
import {useLocation} from "react-router-dom";
import {useSetRecoilState} from "recoil";
import {gameState} from "../../states/recoilGameState"
import io from "socket.io-client";
import { Center, Stack } from "../../styles/Layout";
import { Button } from "../../styles/Inputs";
import GameRoom from "./GameRoom";
import * as types from "./Game";
import { REACT_APP_HOST } from "../../util/configData";

function GamePlayRoom(props: any) {
    /* 유저 정보 변수들 */
    // TODO - 게임이 시작되면 프로필 수정 버튼? 을 비활성해야 함 (만약 있다면..)
    const location = useLocation();
    // const player1 = location.state.player1;
    // const player2 = location.state.player2;
    const player1 = "pingpong_king"; // TODO - 소켓 연결되면 주석처리
    const player2 = "loser";

    /* 게임 정보 setter */
    const setGame = useSetRecoilState<types.gamePosInfo>(gameState);

    /* socket */ // TODO - 나중에 적당한 곳으로 옮겨줘야 함.
    const ENDPOINT = "http://" + REACT_APP_HOST + ":3001";
    const socket = io(ENDPOINT, {
        transports: ['websocket'],
        withCredentials: true,
    });


    useEffect(() => {
        socket.on("ballPos", (data: types.gamePosInfo) => {
            setGame(data);
        })
        socket.on("endGame", (data) => {
            // TODO - 게임 종료 이벤트 발생시 종료 화면 띄우기
            console.log(data);
        })
    }, []);

    return (
        <Center>
            <Stack>
                <GameRoom p1={player1} p2={player2}/>
                <Button className="game-button">
                    ?관전 종료?
                </Button>
            </Stack>
        </Center>
    );
}

export default GamePlayRoom;