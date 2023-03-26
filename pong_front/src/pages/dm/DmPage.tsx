import { useState, useContext, useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { SocketContext } from "../../common/states/contextSocket";
import { useNavigate, useLocation } from "react-router-dom";
import useGetData from "../../util/useGetData";
import { REACT_APP_HOST } from "../../common/configData";
import DmField from "../../components/chat/DmField";
import useCheckLogin from "../../util/useCheckLogin";
import ChatMenuModal from "../../components/chat/modal/ChatMenuModal";
import GameInviteModal from "../../components/chat/modal/GameInviteModal";
import { RoutePath } from "../../common/configData";
import { gameInviteModalState } from "../../common/states/recoilModalState";

import { OutlinedInput, Button, Stack, Tooltip, Divider, CircularProgress } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi';
import { DefaultBox, DefaultButton } from "../../components/common";
import { chatInputStyle } from "../../components/chat/Chat.styles";

function DmPage() {
    useCheckLogin();
    const socket = useContext(SocketContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [current, setCurrent] = useState<string>("");     // 현재 유저의 id
    const [myInfo, error, isLoading] = useGetData('http://' + REACT_APP_HOST + '/api/user');
    const [msg, setMsg] = useState<string>("");
    const [invitedInfo, setInvitedInfo] = useState<{id: number, username: string}>({id: -1, username: ""});
    const setGameInviteModal = useSetRecoilState(gameInviteModalState);

    const targetId = location.state.targetId;

    useEffect(() => {
        /* 현재 유저의 userName */
        if (myInfo !== null) {
            setCurrent(myInfo.username as string);
        }
    }, [myInfo, error, isLoading]);

    useEffect(() => {
        /* 게임 초대 신청 듣기 */
        socket.on('duelAccept', (targetId: number, targetUsername: string) => {
            setInvitedInfo({id: targetId, username: targetUsername});
        })

        /* 게임 초대 취소 듣기 */
        socket.on('duelTargetRun', (targetUserName: string) => {
            setInvitedInfo({id: -1, username: ""});
        })
    }, []);

    function msgHandler(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        /* 빈 메시지는 보내지 않습니다. */
        if (msg !== "") {
            socket.emit('sendDm', {targetId: targetId, msg: msg});
            setMsg("");
        }
    }

    function exitHandler(e: React.MouseEvent<HTMLElement>) {
        socket.emit('closeDm', targetId);
        navigate(RoutePath.lobby);
    }

    return (
        <>
        <ChatMenuModal isMaster={false} roomName={"_dm"} isDmModal={true}/>
        <GameInviteModal targetID={invitedInfo.id} targetUserName={invitedInfo.username} setInviteInfo={setInvitedInfo}/>
        { current === "" ? <CircularProgress /> : 
        <DefaultBox>
            <Stack 
                spacing={1} 
                justifyContent="center"
                sx={{width: "800px"}}
            >
                <Stack
                    direction="row"
                    spacing={1}
                    justifyContent="center"
                >
                    <Tooltip title="채팅방을 나갑니다.">
                        <span ><DefaultButton
                            startIcon={<ExitToAppIcon />}
                            onClick={exitHandler}
                        >
                            채팅방 나가기
                        </DefaultButton></span>
                    </Tooltip>
                    <Tooltip title="도전장이 도작한 경우에만 활성화됩니다.">
                        <span><DefaultButton 
                            startIcon={<SportsKabaddiIcon />}
                            onClick={(e) => {setGameInviteModal(true)}}
                            disabled={invitedInfo.id === -1}
                        >
                            도전장 확인
                        </DefaultButton></span>
                    </Tooltip>
                </Stack>
                <Divider variant="middle" sx={{borderColor: "#06283D"}} />
                <DmField current={current} targetId={targetId}/>
                <form onSubmit={msgHandler} style={chatInputStyle}>
                    <OutlinedInput id="message" fullWidth size="small" value={msg} onChange={(e) => setMsg(e.target.value)}/>
                    <Button type="submit" variant="text" ><SendIcon/></Button>
                </form>
            </Stack>
        </DefaultBox> }
        </>
    )
}

export default DmPage;