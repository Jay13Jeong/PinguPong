import GameWatchList from "../../components/game/GameWatchList";
import useCheckLogin from "../../util/useCheckLogin";

function GameWatchPage () {
    useCheckLogin();
    return (
        <GameWatchList/>
    );
}

export default GameWatchPage