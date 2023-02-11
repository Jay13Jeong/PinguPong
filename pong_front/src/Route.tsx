import {Routes, Route} from 'react-router-dom'
import useCheckLogin from "./util/useCheckLogin";
import {MainLayout, LoginLayout} from "./components/layout/";
import { LobbyPage } from "./pages/"
import { ChatLobbyPage, ChatRoomPage } from './pages/chat';
import {LoginPage, FA2Page} from './pages/auth/';
import {RoutePath} from "./common/configData";

export default function Routing() {
    useCheckLogin();
    return (
        <Routes>
            <Route path={RoutePath.root} element={<LoginLayout/>}>
                <Route path="" element={<LoginPage/>}/>
                <Route path={RoutePath.fa2} element={<FA2Page/>}/>
            </Route>
            <Route path={RoutePath.root} element={<MainLayout/>}>
                <Route path={RoutePath.lobby} element={<LobbyPage/>}/>
                <Route path={RoutePath.chat} element={<ChatLobbyPage/>}/>
                <Route path={`${RoutePath.chat}/room/:id`} element={<ChatRoomPage/>}/>
            </Route>
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