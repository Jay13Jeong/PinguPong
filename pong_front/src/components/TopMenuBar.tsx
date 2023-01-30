import React, {useState} from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faUser } from "@fortawesome/free-solid-svg-icons";
import DMModal from "./profile/DMModal";
import ProfileModal from "./profile/ProfileModal";
import logo from "./logo.png";
import "./TopMenuBar.scss";

function TopMenuBar() {
  const [dmModalOpen, setDmModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const showDmModal = () => {
    setProfileModalOpen(false);
    setDmModalOpen(true);
  }

  const showProfileModal = () => {
    setDmModalOpen(false);
    setProfileModalOpen(true);
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
      
      <button onClick={showProfileModal} className="navi-right-button">
        <FontAwesomeIcon icon={faUser}/>
      </button>
    </div>
    {dmModalOpen && <DMModal setter={setDmModalOpen}/>}
    {profileModalOpen && <ProfileModal setter={setProfileModalOpen}/>}
    </>
  );
}

export default TopMenuBar;