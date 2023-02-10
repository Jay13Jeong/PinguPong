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
    height: 720px;
    width: 1300px;
  }
  .chatInputBar {
    height: 80px;
    width: 1300px;
  }

  .otherChatMsg {
    text-align: right;
    position: static;
    // bottom: 0px;
    right:0px;
  }

  .myChatMsg {
    text-align: left;
    position: static;
    bottom: 0px;
    left:0px;
  }

  .chatMsgBody {
    position:relative;
    height:100%
  }
`;


export default function ChatRoom() {
    const [me, setMe] = useState("jjeong"); //나 자신.
    const [chat, setChat] = useState([["cheolee","나다 철리"],["jjeong","안녕하세요 철리님!"],["jeyoon","안녕하세요!"]]); //서버에서 가져온 채팅 데이터.
    // useEffect(() => {
    // }, []);
  return (
    // <div className="App">
    //   <header className="App-header">
    //     <div>
    //       <TableParent />
    //         <table className='chatLobby'>
    //           <tr>
    //             <td rowSpan={3} className='emptySpace'></td>
    //             <td rowSpan={5} className='chatBackground'>
    //               <div className='chatMsgBody'>
    //               {chat.map((item) => {
    //                 if (item[0] === me){
    //                   return <div className='otherChatMsg'>{item[1]} {"<"}{item[0]}</div>
    //                 }else{
    //                   return <div className='myChatMsg'>{item[0]}{">"} {item[1]} </div>
    //                 }
    //               })}
    //               </div>
    //             </td>                
    //           </tr>
    //           <tr></tr><tr></tr>
    //           <tr>
    //             <td className='optionBtn'>도전장 도착</td>
    //           </tr>
    //           <tr>
    //             <td className='optionBtn'>비번 변경</td>
    //           </tr>
    //           <tr>
    //             <td className='optionBtn'>EXIT</td>
    //             <td className='chatInputBar'><input type="text" placeholder='enter your msg'/><button>SEND</button></td>
    //           </tr>
    //         </table>
    //     </div>
    //   </header>
    // </div>
    <></>
  );
}
