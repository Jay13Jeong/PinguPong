import React from "react";
import ModalBase from "./ModalBase";

function DMModal(props: {setter: Function}) {
    return (
        <ModalBase setter={props.setter}>
            <h1>DM Modal</h1>
        </ModalBase>
    )
}

export default DMModal;