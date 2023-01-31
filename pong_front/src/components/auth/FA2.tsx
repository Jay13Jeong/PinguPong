import { useState } from 'react';
import { useEffect } from 'react';
import '../../App.css';
import { Link, useNavigate } from "react-router-dom";
import { createGlobalStyle }  from "styled-components";
import axios from 'axios';
import SelectPrivateChatModal from '../../pages/chat/SelectPrivateChatModal';

const TableParent = createGlobalStyle`
  table {
    width: 100%;
  }

  tr {
    width: 100%;
  }

  td  {
    width: 100%;
    border:1px solid black;
    margin-left:auto;
    margin-right:auto;
    
  }

  .img-wrapper {
      position: relative;
      width: 500px;
      height: 300px;
  }
  .img-wrapper img {
      position: absolute;
      top: 0;
      left: 0;
      transform: translate(50, 50);
      width: 100%;
      height: 100%;
      object-fit: cover;
      margin: auto;
  }

  .halfDiv {
    width: 50%;
  }
`;

interface User {
	id: number;
	username: string;
  email: string;
	twofa: boolean;
	avatar: string;
}

export default function EditProfile() {
    const navigate = useNavigate();
    // const [user, setUser] = useState<User>();
    // const [userName, setUsername] = useState("pinga"); //유저 이름.
    // const [userStatus, setUserStatus] = useState("off"); //접속상태.
    // const [rank, setRank] = useState(0); //랭크.
    // const [odds, setOdds] = useState(0); //승률.
    // const [record, setRecord] = useState([["cheolee",10,"jjeong",2],["cheolee",10,"jjeong",1],["jeyoon",10,"jjeong",5]]); //전적.
    const [code, setCode] = useState('');

    // const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    useEffect(() => {
      //2단계인증이 켜져있는지 검사.
      axios.get('http://localhost:3000/api/fa2/status', {withCredentials: true}) //쿠키와 함께 보내기 true.
      .then(res => {
        // axios.get('http://localhost:3000/api/fa2',{withCredentials: true});
        if (res.data.twofa === false){
          navigate('/lobby');
        } else {
          //켜져있다며 메일을 요청한다.
          axios.get('http://localhost:3000/api/fa2',{withCredentials: true});
        }
      })
      .catch(err => {
        if (err.response.data.statusCode === 401)
          navigate('/'); //로그인 안되어 있다면 로그인페이지로 돌아간다.
      })
    }, []);
  
    function handleSubmit(event : any) {
      event.preventDefault();
      axios.post('http://localhost:3000/api/fa2', {code : code}, {withCredentials: true})
      .then(res => {
        if (res.status === 200)
          navigate('/lobby');
      })
      .catch(err => {
        console.log('invalid auth');
      })
    };

    return (
      <div className="App">
        <header className="App-header">
          <div>
            <TableParent />
              <table>
                  <tr>
                      <td className="img-wrapper"><img src="https://scontent-ssn1-1.xx.fbcdn.net/v/t1.18169-9/10431485_666745710089728_670308968098148269_n.jpg?stp=cp0_dst-jpg_e15_fr_q65&_nc_cat=100&ccb=1-7&_nc_sid=110474&_nc_ohc=90mkqitwfMAAX9sFbrj&_nc_ht=scontent-ssn1-1.xx&oh=00_AfDhSGG80BTHq6zB9yFH-_x69J_tUzzc1f2E2IvCp2sGsA&oe=63EDB524"/></td>
                  </tr>
                  <tr>
                      <td>42Email Certification</td>
                  </tr>
                  <tr>
                      <td>CODE : <input
                      id="code"
                      name="code"
                      type="text"
                      placeholder=""
                      onChange={event => setCode(event.target.value)}
                      value={code}
                      /></td>
                  </tr>
                  <tr>
                      <td><button onClick={handleSubmit}>Confirm</button></td>
                  </tr>
              </table>
              {/* </TableParent> */}
          </div>
        </header>
      </div>
  );
}
