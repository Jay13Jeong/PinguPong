import React from "react";
import { PropagateLoader, BeatLoader } from "react-spinners";
import LoaderWrapper from "./Loader.style";

/**
 * https://www.davidhu.io/react-spinners/storybook/?path=/docs/barloader--main
 * props
 * - type : (기본값) Beat / Propagate
 * - text : 로딩 효과 위의 메시지 / 없을 경우 null
 */

function Loader(props: {text?: string, type?: string}) {
  // props로 
  return (
    <LoaderWrapper>
        {props.text ? <div className="msg">{props.text}</div> : null}
        {props.type === "Propagate" ? 
          <PropagateLoader cssOverride={{display: "block", margin: "auto", gridRow: '2'}} color="#36d7b7" /> 
          : <BeatLoader cssOverride={{display: "block", margin: "auto"}} color="#36d7b7" />}
    </LoaderWrapper>
  );
}

export default Loader;