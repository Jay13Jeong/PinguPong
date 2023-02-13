import { useMemo } from "react";
import useCheckLogin from "../util/useCheckLogin";
function NotFound() {
    useCheckLogin();
    const fontStyle = useMemo(() => ({color: "white" }), []);
    return (
        <h1 style={fontStyle}>🤡 Not Found 🤡</h1>
    );
}

export default NotFound;