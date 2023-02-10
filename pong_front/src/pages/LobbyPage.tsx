import { SetterOrUpdater } from 'recoil';
import Lobby from '../components/Lobby';
import useCheckLogin from '../util/useCheckLogin';

export default function LobbyPage(props: {setter: SetterOrUpdater<any>}) {
  useCheckLogin();
  return (
    <div>
      <Lobby setter={props.setter}/>
    </div>
  );
}
