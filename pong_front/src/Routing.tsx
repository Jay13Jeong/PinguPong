import { Route, Routes } from 'react-router';
import LoginPage from './pages/auth/LoginPage';
import FA2Page from './pages/auth/FA2Page';
import Test from './pages/TestPage';
import Lobby from './pages/LobbyPage';
import ProfilePage from './pages/profile/ProfileModal';
import EditProfilePage from './pages/profile/EditProfileModal';
import GameLobbyPage from './pages/game/GameLobbyPage';
import GameMatchPage from './pages/game/GameMatchPage';
import GamePlayRoomPage from './pages/game/GamePlayRoomPage';
import ChatLobbyPage from './pages/chat/ChatLobbyPage';
import CreateChatModal from './pages/chat/CreateChatModal';
import SelectPrivateChatModal from './pages/chat/SelectPrivateChatModal';
import ChatRoomPage from './pages/chat/ChatRoomPage';
import EditChatRoomModal from './pages/chat/EditChatRoomModal';
import ChatManageModal from './pages/chat/ChatManageModal';
import GameWatchPage from './pages/game/GameWatchPage';
import GameWatchRoomPage from './pages/game/GameWatchRoomPage'
import ChatLobby from './pages/chat/ChatLobby';
import { SetterOrUpdater } from 'recoil';

export default function Routing(props: {setter: SetterOrUpdater<any>}) {
    return (
      <Routes>
        {/* <Route path="/" element={<Test />} /> */}
        <Route path="/lobby" element={<Lobby setter={props.setter}/>} />
        <Route path="/chatt" element={<ChatLobbyPage />} />
        <Route path="/chat" element={<ChatLobby />} />
        <Route path="/chat/create" element={<CreateChatModal />} />
        <Route path="/chat/select/private/:id" element={<SelectPrivateChatModal />} />
        <Route path="/chat/room/:id" element={<ChatRoomPage />} />
        <Route path="/chat/room/change" element={<EditChatRoomModal />} />
        <Route path="/chat/manage/:id" element={<ChatManageModal />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/auth/fa2" element={<FA2Page />} />
        <Route path="/profile/:id" element={<ProfilePage />} />
        <Route path="/profile/edit/:id" element={<EditProfilePage />} />
        {/* Game */}
        <Route path="/game/" element={<GameLobbyPage/>}></Route>
        <Route path="/game/match" element={<GameMatchPage/>}></Route>
        <Route path="/game/match/:id" element={<GamePlayRoomPage/>}></Route>
        <Route path="/game/watch" element={<GameWatchPage/>}></Route>
        <Route path="/game/watch/:id" element={<GameWatchRoomPage/>}></Route>
        {/* <Route path="/lesson/category" element={<CategoryPage />} />
        <Route path="/lesson/classes" element={<ClassListPage />} />
        <Route path="/lesson/class/:id" element={<ClassPage />} />
        <Route path="/lesson/manage" element={<ManageClassPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/lesson/write" element={<WriteClassPage />} />
        <Route path="/lesson/write/:id" element={<WriteClassPage />} />
        <Route path="/profile/:id" element={<ViewProfilePage />} />
        <Route path="/profile/tutor/:id" element={<ViewTutorProfilePage />} />
        <Route path="/profile/likes/" element={<ViewMyLikesPage />} />
        <Route path="/profile/manage" element={<ManageProfilePage />} />
        <Route path="/profile/edit/:id" element={<EditProfilePage />} />
        <Route
          path="/profile/tutor/edit/:id"
          element={<EditTutorProfilePage />}
        />
        <Route path="/bookmark/" element={<ViewMyBookmarksPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/setting" element={<SettingPage />} />
        <Route path="/setting/help" element={<HelpPage />} />
        <Route path="/setting/contact" element={<ContactPage />} />
        <Route path="/setting/aboutus" element={<AboutusPage />} />
        <Route path="/setting/policy" element={<PolicyPage />} />
        <Route path="/setting/license" element={<LicensePage />} /> */}
      </Routes>
    );
  }