import React from 'react';
import './App.css';
import Routing from './Routing';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from "styled-components";
import theme from "./styles/Theme";
import { RecoilRoot } from 'recoil';
import GlobalStyle from './GlobalStyles';
import TopMenuBar from './components/TopMenuBar';

function App() {
  return (
    <div >
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <RecoilRoot>
        <GlobalStyle />
        <TopMenuBar/>
        <Routing />
        </RecoilRoot>
      </BrowserRouter>
    </ThemeProvider>
    </div>
  );
}

export default App;
