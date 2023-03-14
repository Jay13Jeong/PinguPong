import {useState, useEffect} from "react";

function Cursor() {
  const [calibratedCursorPosition, setCalibratedCursorPosition] = useState([
    0, 0,
  ]);

  useEffect(() => {
    const event = ({ clientX, clientY }: MouseEvent) => {
      const pos = [clientX, clientY];
      pos[0] -= 1;
      pos[1] -= 2;
      setCalibratedCursorPosition(pos);
    };
    window.addEventListener("mousemove", event);

    return () => window.removeEventListener("mousemove", event);
  }, []);
  
  return (
    <>
    <img
        className="cursorPingu"
        style={{
          pointerEvents: "none",
          position: "fixed",
          left: calibratedCursorPosition[0],
          top: calibratedCursorPosition[1],
          width: "50px",
        }}
        src={require("../../assets/cursorPingu.png")}
        alt="cursorImg"
      />
    </>
  );
}

export default Cursor;