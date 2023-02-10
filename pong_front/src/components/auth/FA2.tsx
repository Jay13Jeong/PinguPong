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
      const get2faStatus = async () => {
        try{
          const res = await axios.get('http://' + REACT_APP_HOST + ':3000/api/fa2/status', {withCredentials: true}) //쿠키와 함께 보내기 true.
          if (res.data.twofa === false){
            navigate('/lobby'); //2단계인증이 꺼져있으면 로비로 간다.
            return ;
          }
        }catch(err: any){
          // console.log(err);
          navigate('/'); //로그인 안되어 있다면 로그인페이지로 돌아간다.
        }
        try{
          await axios.get('http://' + REACT_APP_HOST + ':3000/api/fa2',{withCredentials: true});
        } catch(err: any) {
          // console.log(err);
          navigate('/'); //로그인 안되어 있다면 로그인페이지로 돌아간다.
        }
      }
      get2faStatus();
    }, []);
  
    function handleSubmit(event : any) {
      event.preventDefault();
      const submitCode = async () => {
        try{
          const res = await axios.post('http://' + REACT_APP_HOST + ':3000/api/fa2', {code : code}, {withCredentials: true})
          if (res.status === 200)
            navigate('/lobby');
        }catch(err: any){
          alert('invalid code : check 42Email again');
        }
      }
      submitCode();
    };

    return (
      <div className="App">
        <header className="App-header">
        <img src={require("../../assets/pinga-door.gif")} className='background-pinga'/>
          <div>
              <table className='certTable'>
                <tbody>
                  <tr>
                      <td>CODE : <input
                      type="text"
                      placeholder="check 42Email"
                      onChange={event => setCode(event.target.value)}
                      value={code}
                      /></td>
                  </tr>
                  <tr>
                      <td><button onClick={handleSubmit} className="confirmBtn">OK</button></td>
                  </tr>
                  </tbody>
              </table>
          </div>
        </header>
      </div>
  );
}
