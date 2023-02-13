import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { SocketContext } from "../common/states/contextSocket";
import { ContentBox } from "../common/styles/ContentBox.style";
import {MenuButtons, LobbyButtons, LobbyModal} from "../components/lobby/"
import { REACT_APP_HOST, RoutePath } from "../common/configData";

export default function LobbyPage() {
  const socket = useContext(SocketContext);
  const navigate = useNavigate();
  useEffect(() => {
      socket.emit('setInLobby');
      axios.get('http://' + REACT_APP_HOST + ':3000/api/user/init/status', {withCredentials: true})
      .then(res => {
          if (res.data && res.data.msg === false){
            navigate(RoutePath.profile)
            return ;
          }
          axios.get('http://' + REACT_APP_HOST + ':3000/api/user', {withCredentials: true}) //쿠키와 함께 보내기 true.
          .then(res => {
              // if (res.data && res.data.id)
              //     props.setter(true);
          })
          .catch(err => {
              // props.setter(false);
              navigate(RoutePath.root); //로그인 안되어 있다면 로그인페이지로 돌아간다.
          })
      })
      .catch(err => {
          // props.setter(false);
          navigate(RoutePath.root); //로그인 안되어 있다면 로그인페이지로 돌아간다.
      })
  }, []);
  
  return (
    <ContentBox>
      <MenuButtons/>
      <LobbyButtons/>
      <LobbyModal />
    </ContentBox>
  );
}
