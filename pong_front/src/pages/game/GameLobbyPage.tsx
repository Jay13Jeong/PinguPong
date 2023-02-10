import React from "react";
import {Link} from 'react-router-dom'
import {Center, Stack} from "../../styles/Layout"
import {Button} from "../../styles/Inputs"
import useCheckLogin from "../../util/useCheckLogin";

function GameLobbyPage() {
    useCheckLogin();
    return (
        <Center>
            <Stack>
                <h1>👾 Game Lobby 👾</h1>
                <Link to="/game/match">
                    <Button>게임 시작</Button>
                </Link>
                <Link to="/game/watch">
                    <Button>관전 시작</Button>
                </Link>
            </Stack>
        </Center>
    );
}

export default GameLobbyPage;