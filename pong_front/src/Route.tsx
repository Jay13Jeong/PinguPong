import {Routes, Route} from 'react-router-dom'
import useCheckLogin from "./util/useCheckLogin";
import {MainLayout, LoginLayout} from "./components/layout/";
import { LobbyPage } from "./pages/"
import {LoginPage, FA2Page} from './pages/auth/';
import { ChatLobbyPage, ChatRoomPage } from './pages/chat';
import { GameLobbyPage, GameMatchPage, GameWatchPage, GamePlayRoomPage, GameWatchRoomPage } from './pages/game';
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
                <Route path={RoutePath.game} element={<GameLobbyPage/>}/>
                <Route path={RoutePath.gameMatch} element={<GameMatchPage/>}/>
                <Route path={`${RoutePath.gameMatch}/:id`} element={<GamePlayRoomPage/>}/>
                <Route path={RoutePath.gameWatch} element={<GameWatchPage/>}/>
                <Route path={`${RoutePath.gameWatch}/:id`} element={<GameWatchRoomPage/>}/>
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