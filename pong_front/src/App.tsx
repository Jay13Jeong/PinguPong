import React, { useEffect, useState } from 'react';
import './App.css';
import Routing from './Routing';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { ThemeProvider } from "styled-components";
import theme from "./styles/Theme";
import { RecoilRoot } from 'recoil';
import {SocketContext, socket} from './states/contextSocket'
import GlobalStyle from './GlobalStyles';
import TopMenuBar from './components/TopMenuBar';
import Modal from './components/modal/Modal';
import axios from 'axios';
import * as types from "./components/profile/User"

function App() {
  const [userInfo, setUserInfo] = useState<types.User>({
    id: 0,
    avatar: "https://cdn.myanimelist.net/images/characters/11/421848.jpg",
    userName: "pinga",
    myProfile: true,    // TODO - 더 좋은 방법이 있을지 생각해보기
    userStatus: "test",
    rank: 0,
    odds: 0,
    record: []
  });
  useEffect(() => {
    // TODO: 유저 정보를 받아온다.
    // setUserInfo();
    axios.get('http://localhost:3000/api/user', {withCredentials: true}) //쿠키와 함께 보내기 true.
    .then(res => {
        // console.log(res.data);
        if (res.data){
            let totalGame = res.data.wins + res.data.loses;
            let myInfo : types.User = {
                id : res.data.id,
                avatar: res.data.avatar,
                userName : res.data.username as string,
                myProfile : true,
                userStatus : 'off',
                rank : 0,
                odds : res.data.wins == 0? 0 : Math.floor(totalGame / res.data.wins),
                record : [],
            };
            setUserInfo(myInfo);
        }
    })
    .catch(err => {})
  }, []);

  return (
    <div >
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <RecoilRoot>
          <GlobalStyle />
          <SocketContext.Provider value={socket}>
            {userInfo.userStatus == 'test'? <></>
            :<TopMenuBar user={userInfo}/>}
            <Modal user={userInfo}/>
            <Routing />
          </SocketContext.Provider>
        </RecoilRoot>
      </BrowserRouter>
    </ThemeProvider>
    </div>
  );
}

export default App;
