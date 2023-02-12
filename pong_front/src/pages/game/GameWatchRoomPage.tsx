import React, {useState, useEffect, useContext} from "react";
import {useLocation, useNavigate, Link} from "react-router-dom";
import {useSetRecoilState} from "recoil";
import {gameState} from "../../common/states/recoilGameState";
import { Stack } from "../../common/styles/Stack.style";
import GameRoom from "../../components/game/GameRoom";
import { SocketContext } from "../../common/states/contextSocket";
import { OverLay, Wrapper } from "../../components/modal/Modal.style";
import * as types from "../../common/types/Game";
import useCheckLogin from "../../util/useCheckLogin";
import { ContentBox } from "../../common/styles/ContentBox.style";
import { RoutePath } from "../../common/configData";

function GameWatchRoomPage() {
    useCheckLogin();

    const location = useLocation();
    const navigate = useNavigate();
    const socket = useContext(SocketContext);
    const setGame = useSetRecoilState<types.gamePosInfo>(gameState);
    const [winner, setWinner] = useState<string>();

    const player1 = location.state.player1;
    const player2 = location.state.player2;

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

    function endHandler(e: React.MouseEvent<HTMLButtonElement>) {
        socket.emit('stopwatchGame', `${player1}vs${player2}`);
        navigate(RoutePath.lobby);
    }

    return (
        <ContentBox>
            <Stack>
                <GameRoom p1={player1} p2={player2}/>
                <button onClick={endHandler} className="game-button">
                    관전 종료
                </button>
            </Stack>
            {winner ? 
            <OverLay z_index={100}>
                <Wrapper>
                    <div>Winner is {winner}!</div>
                    <Link to={RoutePath.lobby}><button>Go To Lobby</button></Link>
                </Wrapper>
            </OverLay> : null}
        </ContentBox>
    );
}

export default GameWatchRoomPage;