import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import * as Modal from "../../styles/Modal";
import { SetterOrUpdater, Resetter } from "recoil";

function ModalBase (props: {reset:Resetter, children: React.ReactNode}) {
  return (
    <Modal.OverLay>
      <Modal.Wrapper>
        <button className="close-button" onClick={() => props.reset()}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
        {props.children}
      </Modal.Wrapper>
    </Modal.OverLay>
  );
}

export default ModalBase;