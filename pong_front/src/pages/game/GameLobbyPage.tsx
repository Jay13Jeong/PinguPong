import React from "react";
import {useNavigate} from 'react-router-dom'
import {Center, Stack} from "../../styles/Layout"
import {Button} from "../../styles/Inputs"

function GameLobbyPage(props: any) {
    const navigate = useNavigate();

    const onMatch = () => {
        navigate(`/game/match`);
    }

    const onObserver = () => {
        navigate(`/game/observer`);
    }

    function buttonClicked(handler: Function, e: any) {
        handler();
    }
    return (
        <Center>
            <Stack>
                <h1>Game Lobby</h1>
                <Button onClick={(e) => buttonClicked(onMatch, e)}>
                    게임 시작
                </Button>
                <Button onClick={(e) => buttonClicked(onObserver, e)}>
                    관전 시작
                </Button>
            </Stack>
        </Center>
    );
}

export default GameLobbyPage;