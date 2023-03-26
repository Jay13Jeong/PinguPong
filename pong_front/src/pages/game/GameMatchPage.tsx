import React, {useState, useEffect, useContext} from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../../common/states/contextSocket";
import useGetData from "../../util/useGetData";
import { REACT_APP_HOST, RoutePath } from "../../common/configData";
import useCheckLogin from "../../util/useCheckLogin";
import { toast } from "react-toastify";

import { Typography, Stack, Chip } from "@mui/material";
import { DefaultBox, DefaultButton, DefaultLinearProgress } from "../../components/common";

const difficultyList = [
    {
        label: "✨EASY✨",
        value: 0
    },
    {
        label: "✨NORMAL✨",
        value: 1
    },
    {
        label: "✨HARD✨",
        value: 2
    }
];

function GameMatchPage() {
    useCheckLogin();
    const [loading, setLoading] = useState<boolean>(true);
    const [current, setCurrent] = useState<string>("");
    const [myInfo, error, isLoading] = useGetData('http://' + REACT_APP_HOST + '/api/user');
    const [difficulty, setDifficulty] = useState<number>(0);
    const navigate = useNavigate();
    const socket = useContext(SocketContext);

    useEffect(() => {
        if (myInfo) {
            setCurrent(myInfo.username);
        }
    }, [myInfo, error, isLoading]);

    useEffect(() => {
        if (current !== "") {
            setLoading(false);
        }
    }, [current]);

    useEffect(() => {
        socket.on('matchMakeSuccess', (data: {p1: string, p2: string}) => {
            socket.off('matchMakeSuccess');
            navigate(`/game/match/${data.p1}vs${data.p2}`, {state: {
                player1: data.p1,
                player2: data.p2,
                current: current,
                invite: false
            }});
        });
        socket.on("matchFail", () => {
            toast.error("게임 매칭 실패!");
            socket.off('matchFail');
            navigate(RoutePath.lobby);
        })
        return (() => {
            socket.off('matchMakeSuccess');
            socket.off('matchFail');
        })
    }, [current, socket, navigate]);

    /* 매치 메이킹 */
    function handleMatchMakeRequest(e: React.MouseEvent<HTMLElement>) {
        socket.emit('requestMatchMake', {
            difficulty: difficulty,
            player: current
        });
        setLoading(true);
    }

    /* 매칭 취소 이벤트 */
    function requestCancelHander(e: React.MouseEvent<HTMLElement>) {
        navigate(RoutePath.lobby);
    }

    return (
        <DefaultBox>
            <Stack spacing={2} justifyContent="center">
                <Typography variant="h3" component="h1" align='center' gutterBottom> 👾 Choose Game Level 👾 </Typography>
                {loading ? 
                    <>
                        <Typography variant="subtitle1">게임 매칭 대기중...</Typography>
                        <DefaultLinearProgress />
                        <DefaultButton onClick={requestCancelHander}>게임 매칭 취소</DefaultButton>
                    </> : 
                    <Stack>
                        <Stack 
                            direction="row" 
                            spacing={1}
                            justifyContent="center"
                        >
                            {difficultyList.map((item) => (
                                <Chip key={item.label} label={item.label} color="primary"
                                    variant={difficulty === item.value ? "filled" : "outlined"}
                                    onClick={() => setDifficulty(item.value)}
                                    sx={{color: "black"}}
                                />
                            ))}
                        </Stack>
                        <DefaultButton onClick={handleMatchMakeRequest}>게임 매칭 요청</DefaultButton>
                    </Stack>}
            </Stack>
        </DefaultBox>
    )
}

export default GameMatchPage;