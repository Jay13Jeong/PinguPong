import React, { useEffect, useState } from 'react';
import './App.css';
import Routing from './Routing';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { ThemeProvider } from "styled-components";
import theme from "./styles/Theme";
import { RecoilRoot, useRecoilState } from 'recoil';
import {SocketContext, socket} from './states/contextSocket'
import GlobalStyle from './GlobalStyles';
import TopMenuBar from './components/TopMenuBar';
import Modal from './components/modal/Modal';

function App() {

  const [loginOk, setLoginOk] = useState(false);

  return (
    <div >
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <RecoilRoot>
          <GlobalStyle />
          <SocketContext.Provider value={socket}>
            {loginOk?
            <TopMenuBar setter={setLoginOk}/> : null}
            {loginOk?
            <Modal/> : null}
            <Routing setter={setLoginOk} />
          </SocketContext.Provider>
        </RecoilRoot>
      </BrowserRouter>
    </ThemeProvider>
    </div>
  );
}
export default App;
