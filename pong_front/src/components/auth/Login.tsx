import '../../App.css';
import pingu from "../../assets/Pingu3D.png"
import { REACT_APP_HOST } from '../../util/configData';
import "./Login.scss"

export default function Login() {
  return (
    <div className="App">
      <header className="App-header">
      <img src={require("../../assets/pingu-lollipop.gif")} className='background-pinga'/>
      <button className='loginbtn' style={{backgroundColor: "skyblue"}} onClick={()=>{window.location.href = "http://" + REACT_APP_HOST + ":3000/api/auth/42/login"}}>
      .-----------.<br/>
      | <b>LOGIN</b> |<br/>
      '-----------'
      </button>
      <div className='pingu-wrapper'>
        <img className='pingu' src={pingu} alt="moving pingu" />
      </div>
      </header>
    </div>
  );
}
