import {Routes, Route} from 'react-router-dom'
import useCheckLogin from "./util/useCheckLogin";

export const RoutePath = {
    root: "/",
    fa2: "/auth/fa2",
    profile: "/profile/init",
    chat: "/chat",
    game: "/game",
    dm: "/dm"
}

export default function Routing() {
    useCheckLogin();
    return (
        <Routes>
            {/* Login Page */}
            {/* FA2 Page */}
            {/* Chat Lobby */}
            {/* Chat Room */}
            {/* Game Lobby */}
            {/* Game Match */}
            {/* Game Play */}
            {/* Game Watch List */}
            {/* Game Watch */}
            {/* DM */}
            {/* Not Found */}
        </Routes>
    )
}