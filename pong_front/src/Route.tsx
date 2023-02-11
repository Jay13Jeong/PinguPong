import {Routes, Route} from 'react-router-dom'
import useCheckLogin from "./util/useCheckLogin";
import {MainLayout, LoginLayout} from "./components/layout/";
import { LobbyPage } from "./pages/"
import { ChatLobbyPage } from './pages/chat';
import {LoginPage} from './pages/auth/';

export const RoutePath = {
    root: "/",
    lobby: "/lobby",
    fa2: "/fa2",
    profile: "/profile/init",
    chat: "chat",
    game: "/game",
    dm: "/dm"
}

export default function Routing() {
    useCheckLogin();
    return (
        <Routes>
            <Route path={RoutePath.lobby} element={<MainLayout/>}>
                <Route path="" element={<LobbyPage/>}/>
                <Route path={RoutePath.chat} element={<ChatLobbyPage/>}/>
            </Route>
            <Route path={RoutePath.root} element={<LoginLayout/>}>
                <Route path="" element={<LoginPage/>}/>
            </Route>
            
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