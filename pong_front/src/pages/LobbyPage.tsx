import { SetterOrUpdater } from 'recoil';
import Lobby from '../components/Lobby';

export default function LobbyPage(props: {setter: SetterOrUpdater<any>}) {
  return (
    <div>
      <Lobby setter={props.setter}/>
    </div>
  );
}
