import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../../App";
import { Stack, Spinner, Center, Button, Radio, RadioGroup } from '@chakra-ui/react'

/**
 * NOTE - Socket.io Event
 * - REQUEST_MATCH_MAKE : 매치를 요청함
 * - MATCH_MAKE_SUCCESS : 매치가 성공적으로 이루어짐 (방 이동)
 * - MATCH_MAKE_FAIL : 매치가 실패함 (에러) ? 필요한가?
 */

function MatchMake(props: any) {
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    interface difficulty {
        id: string; // 아이디
        name: string;   // Easy, Normal, Hard
        speed: number;  // 속도
        defaultChecked: boolean;    // 기본 선택 여부
    }
    const difficulties: difficulty[] = [
        {id: '0', name: 'Easy', speed: 1, defaultChecked: true}, 
        {id: '1', name: 'Normal', speed: 2, defaultChecked: false},
        {id: '2', name: 'Hard', speed: 3, defaultChecked: false}
    ];
    const [selectedDifficulty, setSelectedDifficulty] = useState<difficulty>(difficulties[0]);

    useEffect(() => {
        socket.on('MATCH_MAKE_SUCCESS', (data: any) => {
            console.log('MATCH_MAKE_SUCCESS');
            // TODO 방 번호 뿐 아니라 플레이어들의 정보도 받아야 함. (상대의 id도 표시해줘야함)
            navigate(`/game/match/${data.room}`);
        });
    }, []);

    function handleMatchMakeRequest(e: any) {
        e.preventDefault();
        socket.emit('REQUEST_MATCH_MAKE', {difficulty: selectedDifficulty.id});
        console.log(selectedDifficulty.id);
        setLoading(true);
    }

    if (loading) {
        return (
            <Center>
                <Stack>
                    <div>게임 매칭 대기중</div>
                    <Spinner />
                </Stack>
            </Center>
        );
    }
    else {
        return (
            <Center>
            <form onSubmit={handleMatchMakeRequest}>
                <RadioGroup defaultValue='0'>
                    <Stack>
                    {difficulties.map((item) =>
                        <Radio key={item.id} value={item.id} onChange={(e) => setSelectedDifficulty(difficulties[(e.target.value as unknown as number)])}>{item.name}</Radio>
                        )}
                    <div>{selectedDifficulty.name} 단계는 반사 속도가 {selectedDifficulty.speed}부터 시작합니다.</div>
                    <Button type="submit">Request Match!</Button>
                    </Stack>
                </RadioGroup>
            </form>
            </Center>
        );
    }
}

export default MatchMake;