import { useState } from 'react';
import { useEffect } from 'react';
import '../../App.css';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { SetterOrUpdater } from 'recoil';

export default function InitProfile(props: {setter: SetterOrUpdater<any>}) {
    const [avatar, setAvatar] = useState("default.jpeg");
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
      props.setter(false);
      axios.get('http://localhost:3000/api/user/init/status', {withCredentials: true})
      .then(res => {
        if (res.data && res.data.msg === true)
          navigate('/lobby');
      })
      .catch(err => {
          navigate('/'); //로그인 안되어 있다면 로그인페이지로 돌아간다.
      });
    }, []);

    //프로필 아바타 및 이름 변경.
    function handleInitSubmit(event : any) {
        event.preventDefault();
        axios.patch('http://localhost:3000/api/user', {avatar : avatar, username : username}, {withCredentials: true})
        .then(res => {
            navigate('/lobby'); 
        })
        .catch(err => {
            alert("Name in use");
        })
    };

    function handleInitKey(event : any) {
        if (event.key !== 'Enter')
          return ;
        event.preventDefault();
        handleInitSubmit(event);
    };

    return (
      <div className="App">
        <header className="App-header">
        <img src={require("../../assets/pinga-door.gif")} className='background-pinga'/>
                <h1>Profile Init</h1>
                <div className="initForm">
                    Avatar : 
                    <select onChange={event => setAvatar(event.target.value)} value={avatar}>
                        <option value="default.jpeg" key="default.jpeg">Pinga</option>
                        <option value="favicon.ico" key="favicon.ico">Pingu</option>
                        <option value="logo192.png" key="logo192.png">React</option>
                    </select>
                    Name : <input onKeyDown={handleInitKey} type="text" placeholder="" onChange={event => setUsername(event.target.value)} value={username} />
                    <button className="profile-button" onClick={handleInitSubmit}>
                        입장
                    </button>
                </div>
        </header>
      </div>
  );
}
