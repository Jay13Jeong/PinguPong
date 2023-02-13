import React, {useState} from "react";
import styled from "styled-components";

const SelectedDifficultyButton = styled.button`
        font-weight: bold;
        color: blue;
    `;

function DifficultyButtons (props: {difficulty: number, setDifficulty: Function}) {
    const [current_difficulty, setCurrentDifficulty] = useState<number>(props.difficulty);
    
    function handleDifficultyChange(value: number, e: React.MouseEvent<HTMLElement>) {
        props.setDifficulty(value);   // parent component의 Difficulty를 변경하는 함수
        setCurrentDifficulty(value);    // 현재 component의 Difficulty를 변경하는 함수
    }

    return (
        <div>
            {current_difficulty === 0 ? <SelectedDifficultyButton>✨EASY✨</SelectedDifficultyButton> : <button onClick={(e: React.MouseEvent<HTMLElement>) => handleDifficultyChange(0, e)}>✨EASY✨</button>}
            {current_difficulty === 1 ? <SelectedDifficultyButton>✨NORMAL✨</SelectedDifficultyButton> : <button onClick={(e: React.MouseEvent<HTMLElement>) => handleDifficultyChange(1, e)}>✨NORMAL✨</button>}
            {current_difficulty === 2 ? <SelectedDifficultyButton>✨HARD✨</SelectedDifficultyButton> : <button onClick={(e: React.MouseEvent<HTMLElement>) => handleDifficultyChange(2, e)}>✨HARD✨</button>}
        </div>
    );
}

export default DifficultyButtons;