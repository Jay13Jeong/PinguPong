import React from "react";
import { BarLoader } from "react-spinners";

function LoadingBar(props: any) {
  return (
    <div className="loading-bar">
        {props.text ? <div>{props.text}</div> : null}
        <BarLoader color="teal" />
    </div>
  );
}

export default LoadingBar;