import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { SocketContext } from "../common/states/contextSocket";
import {MenuButtons, LobbyButtons, LobbyModal} from "../components/lobby/"
import { REACT_APP_HOST, RoutePath } from "../common/configData";

import { Typography, Stack, Divider } from "@mui/material";
import { DefaultBox } from "../components/common";

export default function LobbyPage() {
  const socket = useContext(SocketContext);
  const navigate = useNavigate();
  useEffect(() => {
      socket.emit('setInLobby');
      axios.get('http://' + REACT_APP_HOST + '/api/user/init/status', {withCredentials: true})
      .then(res => {
          if (res.data && res.data.msg === false){
            navigate(RoutePath.profile)
            return ;
          }
          axios.get('http://' + REACT_APP_HOST + '/api/user', {withCredentials: true}) //쿠키와 함께 보내기 true.
          .catch(err => {
              navigate(RoutePath.root); //로그인 안되어 있다면 로그인페이지로 돌아간다.
          })
      })
      .catch(err => {
          // props.setter(false);
          navigate(RoutePath.root); //로그인 안되어 있다면 로그인페이지로 돌아간다.
      })
  }, []);
  
  return (
    <DefaultBox>
      <>
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        spacing={2}
        alignItems="center"
      >
        <Stack>
          <Typography align="center" variant="h2" component="h1" gutterBottom>Lobby</Typography>
          <MenuButtons/>
        </Stack>
        <LobbyButtons/>
      </Stack>
      <LobbyModal />
      </>
    </DefaultBox>
  );
}
