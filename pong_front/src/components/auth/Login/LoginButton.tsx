import { REACT_APP_HOST } from '../../../common/configData';
import * as S from './LoginButton.style';
export default function LoginButton() {
    return (
        <S.LoginButton className='loginbtn' onClick={()=>{window.location.href = "http://" + REACT_APP_HOST + ":3000/api/auth/42/login"}}>
        .-----------.<br/>
        | <b>LOGIN</b> |<br/>
        '-----------'
        </S.LoginButton> 
    );
}