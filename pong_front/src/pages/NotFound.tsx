import { Typography } from "@mui/material";
import useCheckLogin from "../util/useCheckLogin";
function NotFound() {
    useCheckLogin();
    return (
        <Typography variant="h1" color="#FFFFFF">🤡 Not Found 🤡</Typography>
    );
}

export default NotFound;