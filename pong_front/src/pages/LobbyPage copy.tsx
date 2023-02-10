import { MainWrapper } from "../components/common/main/MainWrapper";
import MenuButtons from "../components/lobby/MenuButtons"
import LobbyButtons from "../components/lobby/LobbyButtons";
// Lobby Modal

export default function CopyLobbyPage() {
  return (
    <MainWrapper>
      <MenuButtons/>
      <LobbyButtons/>
      {/* TODO : Lobby Modal */}
    </MainWrapper>
  );
}
