import React, {useState, useContext, useEffect} from "react";
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../../../common/states/contextSocket";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { createChatModalState } from "../../../common/states/recoilModalState";
import ModalBase from "../../modal/ModalBase";
import { Stack, Typography, TextField, CircularProgress } from "@mui/material";
import { DefaultButton } from "../../common";

function CreateChatModal(props: {current: string}) {
    const showModal = useRecoilValue(createChatModalState);
    const resetState = useResetRecoilState(createChatModalState);
    const [values, setValues] = useState({ 
        room: "",
        pw: "",
    })
    const socket = useContext(SocketContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (props.current !== "") {
            setLoading(false);
        }
        else
            setLoading(true);
    }, [props]);

    function handler(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (values.room === "") {
            toast.error("방 이름을 입력하세요.");
            return ;
        }
        socket.emit('chatPostNewRoom', values.room, values.pw);
        socket.on('chatPostNewRoom', (data: boolean) => {
            if (data) {
                toast.success("채팅방 생성에 성공했습니다.");
                resetState();
                socket.off('chatPostNewRoom');
                navigate(`/chat/room/${values.room}`, {state: {
                    isMaster: true
                }});
            }
            else {
                toast.error("적절하지 않은 방 이름입니다.");
                socket.off('chatPostNewRoom');
            }
        })
        setValues({
            room: "",
            pw: "",
        });
    }

    return (
        <ModalBase open={showModal} reset={resetState} closeButton>
            <Stack 
                justifyContent="center"
                alignItems="center"
            >
                <Typography variant="h3" gutterBottom sx={{marginLeft: "3rem", marginRight: "3rem"}}>새 채팅방 생성</Typography>
                { loading ? <CircularProgress/> :
                    <form style={{width: "100%"}} onSubmit={handler}>
                        <Stack spacing={1} >
                            <TextField fullWidth size="small"
                                label="채팅방 이름"
                                onChange={(e) => setValues({...values, room: e.target.value})}
                                value={values.room}
                                helperText={"영문만 입력 가능합니다."}
                                variant="standard"
                            />
                            <TextField fullWidth size="small"
                                label="비밀번호"
                                onChange={(e) => setValues({...values, pw: e.target.value})}
                                value={values.pw}
                                helperText={"빈 칸인 경우 공개 채팅방이 됩니다."}
                                variant="standard"
                                autoComplete="off"
                            />
                            <DefaultButton type="submit">채팅방 생성</DefaultButton>
                        </Stack>
                    </form>
                }
            </Stack>
        </ModalBase>
    )
}

export default CreateChatModal;