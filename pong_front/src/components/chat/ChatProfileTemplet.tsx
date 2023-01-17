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
                    <td className="img-wrapper"><img src="https://scontent-ssn1-1.xx.fbcdn.net/v/t1.18169-9/10431485_666745710089728_670308968098148269_n.jpg?stp=cp0_dst-jpg_e15_fr_q65&_nc_cat=100&ccb=1-7&_nc_sid=110474&_nc_ohc=90mkqitwfMAAX9sFbrj&_nc_ht=scontent-ssn1-1.xx&oh=00_AfDhSGG80BTHq6zB9yFH-_x69J_tUzzc1f2E2IvCp2sGsA&oe=63EDB524"/></td>
                </tr>
                <tr>
                    <td>42Email Certification</td>
                </tr>
                <tr>
                    <td>CODE : <input type="text" /></td>
                </tr>
                <tr>
                    <td><button>Confirm</button></td>
                </tr>
            </table>
            {/* </TableParent> */}
        </div>
      </header>
    </div>
  );
}
