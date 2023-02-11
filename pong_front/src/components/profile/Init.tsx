import { ChangeEvent, useRef, useState } from 'react';
import { useEffect } from 'react';
import '../../App.css';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { SetterOrUpdater } from 'recoil';
import { REACT_APP_HOST } from '../../common/configData';

export default function InitProfile(props: {setter: SetterOrUpdater<any>}) {
    // const [avatar, setAvatar] = useState("default.jpeg");
    const [username, setUsername] = useState('');
    const inputRef = useRef<HTMLInputElement | null> (null);
    const [avatarFile, setAvatarFile] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
      props.setter(false);
      axios.get('http://' + REACT_APP_HOST + ':3000/api/user/init/status', {withCredentials: true})
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
          axios.patch('http://' + REACT_APP_HOST + ':3000/api/user', { username : username }, {withCredentials: true})
          .then(res => {
              if (inputRef.current && inputRef.current.value)
              {
                axios.post('http://' + REACT_APP_HOST + ':3000/api/user/avatar', {file: inputRef.current.files![0]}, {withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' }})
                .then((res) => {
                  navigate('/lobby');
                })
                .catch((err) => {
                  alert("img upload fail");
                })
                return ;
              }
              navigate('/lobby');
          })
          .catch(err => {
              alert("Name in use");
          });
    };

    function handleInitKey(event : any) {
        if (event.key !== 'Enter')
          return ;
        event.preventDefault();
        handleInitSubmit(event);
    };

    function onAvatar(e: ChangeEvent<HTMLInputElement>) {
      const image: File = e.target.files![0];
      setAvatarFile(URL.createObjectURL(image));
    }

    return (
      <div className="App">
        <header className="App-header">
        <img src={require("../../assets/pinga-door.gif")} className='background-pinga'/>
                <h1>Profile Init</h1>
                <div className="initForm">
                    <div className="profile-box">
                        {avatarFile !== '' ?
                        <img className="profile-image" src={avatarFile}/>  
                        : null}
                    </div>
                    Avatar : 
                    <input ref={inputRef} type="file" id="img" name="img" accept="image/*" onChange={onAvatar}/>
                    <br/>
                    Name : <input onKeyDown={handleInitKey} type="text" placeholder="사용 할 이름" onChange={event => setUsername(event.target.value)} value={username} />
                    <button className="profile-button" onClick={handleInitSubmit}>
                        입장
                    </button>
                </div>
        </header>
      </div>
  );
}
