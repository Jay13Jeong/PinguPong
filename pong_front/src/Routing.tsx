import { Route, Routes } from 'react-router';
import LoginPage from './pages/auth/LoginPage';
import FA2Page from './pages/auth/FA2Page';
import Lobby from './pages/LobbyPage';
import ProfileInitPage from './pages/profile/ProfileInitPage';
import GameLobbyPage from './pages/game/GameLobbyPage';
import GameMatchPage from './pages/game/GameMatchPage';
import GamePlayRoomPage from './pages/game/GamePlayRoomPage';
import ChatRoom from './pages/chat/ChatRoom';
import EditChatRoomModal from './pages/chat/EditChatRoomModal';
import ChatManageModal from './pages/chat/ChatManageModal';
import GameWatchPage from './pages/game/GameWatchPage';
import GameWatchRoomPage from './pages/game/GameWatchRoomPage'
import ChatLobby from './pages/chat/ChatLobby';
import DmPage from './pages/dm/DmPage';
import NotFound from './pages/NotFound';
import { SetterOrUpdater } from 'recoil';
import useCheckLogin from './util/useCheckLogin';
import MainLayout from './components/layout/MainLayout';
import CopyLobbyPage from "./pages/LobbyPage copy"

export default function Routing(props: {setter: SetterOrUpdater<any>}) {
    // useCheckLogin();
    return (
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/test" element={<MainLayout/>}>
          <Route path="lobby" element={<CopyLobbyPage/>}/>
        </Route>
        <Route path="/auth/fa2" element={<FA2Page />} />
        <Route path="/profile/init" element={<ProfileInitPage setter={props.setter}/>} />
        <Route path="/lobby" element={<Lobby setter={props.setter}/>} />
        <Route path="/chat" element={<ChatLobby />} />
        <Route path="/chat/room/:id" element={<ChatRoom />} />
        {/* <Route path="/chat/room/change" element={<EditChatRoomModal />} /> */}
        {/* <Route path="/chat/manage/:id" element={<ChatManageModal />} /> */}
        <Route path="/game/" element={<GameLobbyPage/>}></Route>
        <Route path="/game/match" element={<GameMatchPage/>}></Route>
        <Route path="/game/match/:id" element={<GamePlayRoomPage/>}></Route>
        <Route path="/game/watch" element={<GameWatchPage/>}></Route>
        <Route path="/game/watch/:id" element={<GameWatchRoomPage/>}></Route>
        <Route path='/dm/:id' element={<DmPage/>}></Route>
        <Route path='*' element={<NotFound/>}></Route>
      </Routes>
    );
  }