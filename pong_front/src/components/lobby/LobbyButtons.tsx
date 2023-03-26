import { useNavigate } from "react-router-dom";
import { RoutePath } from "../../common/configData";

import { Stack, Box } from "@mui/material";
import { LobbyButton } from "./LobbyButtons.style";

export default function LobbyButtons() {
    const navigate = useNavigate();

    return (
        <Stack>
            <LobbyButton onClick={()=>{navigate(RoutePath.game)}}>
                <Box sx={{minWidth: '100%', border: '1px dashed #141616'}}>
                    Game
                </Box>
            </LobbyButton>
            <LobbyButton onClick={()=>{navigate(RoutePath.chat)}}>
                <Box sx={{minWidth: '100%', border: '1px dashed #141616'}}>
                    Chat
                </Box>
            </LobbyButton>
        </Stack>
    );
}
