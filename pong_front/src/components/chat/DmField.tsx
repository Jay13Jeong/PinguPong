import { useState, useEffect, useContext, useRef } from "react";
import { useSetRecoilState } from "recoil";
import { chatMenuModalState } from "../../states/recoilModalState";
import { SocketContext } from "../../states/contextSocket";
import * as Chat from './ChatField.styles';

function DmField (props: {current: string, targetId: number}) {
    const socket = useContext(SocketContext);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [chat, setChat] = useState<{userName: string, msg: string}>({userName: "", msg: ""});
    const [chatList, setChatList] = useState<{userName: string, msg: string}[]>([]);
    const setShowModal = useSetRecoilState(chatMenuModalState);

    useEffect(() => {
        if (!chatContainerRef.current) return;
    
        const chatContainer = chatContainerRef.current;
        const { scrollHeight, clientHeight } = chatContainer;
    
        if (scrollHeight > clientHeight) {
          chatContainer.scrollTop = scrollHeight - clientHeight;
        }
      }, [chatList.length]);

    useEffect(() => {
        socket.emit('connectDm', props.targetId);
        socket.on('receiveDms', (data: {userName: string, msg: string}[]) => {
            // console.log("receiveDms : ", data);
            setChatList([...data]);
        })
        socket.on('receiveDm', (user: string, msg: string) => {
            // console.log("receiveDm : user : ", user, "msg : ", msg);
            setChat({userName: user, msg: msg});
        })
        return (() => {
            socket.off('receiveDms');
            socket.off('receiveDm');
        })
    }, [socket]);

    useEffect(() => {
        if (chat && chat.msg !== "") {
            chat && setChatList((prev) => [...prev, chat]);
        }
    }, [chat]);

    function showMenuHander(userName: string) {
        setShowModal({user: userName, show: true});
    }

    return (
        <Chat.ChatFieldContainer id={"chat-field"} ref={chatContainerRef}>
            { chatList.map((chat, index) => (
                <Chat.MessageBox key={index} className={chat.userName === props.current ? "my_message" : "other"}>
                    <span onClick={chat.userName === props.current ? undefined : (e) => {showMenuHander(chat.userName)}}>
                        {chat.userName === props.current ? '' : chat.userName}
                    </span>
                    <Chat.Message className="message">{chat.msg}</Chat.Message>
                </Chat.MessageBox>
            )) }
        </Chat.ChatFieldContainer>
    );

}

export default DmField;