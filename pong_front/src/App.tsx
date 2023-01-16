import React from 'react';
import './App.css';
import Routing from './Routing';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react'

import socketIOClient from "socket.io-client";

const ENDPOINT = "http://localhost:3001";

export const socket = socketIOClient(ENDPOINT, {
    transports: ['websocket'],
    withCredentials: true,
});

function App() {
  return (
    <div >
    <ChakraProvider>
      <BrowserRouter>
        <Routing />
      </BrowserRouter>
    </ChakraProvider>
    </div>
  );
}

export default App;
