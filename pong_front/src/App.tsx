import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import {SocketContext, socket} from './common/states/contextSocket';
import GlobalStyle from './common/styles/GlobalStyle';
import { theme } from './common/styles/Theme.style';
import { ThemeProvider } from '@mui/material';
import Cursor from './components/util/Cursor';
import Routing from './Routing';

function App() {

  return (
    <div >
      <BrowserRouter>
      <ThemeProvider theme={theme}>
        <RecoilRoot>
          <SocketContext.Provider value={socket}>
            <GlobalStyle />
            <Cursor/>
            <Routing />
          </SocketContext.Provider>
        </RecoilRoot>
      </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}
export default App;
