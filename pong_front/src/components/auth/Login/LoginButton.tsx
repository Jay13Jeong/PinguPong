import { REACT_APP_HOST } from '../../../common/configData';
import * as S from './LoginButton.style';
export default function LoginButton() {
    return (
        <>
        <S.LoginButton className='loginbtn' onClick={()=>{window.location.href = "http://" + REACT_APP_HOST + ":3000/api/auth/google/login"}}>
        .---------------.<br/>
        | <b>GOOGLE</b> |<br/>
        '---------------'
        </S.LoginButton>

        <S.LoginButton className='loginbtn' onClick={()=>{window.location.href = "http://" + REACT_APP_HOST + ":3000/api/auth/42/login"}}>
        .--------------.<br/>
        | <b>42LOGIN</b> |<br/>
        '--------------'
        </S.LoginButton>
        </>
    );
}