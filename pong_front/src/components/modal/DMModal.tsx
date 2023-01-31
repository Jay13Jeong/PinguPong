import React from "react";
import { useRecoilState } from "recoil";
import { dmModalState } from "../../states/recoilModalState";
import ModalBase from "./ModalBase";

function DMModal() {
    const [showModal, setShowModal] = useRecoilState(dmModalState);
    if (showModal) {
        return (
            <ModalBase setter={setShowModal}>
                <h1>DM Modal</h1>
            </ModalBase>
        )
    }
    return null;
}

export default DMModal;