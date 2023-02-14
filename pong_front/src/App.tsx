import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import {SocketContext, socket} from './common/states/contextSocket';
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
