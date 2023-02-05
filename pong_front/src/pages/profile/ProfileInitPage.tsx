import ProfileInit from '../../components/profile/Init';
import { SetterOrUpdater } from 'recoil';

export default function ProfileInitPage(props: {setter: SetterOrUpdater<any>}) {
    return (
      <ProfileInit setter={props.setter}/>
    );
  }