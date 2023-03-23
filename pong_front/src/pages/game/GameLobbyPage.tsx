import { useEffect, useContext } from "react";
import {useNavigate} from 'react-router-dom'
import { SocketContext } from "../../common/states/contextSocket";
import useCheckLogin from "../../util/useCheckLogin";

import { Typography, Stack } from "@mui/material";

import { DefaultBox, DefaultButton } from "../../components/common";


function GameLobbyPage() {
    useCheckLogin();
    const socket = useContext(SocketContext);
    const navigate = useNavigate();
    useEffect(() => {
        socket.emit('setInLobby');
    }, [socket]);

    return (
        <DefaultBox>
            <Stack>
                <Typography variant="h2" component="h1" align='center' gutterBottom> 👾 Game Lobby 👾 </Typography>
                <DefaultButton sx={{fontSize: "1.5rem"}}
                    onClick={() => {navigate('/game/match')}}
                >
                    게임하기
                </DefaultButton>
                <DefaultButton sx={{fontSize: "1.5rem"}}
                    onClick={() => {navigate('/game/watch')}}
                >
                    관전하기
                </DefaultButton>
            </Stack>
        </DefaultBox>
    );
}

export default GameLobbyPage;