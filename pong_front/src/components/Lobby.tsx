// import { useState, useEffect } from 'react';
// import logo from '../logo.svg';
import '../App.css';
import { Link } from "react-router-dom";
import { Button } from "../styles/Inputs"

export default function Lobby() {
    // const [test, setTest] = useState(0);
    // useEffect(() => {
    // }, []);
  return (
    <div className="App">
      
      <header className="App-header">
        <Link to="/game">
          <Button primary>GAME</Button>
        </Link>
        <Link to="/chat">
          <Button>CHAT</Button>
        </Link>
        <Link to="/chatt">
          <Button>CHAT_BASIC</Button>
        </Link>
      </header>
    </div>
  );
}
