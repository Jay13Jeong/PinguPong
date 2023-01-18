import { useState } from 'react';
// import { useEffect } from 'react';
import '../../App.css';
import { Link } from "react-router-dom";
import { createGlobalStyle }  from "styled-components";

const TableParent = createGlobalStyle`
  .roomName {
    width: 30%;
  }

  td  {
    border:1px solid black;
    margin-left:auto;
    margin-right:auto;
  }
`;


export default function SelectPrivateChat() {
    const [roomName, setRoomName] = useState("libft 42번 통과한 지식 공유합니다."); //유저 이름.
    
    // useEffect(() => {
    // }, []);
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <TableParent />
          ENTER PRIVATE ROOM MODAL<hr/>
            <table>
                <tr>
                    <td className='roomName'>Room Name</td>
                    <td colSpan={3}>{roomName}</td>
                </tr>
                <tr>
                  <td>Room PWD</td>
                    <td colSpan={3}><input type="text" /></td>
                </tr>
                <tr>
                    <td colSpan={2}></td>
                    <td><button>CONFIRM</button></td>
                    <td><button>CANCEL</button></td>
                </tr>
            </table>
            {/* </TableParent> */}
        </div>
      </header>
    </div>
  );
}
