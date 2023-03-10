import styled from "styled-components";

const GameRoomGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, minmax(400px, 400px));
    grid-template-rows: repeat(3, minmax(auto, auto));
    grid-row-gap: 20px;
    .player-name{
        text-align: center;
        font-size: 1rem;
        font-weight: bold;
    }
    .score{
        text-align: center;
        font-size: 2rem;
        font-weight: bold;
    }
    .game-canvas{
        grid-column: 1 / 3;
    }
`

export default GameRoomGrid;