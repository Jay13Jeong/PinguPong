import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import * as Modal from "../../styles/Modal";

function ModalBase (props: {setter: Function, children: React.ReactNode}) {
  return (
    <Modal.OverLay>
      <Modal.Wrapper>
        <button className="close-button" onClick={() => props.setter(false)}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
        {props.children}
      </Modal.Wrapper>
    </Modal.OverLay>
  );
}

export default ModalBase;