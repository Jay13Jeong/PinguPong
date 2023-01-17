import { useState } from 'react';
// import { useEffect } from 'react';
import '../../App.css';
import { Link } from "react-router-dom";
import { createGlobalStyle }  from "styled-components";

const TableParent = createGlobalStyle`
  td  {
    border:1px solid black;
    margin-left:auto;
    margin-right:auto;
  }

  .emptySpace {
    height: 500px;
    width: 20%;
  }

  .optionBtn {
    height: 17%;
    width: 20%;
  }

  .chatBackground {
    height: 1000px;
    width: 1500px;
  }
`;


export default function Profile() {
    const [me, setMe] = useState("jjeong"); //나 자신.
    const [chat, setChat] = useState([["cheolee","나다 철리"],["jjeong","안녕하세요 철리님!"],["jeyoon","안녕하세요!"]]); //서버에서 가져온 채팅 데이터.
    // useEffect(() => {
    // }, []);
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <TableParent />
            <table className='chatLobby'>
              <tr>
                <td rowSpan={4} className='emptySpace'></td>
                <td rowSpan={6} className='chatBackground'>
                  {chat.map((item) => {
                    if (item[0] === me){
                      return <div>{item[1]} {"<<="} {item[0]}</div>
                    }else{
                      return <div>{item[0]} {"=>>"} {item[1]} </div>
                    }
                  })}
                </td>
              </tr>
              <tr></tr><tr></tr><tr></tr>
              <tr>
                    <td className='optionBtn'>Enter Chat</td>
              </tr>
              <tr>
                  <td className='optionBtn'>Create Chat</td>
              </tr>
            </table>
        </div>
      </header>
    </div>
  );
}
