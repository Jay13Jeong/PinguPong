import React, { useState, useContext, useEffect } from "react";
import { SocketContext } from "../../common/states/contextSocket"
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { changeChatPwModalState, gameInviteModalState } from "../../common/states/recoilModalState"
import ChangeChatPwModal from "../../components/chat/modal/ChangeChatPwModal";
import ChatField from "../../components/chat/ChatField";
import useGetData from "../../util/useGetData";
import ChatMenuModal from "../../components/chat/modal/ChatMenuModal";
import { REACT_APP_HOST } from "../../common/configData";
import { toast } from "react-toastify";
import useCheckLogin from "../../util/useCheckLogin";
import GameInviteModal from "../../components/chat/modal/GameInviteModal";
import {RoutePath} from "../../common/configData";

import { OutlinedInput, Button, Stack, Tooltip, Divider } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import KeyIcon from '@mui/icons-material/Key';
import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi';

import { DefaultBox, DefaultButton } from "../../components/common";
import { chatInputStyle } from "../../components/chat/Chat.styles";

function ChatRoomPage () {
    useCheckLogin();
    const setChangeChatPwModalState = useSetRecoilState(changeChatPwModalState);
    const setGameInviteModal = useSetRecoilState(gameInviteModalState);
    const socket = useContext(SocketContext);
    
    const [myInfo, error, isLoading] = useGetData('http://' + REACT_APP_HOST + '/api/user');
    const [msg, setMsg] = useState<string>("");
    const [current, setCurrent] = useState<string>("");     // 현재 유저의 id
    const [master, setMaster] = useState<boolean>(false);   // 현재 유저의 방장 여부
    const roomInfo = useParams() as { id: string };         // undefined 해결용 type assersion
    const [invitedInfo, setInvitedInfo] = useState<{id: number, username: string}>({id: -1, username: ""});
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        setMaster(location.state.isMaster);
    }, [location.state.isMaster]);

    useEffect(() => {
        if (current !== '') {
            /* 방장 여부 확인 */
            socket.emit('chatGetMasterStatus', roomInfo.id);
            socket.on('chatGetMasterStatus', (data: boolean) => {
                setMaster(data);   // 방장이면 true / 아니면 false
            });
            /* 추방 여부 듣기 */
            socket.on('youKick', ()=>{
                socket.off('youKick');
                toast("🔥 추방당했습니다!");
                navigate(RoutePath.lobby);
            });
            /* 방장 여부 듣기 */
            socket.on('youMaster', ()=> {
                setMaster(true);
            })
            /* 방장 권한 해제 여부 듣기 */
            socket.on('youExMaster', ()=> {
                setMaster(false);
            })

            /* 게임 초대 신청 듣기 */
            socket.on('duelAccept', (targetId: number, targetUsername: string) => {
                setInvitedInfo({id: targetId, username: targetUsername});
            })

            /* 게임 초대 취소 듣기 */
            socket.on('duelTargetRun', (targetUserName: string) => {
                setInvitedInfo({id: -1, username: ""});
            })
        }

        return () => {
            /* 이벤트 해제 */
            socket.off('chatGetUser');
            socket.off('chatGetMasterStatuss');
            socket.off('youKick');
            socket.off('duelAccept');
        };
    }, [socket, current, roomInfo.id, navigate]);

    useEffect(() => {
        /* 현재 유저의 userName */
        if (myInfo !== null) {
            setCurrent(myInfo.username as string);
        }
    }, [myInfo, error, isLoading]);

    function exitHandler(e: React.MouseEvent<HTMLElement>) {
        // data : string (roomName);
        socket.emit('chatDelUser', roomInfo.id);
        navigate(RoutePath.lobby);
    }

    function msgHandler(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        /* 빈 메시지는 보내지 않습니다. */
        if (msg !== "") {
            socket.emit('chat', roomInfo.id, msg);
            setMsg("");
        }
    }


    return (
        <>
        <ChangeChatPwModal roomName={roomInfo.id}/>
        <ChatMenuModal isMaster={master} roomName={roomInfo.id} setMaster={setMaster} isDmModal={false}/>
        <GameInviteModal targetID={invitedInfo.id} targetUserName={invitedInfo.username} setInviteInfo={setInvitedInfo}/>
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
                    <Tooltip title="방장일 경우에만 활성화됩니다.">
                        <span><DefaultButton 
                            startIcon={<KeyIcon />}
                            onClick={(e) => {setChangeChatPwModalState({roomName: roomInfo.id, show: true})}}
                            disabled={!master}
                        >
                            비밀번호 설정
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
                <ChatField roomName={roomInfo.id} current={current}/>
                <form onSubmit={msgHandler} style={chatInputStyle}>
                    <OutlinedInput id="message" fullWidth size="small" value={msg} onChange={(e) => setMsg(e.target.value)}/>
                    <Button type="submit" variant="text" ><SendIcon/></Button>
                </form>
            </Stack>
        </DefaultBox>
        </>
    )
}

export default ChatRoomPage;