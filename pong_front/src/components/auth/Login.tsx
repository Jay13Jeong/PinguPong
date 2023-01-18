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
      <button onClick={()=>{window.location.href = "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-e607d301881ee531825879addc115683a5bf969a5afc9160db766b30e0132ef3&redirect_uri=http%3A%2F%2Flocalhost%2Fauth%2Ffa2&response_type=code"}}>
      #########<br/>
      # LOGIN #<br/>
      #########
      </button>
      </header>
    </div>
  );
}
