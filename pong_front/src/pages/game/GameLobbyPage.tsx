import React from "react";
import {Link} from 'react-router-dom'
import {Stack} from "../../common/styles/Layout";
import { ContentBox } from "../../common/styles/ContentBox";
import useCheckLogin from "../../util/useCheckLogin";

function GameLobbyPage() {
    useCheckLogin();
    return (
        <ContentBox><Stack>
            <h1>👾 Game Lobby 👾</h1>
            <Link to="/game/match">
                <button>게임 시작</button>
            </Link>
            <Link to="/game/watch">
                <button>관전 시작</button>
            </Link>
        </Stack></ContentBox>
    );
}

export default GameLobbyPage;