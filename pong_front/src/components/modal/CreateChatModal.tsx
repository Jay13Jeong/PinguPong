import React, {useState, useContext} from "react";
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../../states/contextSocket";
import useUser from "../../util/useUser";
import { useRecoilState } from "recoil";
import { Button } from "../../styles/Inputs";
import { createChatModalState } from "../../states/recoilModalState";
import ModalBase from "./ModalBase";
import { Stack } from "../../styles/Layout";
import "./Chat.scss"

function CreateChatModal() {
    const [showModal, setShowModal] = useRecoilState(createChatModalState);
    const [values, setValues] = useState({ 
        room: "",
        pw: "",
    })
    const myInfo = useUser();
    const socket = useContext(SocketContext);

    const navigate = useNavigate();

    function handler(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (values.room === "") {
            toast.error("방 이름을 입력하세요.");
            return ;
        }
        socket.emit('/api/post/newRoom', values.room, myInfo.userName, values.pw);
        socket.on('/api/post/newRoom', (data: boolean) => {
            if (data) {
                toast.success("채팅방 생성에 성공했습니다.");
                socket.emit('/api/get/RoomList');
                setShowModal(false);
                socket.off('/api/post/newRoom');
                navigate(`/chat/room/${values.room}`, {state: {
                    roomName: values.room,
                    isSecret: values.pw !== ""
                }});
            }
            else {
                toast.error("중복된 방 이름 입니다.");
                socket.off('/api/post/newRoom');
            }
        })
        setValues({
            room: "",
            pw: "",
        });
    }

    if (showModal) {
        return (
            <ModalBase setter={setShowModal}>
                <Stack className="chat-form-wrapper">
                    <div className="title">새 채팅방 만들기</div>
                        <form onSubmit={handler}>
                            <div className="wrapper">
                                <span>채팅방 이름</span>
                                <input type="text" 
                                    onChange={(e) => setValues({...values, room: e.target.value})} 
                                    placeholder="채팅방 이름" 
                                    value={values.room}/>
                            </div>
                            <div className="wrapper">
                                <span>비밀번호</span>
                                <input type="text" 
                                    onChange={(e) => setValues({...values, pw: e.target.value})} 
                                    placeholder="빈 칸인 경우 공개 채팅방이 됩니다." 
                                    value={values.pw}/>
                            </div>
                            <Button type="submit">채팅방 생성</Button>
                        </form>
                    </Stack>
            </ModalBase>
        )
    }
    return null;
}

export default CreateChatModal;