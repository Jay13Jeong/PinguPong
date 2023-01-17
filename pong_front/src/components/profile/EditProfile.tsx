import { useState } from 'react';
// import { useEffect } from 'react';
import '../../App.css';
import { Link } from "react-router-dom";
import { createGlobalStyle }  from "styled-components";

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
      height: 500px;
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


export default function EditProfile() {
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
            <table>
                <tr>
                    <td colSpan={2} className="img-wrapper"><img src="https://cdn.myanimelist.net/images/characters/11/421848.jpg"/></td>
                </tr>
                <tr>
                    <td colSpan={2}><button>Edit Image</button></td>
                </tr>
                <tr>
                    <td className='halfDiv'><button>Edit Name</button></td>
                    <td className='halfDiv'>Info : <button>Private/Public</button></td>
                </tr>
                <tr>
                    <td colSpan={2}><button>Activate 2FA</button></td>
                </tr>
            </table>
            {/* </TableParent> */}
        </div>
      </header>
    </div>
  );
}
