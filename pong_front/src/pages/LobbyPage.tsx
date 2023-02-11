import { MainWrapper } from "../common/main/MainWrapper";
import {MenuButtons, LobbyButtons, LobbyModal} from "../components/lobby/"

export default function LobbyPage() {
  return (
    <MainWrapper>
      <MenuButtons/>
      <LobbyButtons/>
      <LobbyModal />
    </MainWrapper>
  );
}
