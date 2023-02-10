import GameWatchRoom from "../../components/game/GameWatchRoom"
import useCheckLogin from "../../util/useCheckLogin";

function GameWatchRoomPage() {
    useCheckLogin();
    return (
        <GameWatchRoom/>
    );
}

export default GameWatchRoomPage;