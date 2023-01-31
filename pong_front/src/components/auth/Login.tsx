// import { useState, useEffect } from 'react';
// import logo from '../logo.svg';
import '../../App.css';
import pingu from "../../assets/Pingu3D.png"
import "./Login.scss"

export default function Login() {
    // const [test, setTest] = useState(0);
    // useEffect(() => {
    // }, []);
  return (
    <div className="App">
      
      <header className="App-header">
      <button style={{backgroundColor: "lightgrey"}} onClick={()=>{window.location.href = "http://localhost:3000/api/auth/42/login"}}>
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
