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
    border:1px solid black;
    margin-left:auto;
    margin-right:auto;
  }

  .halfDiv {
    width: 50%;
  }
`;

//방장위임, 벙어리, 도전장 보내기, 차단 가능.
export default function ChatManage() {
    const [userName, setUsername] = useState("pinga"); //유저 이름.

    // useEffect(() => {
    // }, []);

  return (
    // <div className="App">
    //   <header className="App-header">
    //     <div>
    //       <TableParent />
    //       CHAT MANAGE MODAL<hr/>
    //         <table>
    //             <tr>
    //                 <td colSpan={2}>{userName}</td>
    //             </tr>
    //             <tr>
    //               {/* 이 기능은 모달 하나에 통합 예정 */}
    //                 <td colSpan={2}>프로필화면 바로가기</td>
    //             </tr>
    //             <tr>
    //                 <td className='.halfDiv'><button>도전장 보내기</button></td>
    //                 <td className='.halfDiv'><button>차단</button></td>
    //             </tr>
    //             <tr>
    //                 <td className='.halfDiv'><button>방장 위임</button></td>
    //                 <td className='.halfDiv'><button>벙어리</button></td>
    //             </tr>
    //             <tr>
    //                 <td colSpan={2}><button>채팅방 강퇴</button></td>
    //             </tr>
    //             <tr>
    //                 <td colSpan={2}><button>닫기</button></td>
    //             </tr>
    //         </table>
    //         {/* </TableParent> */}
    //     </div>
    //   </header>
    // </div>
    <></>
  );
}
