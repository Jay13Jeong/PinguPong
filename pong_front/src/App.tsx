import React from 'react';
import './App.css';
import Routing from './Routing';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from "styled-components";
import theme from "./styles/Theme";
import { RecoilRoot } from 'recoil';
import {SocketContext, socket} from './states/contextSocket'
import GlobalStyle from './GlobalStyles';
import TopMenuBar from './components/TopMenuBar';
import Modal from './components/modal/Modal';

function App() {
  return (
    <div >
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <RecoilRoot>
          <GlobalStyle />
          <SocketContext.Provider value={socket}>
            <TopMenuBar/>
            <Modal/>
            <Routing />
          </SocketContext.Provider>
        </RecoilRoot>
      </BrowserRouter>
    </ThemeProvider>
    </div>
  );
}

export default App;
