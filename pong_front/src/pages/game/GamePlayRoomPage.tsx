import GamePlayRoom from "../../components/game/GamePlayRoom";
import useCheckLogin from "../../util/useCheckLogin";

function GamePlayRoomPage() {
    useCheckLogin();
    return (
        <GamePlayRoom/>
    );
}

export default GamePlayRoomPage;