import React from 'react';
import './App.css';
import Routing from './Routing';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from "styled-components";
import theme from "./styles/Theme";
import { RecoilRoot } from 'recoil';

import socketIOClient from "socket.io-client";

const ENDPOINT = "http://localhost:3001";

export const socket = socketIOClient(ENDPOINT, {
    transports: ['websocket'],
    withCredentials: true,
});

function App() {
  return (
    <div >
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <RecoilRoot>
        <Routing />
        </RecoilRoot>
      </BrowserRouter>
    </ThemeProvider>
    </div>
  );
}

export default App;
