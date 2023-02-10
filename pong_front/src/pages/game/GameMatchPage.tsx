import React from "react";
import MatchMake from "../../components/game/MatchMake";
import useCheckLogin from "../../util/useCheckLogin";

function GameMatchPage() {
    useCheckLogin();
    return (
        <div>
            <MatchMake/>
        </div>
    );
}

export default GameMatchPage;