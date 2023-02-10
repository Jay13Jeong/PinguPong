import ProfileInit from '../../components/profile/Init';
import { SetterOrUpdater } from 'recoil';
import useCheckLogin from '../../util/useCheckLogin';

export default function ProfileInitPage(props: {setter: SetterOrUpdater<any>}) {
    useCheckLogin();
    return (
      <ProfileInit setter={props.setter}/>
    );
  }