import React, {useState, useEffect, useContext} from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../../states/contextSocket";
import { Center, Stack } from "../../styles/Layout";
import { Button } from "../../styles/Inputs";
import useUser from "../../util/useUser";
// import { User } from "../profile/User";
import axios from "axios";
import DifficultyButtons from "./DifficultyButtons";
import Loader from "../util/Loader";

function MatchMake(props: any) {
    const [loading, setLoading] = useState<boolean>(false);
    const myInfo = useUser();

    var currentDifficulty: number = 0;
    const navigate = useNavigate();

    /* socket */
    const socket = useContext(SocketContext);

    useEffect(() => {
        socket.on('matchMakeSuccess', (data: any) => {
            console.log('matchMakeSuccess');
            /**
             * NOTE
             * /game/match/뒤는 그냥 방을 구분할 수 있는 어떤 것이어도 됩니다.
             * 지금은 (p1닉네임)vs(p2닉네임
             */
            navigate(`/game/match/${data.p1}vs${data.p2}`, {state: {
                player1: data.p1,
                player2: data.p2
            }});
        });
    }, []);

    // NOTE - 매치 메이킹
    function handleMatchMakeRequest(e: any) {
        console.log(myInfo.userName);
        socket.emit('requestMatchMake', {
            difficulty: currentDifficulty,
            player: myInfo.userName // TODO - 본인 아이디 받아와야 함.
        });
        setLoading(true);
    }

    // NOTE - test button용 핸들러 (매칭 이후 단순 플레이만 테스트 할 수 있음.)
    function handleTest(e: any) {
        navigate(`/game/match/hh`, {state: {
            player1: "pingpong_king",
            player2: "loser"
        }});
    }

    function setDifficulty(difficulty: number) {
        currentDifficulty = difficulty;
        // console.log(currentDifficulty);
    }

    if (loading) {
        return (
            <Center>
                <Loader text="게임 매칭 중"/>
            </Center>
        );
    }
    else {
        return (
            <Center>
                <Stack>
                    <DifficultyButtons difficulty={currentDifficulty} setDifficulty={setDifficulty}/>
                    <Button onClickCapture={handleMatchMakeRequest}> 게임 매칭 요청 </Button>
                    <Button onClickCapture={handleTest}> 테스트 입장 </Button>
                </Stack>
            </Center>
        );
    }
}

export default MatchMake;