import React, {useState} from "react";
import {Button} from "../../styles/Inputs";
import styled from "styled-components";

const SelectedDifficultyButton = styled(Button)`
        background: teal
    `;

function DifficultyButtons (props: {difficulty: number, setDifficulty: Function}) {
    const [current_difficulty, setCurrentDifficulty] = useState<number>(props.difficulty);
    
    function handleDifficultyChange(value: number, e: React.MouseEvent<HTMLElement>) {
        props.setDifficulty(value);   // parent component의 Difficulty를 변경하는 함수
        setCurrentDifficulty(value);    // 현재 component의 Difficulty를 변경하는 함수
    }

    return (
        <div>
            {current_difficulty === 0 ? <SelectedDifficultyButton>"EASY"</SelectedDifficultyButton> : <Button onClick={(e) => handleDifficultyChange(0, e)}>"EASY"</Button>}
            {current_difficulty === 1 ? <SelectedDifficultyButton>"NORMAL"</SelectedDifficultyButton> : <Button onClick={(e) => handleDifficultyChange(1, e)}>"NORMAL"</Button>}
            {current_difficulty === 2 ? <SelectedDifficultyButton>"HARD"</SelectedDifficultyButton> : <Button onClick={(e) => handleDifficultyChange(2, e)}>"HARD"</Button>}
        </div>
    );
}

export default DifficultyButtons;