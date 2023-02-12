import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import * as Modal from "./Modal.style";
import { Resetter } from "recoil";

function ModalBase (props: {reset:Resetter, children: React.ReactNode, z_index?: number}) {
  return (
    <Modal.OverLay z_index={props.z_index ? props.z_index : undefined}>
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