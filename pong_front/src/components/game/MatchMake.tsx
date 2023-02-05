import React, {useState, useEffect, useContext} from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../../states/contextSocket";
import { Center, Stack } from "../../styles/Layout";
import { Button } from "../../styles/Inputs";
import useGetData from "../../util/useGetData";
import { User } from "../profile/User";
import axios from "axios";
import DifficultyButtons from "./DifficultyButtons";
import Loader from "../util/Loader";
import { REACT_APP_HOST } from "../../util/configData";

function MatchMake(props: any) {
    const [loading, setLoading] = useState<boolean>(true);
    const [current, setCurrent] = useState<string>("");
    const [myInfo, error, isLoading] = useGetData('http://' + REACT_APP_HOST + ':3000/api/user');
    const navigate = useNavigate();

    /* socket */
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
        socket.on('matchMakeSuccess', (data: any) => {
            socket.off('matchMakeSuccess');
            navigate(`/game/match/${data.p1}vs${data.p2}`, {state: {
                player1: data.p1,
                player2: data.p2,
                current: current
            }});
        });
        return (() => {
            socket.off('matchMakeSuccess');
        })
    }, [current, socket, navigate]);

    let currentDifficulty: number = 0;

    /* 매치 메이킹 */
    function handleMatchMakeRequest(e: any) {
        // console.log(current);
        socket.emit('requestMatchMake', {
            difficulty: currentDifficulty,
            player: current
        });
        setLoading(true);
    }

    function setDifficulty(difficulty: number) {
        currentDifficulty = difficulty;
    }

    return (
        <Center>
            {loading ? <Loader text="로딩중"/> : 
            <Stack>
                <DifficultyButtons difficulty={currentDifficulty} setDifficulty={setDifficulty}/>
                <Button onClickCapture={handleMatchMakeRequest}> 게임 매칭 요청 </Button>
            </Stack>
            }
        </Center>
    )
}

export default MatchMake;