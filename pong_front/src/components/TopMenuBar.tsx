import React, {useState} from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faCircleUser, faPeopleGroup } from "@fortawesome/free-solid-svg-icons";
import { useSetRecoilState } from "recoil";
import * as modalState from "../states/recoilModalState"
import logo from "../assets/logo.png";
import "./TopMenuBar.scss";

function TopMenuBar() {
  
  const dmState = useSetRecoilState(modalState.dmModalState);
  const profileState = useSetRecoilState(modalState.profileModalState);
  const friendState = useSetRecoilState(modalState.friendModalState);

  const showDmModal = () => {
    dmState(true);
  }

  const showProfileModal = () => {
    profileState({userId: 0, show: true}); // TODO : 현재 로그인된 user의 id로 userId 바꾸어 줄 것
  }

  const showFriendModal = () => {
    friendState(true);
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