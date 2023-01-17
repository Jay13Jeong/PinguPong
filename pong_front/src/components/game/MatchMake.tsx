import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../../App";
import { Center, Stack } from "../../styles/Layout";
import { Button } from "../../styles/Inputs";
import DifficultyButtons from "./DifficultyButtons";
import LoadingBar from "../util/LoadingBar";

/**
 * NOTE - Socket.io Event
 * - REQUEST_MATCH_MAKE : 매치를 요청함
 * - MATCH_MAKE_SUCCESS : 매치가 성공적으로 이루어짐 (방 이동)
 * - MATCH_MAKE_FAIL : 매치가 실패함 (에러) ? 필요한가?
 */

function MatchMake(props: any) {
    const [loading, setLoading] = useState<boolean>(false);
    var currentDifficulty: number = 0;
    const navigate = useNavigate();

    useEffect(() => {
        socket.on('MATCH_MAKE_SUCCESS', (data: any) => {
            console.log('MATCH_MAKE_SUCCESS');
            // TODO 방 번호 뿐 아니라 플레이어들의 정보도 받아야 함. (상대의 id도 표시해줘야함)
            navigate(`/game/match/${data.room}`);
        });
    }, []);

    function handleMatchMakeRequest(e: any) {
        socket.emit('REQUEST_MATCH_MAKE', {difficulty: currentDifficulty});
        setLoading(true);
    }

    function setDifficulty(difficulty: number) {
        currentDifficulty = difficulty;
        // console.log(currentDifficulty);
    }

    if (loading) {
        return (
            <Center>
                <Stack>
                    <LoadingBar text="매칭 중..."/>
                </Stack>
            </Center>
        );
    }
    else {
        return (
            <Center>
                <Stack>
                    <DifficultyButtons difficulty={currentDifficulty} setDifficulty={setDifficulty}/>
                    <Button onClickCapture={handleMatchMakeRequest}> 게임 매칭 요청 </Button>
                </Stack>
            </Center>
        );
    }
}

export default MatchMake;