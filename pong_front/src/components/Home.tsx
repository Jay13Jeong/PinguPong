// import { useState, useEffect } from 'react';
import logo from '../logo.svg';
import '../App.css';

export default function Home() {
    // const [test, setTest] = useState(0);
    // useEffect(() => {
    // }, []);
  return (
    <div className="App">
      
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}
