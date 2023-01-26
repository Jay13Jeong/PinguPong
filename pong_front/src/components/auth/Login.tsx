// import { useState, useEffect } from 'react';
// import logo from '../logo.svg';
import '../../App.css';

export default function Login() {
    // const [test, setTest] = useState(0);
    // useEffect(() => {
    // }, []);
  return (
    <div className="App">
      
      <header className="App-header">
      <button onClick={()=>{window.location.href = "http://localhost:3000/api/auth/42/login"}}>
      .-----------.<br/>
      | <b>LOGIN</b> |<br/>
      '-----------'
      </button>
      </header>
    </div>
  );
}
