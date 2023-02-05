import { useState } from 'react';
import { useEffect } from 'react';
import '../../App.css';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { REACT_APP_HOST } from '../../util/configData';

export default function EditProfile() {
    const navigate = useNavigate();
    const [code, setCode] = useState('');

    useEffect(() => {
      //2단계인증이 켜져있는지 검사.
      axios.get('http://' + REACT_APP_HOST + ':3000/api/fa2/status', {withCredentials: true}) //쿠키와 함께 보내기 true.
      .then(res => {
        // axios.get('http://localhost:3000/api/fa2',{withCredentials: true});
        if (res.data.twofa === false){
          navigate('/lobby');
        } else {
          //켜져있다며 메일을 요청한다.
          axios.get('http://' + REACT_APP_HOST + ':3000/api/fa2',{withCredentials: true});
        }
      })
      .catch(err => {
        if (err.response.data.statusCode === 401)
          navigate('/'); //로그인 안되어 있다면 로그인페이지로 돌아간다.
      })
    }, []);
  
    function handleSubmit(event : any) {
      event.preventDefault();
      axios.post('http://' + REACT_APP_HOST + ':3000/api/fa2', {code : code}, {withCredentials: true})
      .then(res => {
        if (res.status === 200)
          navigate('/lobby');
      })
      .catch(err => {
        alert('invalid code : check 42Email again');
      })
    };

    return (
      <div className="App">
        <header className="App-header">
        <img src={require("../../assets/pinga-door.gif")} className='background-pinga'/>
          <div>
              <table className='certTable'>
                  <tr>
                      <td>CODE : <input
                      type="text"
                      placeholder="check 42Email"
                      onChange={event => setCode(event.target.value)}
                      value={code}
                      /></td>
                  </tr>
                  <tr>
                      <td><button onClick={handleSubmit} className="confirmBtn">Confirm</button></td>
                  </tr>
              </table>
          </div>
        </header>
      </div>
  );
}
