import React, {useState} from "react";
import {useNavigate} from 'react-router-dom'
import { Center, Button } from '@chakra-ui/react'

function GameLobbyPage(props: any) {
    const navigate = useNavigate();

    function buttonClicked(option: number, e: any) {
        if (option === 1)
            navigate(`/game/match`);
        else
            navigate(`/game/observer`);
    }
    return (
        <Center>
            <h1>Game Lobby</h1>
            <Button colorScheme='teal' variant='ghost' size='lg' onClick={(e) => buttonClicked(1, e)}>
                게임 시작
            </Button>
            <Button colorScheme='teal' variant='ghost' size='lg' onClick={(e) => buttonClicked(2, e)}>
                관전 시작
            </Button>
        </Center>
    );
}

export default GameLobbyPage;