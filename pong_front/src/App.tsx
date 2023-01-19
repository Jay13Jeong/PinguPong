import React from 'react';
import './App.css';
import Routing from './Routing';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from "styled-components";
import theme from "./styles/Theme";

import io from "socket.io-client";

const ENDPOINT = "http://localhost:3001";

// export const socket = socketIOClient(ENDPOINT, {
//     transports: ['websocket'],
//     withCredentials: true,
// });

function App() {
  const ENDPOINT = "http://localhost:3000/api/chat";
  const socket = io(ENDPOINT);
  socket.emit('getchatlist');
  socket.on('chatlist', function (data) {
    console.log('list', data);
});
  return (
    <div >
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routing />
      </BrowserRouter>
    </ThemeProvider>
    </div>
  );
}

export default App;
