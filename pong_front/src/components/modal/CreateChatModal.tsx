import React, {useState, useContext} from "react";
import { SocketContext } from "../../states/contextSocket";
import useUser from "../../util/useUser";
import { useRecoilState } from "recoil";
import { Button } from "../../styles/Inputs";
import { createChatModalState } from "../../states/recoilModalState";
import ModalBase from "./ModalBase";

function CreateChatModal() {
    const [showModal, setShowModal] = useRecoilState(createChatModalState);
    const [values, setValues] = useState({ 
        room: "",
        pw: "",
    })
    const myInfo = useUser();
    const socket = useContext(SocketContext);

    function handler(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        // alert(`${values.room} | ${values.pw}`);
        socket.emit('/api/post/newRoom', values.room, myInfo.userName, values.pw);
        socket.on('/api/post/newRoom', (data: boolean) => {
            if (data) {
                alert ("채팅방 생성 완료!");
                setShowModal(false);
            }
            else {
                alert("중복된 이름이 있습니다.");
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
                <div>
                    <div>새 채팅방 생성</div>
                        <form onSubmit={handler}>
                            <span>채팅방 이름</span>
                            <input type="text" 
                                onChange={(e) => setValues({...values, room: e.target.value})} 
                                placeholder="채팅방 이름" 
                                value={values.room}/>
                            <span>비밀번호</span>
                            <input type="text" 
                                onChange={(e) => setValues({...values, pw: e.target.value})} 
                                placeholder="빈 칸인 경우 공개 채팅방이 됩니다." 
                                value={values.pw}/>
                            <Button type="submit">채팅방 생성</Button>
                        </form>
                    </div>
            </ModalBase>
        )
    }
    return null;
}

export default CreateChatModal;