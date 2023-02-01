import React from "react";
import { useRecoilState } from "recoil";
import { createChatModalState } from "../../states/recoilModalState";
import ModalBase from "./ModalBase";

function CreateChatModal() {
    const [showModal, setShowModal] = useRecoilState(createChatModalState);
    if (showModal) {
        return (
            <ModalBase setter={setShowModal}>
                <h1>Create Chat</h1>
            </ModalBase>
        )
    }
    return null;
}

export default CreateChatModal;