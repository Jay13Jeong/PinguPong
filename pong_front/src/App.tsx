import React, { useEffect, useState } from 'react';
import './App.css';
// import Routing from './Routing';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { ThemeProvider } from "styled-components";
import { RecoilRoot, useRecoilState } from 'recoil';
import {SocketContext, socket} from './common/states/contextSocket';
// import TopMenuBar from './components/TopMenuBar';
// import Modal from './components/modal/Modal';
import Routing from './Routing';
import GlobalStyle from './common/styles/GlobalStyle';
import Cursor from './components/util/Cursor';

function App() {

  return (
    <div >
      <BrowserRouter>
        <RecoilRoot>
          <SocketContext.Provider value={socket}>
            <GlobalStyle />
            <Cursor/>
            <Routing />
          </SocketContext.Provider>
        </RecoilRoot>
      </BrowserRouter>
    </div>
  );
}
export default App;
