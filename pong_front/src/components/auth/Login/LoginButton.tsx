import { REACT_APP_HOST } from '../../../common/configData';
export default function LoginButton() {
    return (
        <button className='loginbtn' onClick={()=>{window.location.href = "http://" + REACT_APP_HOST + ":3000/api/auth/42/login"}}>
        .-----------.<br/>
        | <b>LOGIN</b> |<br/>
        '-----------'
        </button> 
    );
}