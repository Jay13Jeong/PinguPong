import React from "react";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import { dmModalState } from "../../states/recoilModalState";
import ModalBase from "./ModalBase";

function DMModal() {
    // const [showModal, setShowModal] = useRecoilState(dmModalState);
    const showModal = useRecoilValue(dmModalState);
    const resetState = useResetRecoilState(dmModalState);
    if (showModal) {
        return (
            <ModalBase reset={resetState}>
                <h1>DM Modal</h1>
            </ModalBase>
        )
    }
    return null;
}

export default DMModal;