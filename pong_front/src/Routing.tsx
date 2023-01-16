import { Route, Routes } from 'react-router';
import LoginPage from './pages/auth/LoginPage';
import Test from './pages/TestPage';
import Lobby from './pages/LobbyPage';
import Modal from './pages/profile/profileModal';
import GameLobbyPage from './pages/game/GameLobbyPage';
import GameMatchPage from './pages/game/GameMatchPage';
import GameRoomPage from './pages/game/GameRoomPage';

export default function Routing() {
    return (
      <Routes>
        <Route path="/" element={<Test />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/modal" element={<Modal />} />
        <Route path="/game/" element={<GameLobbyPage/>}></Route>
        <Route path="/game/match" element={<GameMatchPage/>}></Route>
        <Route path="/game/match/:id" element={<GameRoomPage/>}></Route>
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