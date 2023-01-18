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

`;


export default function CreateChat() {
    const [userName, setUsername] = useState("pinga"); //유저 이름.
    const [userStatus, setUserStatus] = useState("off"); //접속상태.
    const [rank, setRank] = useState(0); //랭크.
    const [odds, setOdds] = useState(0); //승률.
    const [record, setRecord] = useState([["cheolee",10,"jjeong",2],["cheolee",10,"jjeong",1],["jeyoon",10,"jjeong",5]]); //전적.
    // useEffect(() => {
    // }, []);
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <TableParent />
          CREATE CHAT ROOM MODAL<hr/>
            <table>
                <tr>
                    <td className='roomName'>Room Name</td>
                    <td className='roomNameInput' colSpan={3}><input type="text" /></td>
                </tr>
                <tr>
                  <td>Room PWD</td>
                    <td colSpan={3}><input type="text" /></td>
                </tr>
                <tr>
                    <td colSpan={2}></td>
                    <td><button>CREATE</button></td>
                    <td><button>CANCEL</button></td>
                </tr>
            </table>
            {/* </TableParent> */}
        </div>
      </header>
    </div>
  );
}
