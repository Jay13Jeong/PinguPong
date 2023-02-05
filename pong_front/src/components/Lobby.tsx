import '../App.css';
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../styles/Inputs"
import { SetterOrUpdater, useRecoilState } from 'recoil';
import { useEffect } from 'react';
import axios from 'axios';

export default function Lobby(props: {setter: SetterOrUpdater<any>}) {
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3000/api/user/init/status', {withCredentials: true})
    .then(res => {
      if (res.data && res.data.msg === false)
        navigate('/profile/init')
    })
    .catch(err => {
        props.setter(false);
        navigate('/'); //로그인 안되어 있다면 로그인페이지로 돌아간다.
    })
    axios.get('http://localhost:3000/api/user', {withCredentials: true}) //쿠키와 함께 보내기 true.
    .then(res => {
        if (res.data && res.data.id){
            props.setter(true);
        }
    })
    .catch(err => {
        props.setter(false);
        navigate('/'); //로그인 안되어 있다면 로그인페이지로 돌아간다.
    })
  }, []);

  return (
    <div className="App">
      
      <header className="App-header">
      <img src={require("../assets/pingu-lollipop.gif")} className='background-pinga'/>
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
