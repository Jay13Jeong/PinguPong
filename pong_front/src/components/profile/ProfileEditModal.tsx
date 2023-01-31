import React from "react";
import ModalBase from "./ModalBase";
import { useRecoilState } from "recoil";
import { profileEditModalState } from "../../states/recoilModalState";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {  } from "@fortawesome/free-solid-svg-icons";

function ProfileEditModal() {
    const [showModal, setShowModal] = useRecoilState(profileEditModalState);

    if (showModal) {
        return (
            <ModalBase setter={setShowModal}>
                <h1>Profile Edit Modal</h1>
                {/* <div className="profile-edit-wrapper">
                    <div className="profile-edit-box">
                            <img className="profile-edit-image" src="https://cdn.myanimelist.net/images/characters/11/421848.jpg" alt="{userInfo.userName}-profile" />
                    </div>
                </div> */}
            </ModalBase>
        )
    }
    return null;
}

export default ProfileEditModal;