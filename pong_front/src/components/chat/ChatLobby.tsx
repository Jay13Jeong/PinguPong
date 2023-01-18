import { useState } from 'react';
// import { useEffect } from 'react';
import '../../App.css';
import {useNavigate, Link} from 'react-router-dom'
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
    height: 800px;
    width: 1300px;
    text-align: left
  }
`;


export default function Profile() {
    const [me, setMe] = useState("jjeong"); //나 자신.
    //room : 방 식별 id, 방 제목, 방장 이름 
    const [room, setRoom] = useState([["1","LIBFT 42번 평가받은 지식 공유합니다.", "cheolee"],["2","ft_container 뽀개기!","jeyoon"],["3", "webserv물어보세요~","jjeong"]]);
    
    const [selectedRoom, setSelectedRoom] = useState("0"); //선택한 방 번호.

    // useEffect(() => {
    // }, []);

    const navigate = useNavigate();

    const enterRoom = () => {
        navigate(`/chat/room/1`);
    }

    function buttonClicked(handler: Function, e: any) {
      handler();
    }

  return (
    <div className="App">
        <header className="App-header">
        <div>
          <h3>Chat Lobby</h3>
          <TableParent />
            <table className='chatLobby'>
              <tr>
                <td rowSpan={4} className='emptySpace'>**방 선택하면 <br/>아래 입장 버튼 활성화 됩니다.</td>
                <td rowSpan={6} className='chatBackground'>
                  {room.map((item) =>
                    // <div onClick={(e) => buttonClicked(enterRoom, e)} >{item[0]} {" | "} {item[1]} {" | "} {item[2]}</div>
                    <div onClick={(e) => setSelectedRoom(item[0]) }>{item[0]} {" | "} {item[1]} {" | "} {item[2]}</div>
                  )}
                </td>
              </tr>
              <tr></tr><tr></tr><tr></tr>
              <tr>
                    <td className='optionBtn'>
                      {
                        selectedRoom === '0'?
                        <div> {"Enter Chat"} </div>
                        : <Link to={`/chat/room/${selectedRoom}`}>Enter Chat</Link>
                      }
                    </td>
              </tr>
              <tr>
                    {/* 방 생성 모달 띄워야함. */}
                  <td className='optionBtn'>Create Chat</td>
              </tr>
            </table>
        </div>
       </header>
    </div>
  );
}
