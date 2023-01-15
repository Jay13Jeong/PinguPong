// import { useState, useEffect } from 'react';
// import logo from '../logo.svg';
import '../App.css';
import { Link } from "react-router-dom";

export default function Lobby() {
    // const [test, setTest] = useState(0);
    // useEffect(() => {
    // }, []);
  return (
    <div className="App">
      
      <header className="App-header">
        <Link to="/game">
          <button>GAME</button>
        </Link>
        <Link to="/chat">
          <button>CHAT</button>
        </Link>
      </header>
    </div>
  );
}
