import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faCircleUser, faPeopleGroup, faUserAltSlash, faUserSlash, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { SetterOrUpdater, useSetRecoilState } from "recoil";
import * as modalState from "../states/recoilModalState"
import logo from "../assets/logo.png";
import "./TopMenuBar.scss";
import { User } from "./profile/User";
import axios from "axios";

function TopMenuBar(props: {setter: SetterOrUpdater<any>}) {
  
  const dmState = useSetRecoilState(modalState.dmModalState);
  const profileState = useSetRecoilState(modalState.profileModalState);
  const friendState = useSetRecoilState(modalState.friendModalState);
  const blockState = useSetRecoilState(modalState.blockModalState);

  const showDmModal = () => {
    dmState(true);
  }

  const showProfileModal = () => {
    profileState({userId: 0, show: true}); // TODO : 현재 로그인된 user의 id로 userId 바꾸어 줄 것
  }

  const showFriendModal = () => {
    friendState(true);
  }

  const showBlockModal = () => {
    blockState(true);
  }
  const navigate = useNavigate();
  const logout = () => {
      axios.get('http://localhost:3000/api/auth/logout', {withCredentials: true}) //쿠키와 함께 보내기 true.
      .then(res => {
          // console.log(res.data);
          if (res.data && res.data.msg === 'logout ok'){
              props.setter(false);
              alert('sign out');
              navigate('/');
          }
      })
      .catch(err => {
        // alert('sign out fail'); //로그인 안되어 있다면 로그인페이지로 돌아간다.
      })
  }

  return (
    <>
    <div className="navi-bar">
      <button onClick={showDmModal} className="navi-left-button">
        <FontAwesomeIcon icon={faEnvelope}/>
      </button>
      <Link to="/lobby" style={{ textDecoration: "none" }}>
      <span className="navi-title">
          <img src={logo} alt="logo" />
          <span>Pingu Pong</span>
      </span>
      </Link>
      <div className="navi-right-button">
        <button onClick={logout} >
          <FontAwesomeIcon icon={faSignOutAlt}/>
        </button>
        <button onClick={showBlockModal} >
          <FontAwesomeIcon icon={faUserSlash}/>
        </button>
        <button onClick={showFriendModal} >
          <FontAwesomeIcon icon={faPeopleGroup}/>
        </button>
        <button onClick={showProfileModal}>
          <FontAwesomeIcon icon={faCircleUser}/>
        </button>
      </div>
    </div>
    </>
  );
}

export default TopMenuBar;