import { useContext } from "react";
import { useSetRecoilState } from "recoil";
import * as states from "../../common/states/recoilModalState";
import { SocketContext } from "../../common/states/contextSocket";
import { useNavigate } from "react-router-dom";
import { REACT_APP_HOST } from "../../common/configData";
import axios from "axios";

import { Stack, IconButton, Tooltip } from "@mui/material";
import EmailIcon from '@mui/icons-material/Email';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GroupIcon from '@mui/icons-material/Group';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import LogoutIcon from '@mui/icons-material/Logout';

export default function MenuButtons() {
    const socket = useContext(SocketContext);
    const dmState = useSetRecoilState(states.dmModalState);
    const profileState = useSetRecoilState(states.profileModalState);
    const friendState = useSetRecoilState(states.friendModalState);
    const pendingState = useSetRecoilState(states.pendingModalState);
    const blockState = useSetRecoilState(states.blockModalState);
    const navigate = useNavigate();

    const showDmModal = (e: React.MouseEvent<HTMLElement>) => dmState(true);

    const showProfileModal = () => profileState({userId: 0, show: true});

    const showFriendModal = () => friendState(true);

    const showPendingModal = () => pendingState(true);

    const showBlockModal = () => blockState(true);

    const logout = () => {
        axios.get('http://' + REACT_APP_HOST + '/api/auth/logout', {withCredentials: true}) //쿠키와 함께 보내기 true.
        .then(res => {
            if (res.data && res.data.msg === 'logout ok'){
                alert('sign out');
                navigate('/');
            }
        })
        .catch(err => {

        })
        .finally( () => {
          socket.disconnect();
        })
    };

    const MenuButtonList = [
        {
            icon: <EmailIcon />,
            tooltip: "DM",
            onClick: showDmModal,
        },
        {
            icon: <AccountCircleIcon />,
            tooltip: "Profile",
            onClick: showProfileModal,
        },
        {
            icon: <GroupIcon />,
            tooltip: "Friend",
            onClick: showFriendModal,
        },
        {
            icon: <GroupAddIcon />,
            tooltip: "Pending",
            onClick: showPendingModal,
        },
        {
            icon: <PersonOffIcon />,
            tooltip: "Block",
            onClick: showBlockModal,
        },
        {
            icon: <LogoutIcon />,
            tooltip: "Logout",
            onClick: logout,
        },
    ];

    return (
        <Stack direction="row" spacing={2}>
            {MenuButtonList.map((item) => {
                return (
                    <Tooltip title={item.tooltip} key={item.tooltip}>
                        <IconButton onClick={item.onClick}>
                            {item.icon}
                        </IconButton>
                    </Tooltip>
                );
            })}
        </Stack>
    );
}