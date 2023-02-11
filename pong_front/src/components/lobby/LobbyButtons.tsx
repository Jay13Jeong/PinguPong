import { Link } from "react-router-dom";
import * as S from "./LobbyButtons.style"
import { RoutePath } from "../../common/configData";

export default function LobbyButtons() {
    return (
        <S.LobbyButtonsWrapper>
            <Link to={RoutePath.game}><button>Game</button></Link>
            <Link to={RoutePath.chat}><button>Chat</button></Link>
        </S.LobbyButtonsWrapper>
    );
}