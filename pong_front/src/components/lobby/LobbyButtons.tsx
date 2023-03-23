import { Link } from "react-router-dom";
import * as S from "./LobbyButtons.style"
import { RoutePath } from "../../common/configData";

import { Stack, Box } from "@mui/material";
import { LobbyButton } from "./LobbyButtons.style";

export default function LobbyButtons() {
    return (
        <Stack>
            <LobbyButton>
                <Box sx={{minWidth: '100%', border: '1px dashed #141616'}}>
                    <Link to={RoutePath.game}>Game</Link>
                </Box>
            </LobbyButton>
            <LobbyButton>
                <Box sx={{minWidth: '100%', border: '1px dashed #141616'}}>
                    <Link to={RoutePath.chat}>Chat</Link>
                </Box>
            </LobbyButton>
        </Stack>
    );
}
