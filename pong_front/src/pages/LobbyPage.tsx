import { ContentBox } from "../common/styles/ContentBox.style";
import {MenuButtons, LobbyButtons, LobbyModal} from "../components/lobby/"

export default function LobbyPage() {
  return (
    <ContentBox>
      <MenuButtons/>
      <LobbyButtons/>
      <LobbyModal />
    </ContentBox>
  );
}
