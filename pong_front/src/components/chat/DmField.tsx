import { useState, useEffect, useContext, useRef } from "react";
import { SocketContext } from "../../common/states/contextSocket";
import * as C from './Chat.styles'
import Message from "./Message";

function DmField (props: {current: string, targetId: number}) {
    const socket = useContext(SocketContext);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [chat, setChat] = useState<{userName: string, msg: string}>({userName: "", msg: ""});
    const [chatList, setChatList] = useState<{userName: string, msg: string}[]>([]);

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
            setChatList([...data]);
        })
        socket.on('receiveDm', (user: string, msg: string) => {
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

    return (
        <div className={C.chatFieldStyle} ref={chatContainerRef}>
            <ul style={{width: "100%", listStyle: "none", paddingLeft: 0}}>
                { chatList.map((chat, index) => (
                    <Message key={index} my_msg={chat.userName === props.current} name={chat.userName} msg={chat.msg} />
                )) }
            </ul>
        </div>
    )

}

export default DmField;