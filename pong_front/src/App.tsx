import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import {SocketContext, socket} from './common/states/contextSocket';
import GlobalStyle from './common/styles/GlobalStyle';
import Cursor from './components/util/Cursor';
import Routing from './Routing';

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
