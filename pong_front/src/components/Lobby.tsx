// import { useState, useEffect } from 'react';
// import logo from '../logo.svg';
import '../App.css';
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../styles/Inputs"
import { SetterOrUpdater, useRecoilState } from 'recoil';
import { loginState } from '../states/recoilModalState';
import { useEffect } from 'react';
import axios from 'axios';

export default function Lobby(props: {setter: SetterOrUpdater<any>}) {
    // const [test, setTest] = useState(0);
    // useEffect(() => {
    // }, []);

  // const  [loginOk, setLoginOk] = useRecoilState(loginState);

  useEffect(() => {
    axios.get('http://localhost:3000/api/user', {withCredentials: true}) //쿠키와 함께 보내기 true.
    .then(res => {
        if (res.data && res.data.id){
            props.setter(true);
                // let totalGame = res.data.wins + res.data.loses;
                // let myInfo : types.User = {
                //     id : res.data.id,
                //     avatar: res.data.avatar,
                //     userName : res.data.username as string,
                //     myProfile : true,
                //     userStatus : 'off',
                //     rank : 0,
                //     odds : res.data.wins == 0? 0 : Math.floor(totalGame / res.data.wins),
                //     record : [],
                // };
                // setUserInfo(myInfo);
        }
    })
    .catch(err => {
        props.setter(false);
        // const navigate = useNavigate();
        useNavigate()('/'); //로그인 안되어 있다면 로그인페이지로 돌아간다.
    })
  }, []);

  return (
    <div className="App">
      
      <header className="App-header">
        <Link to="/game">
          <Button primary>GAME</Button>
        </Link>
        <Link to="/chat">
          <Button>CHAT</Button>
        </Link>
        <Link to="/chatt">
          <Button>CHAT_BASIC</Button>
        </Link>
      </header>
    </div>
  );
}
