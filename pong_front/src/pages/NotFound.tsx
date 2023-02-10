import { useMemo } from "react";
import BackGroundPingu from "../components/util/BackGroundPingu";
import { Center } from "../styles/Layout";
function NotFound() {
    const fontStyle = useMemo(() => ({color: "white" }), []);
    return (
        <Center>
            <BackGroundPingu/>
            <h1 style={fontStyle}>🤡 Not Found 🤡</h1>
        </Center>
    );
}

export default NotFound;