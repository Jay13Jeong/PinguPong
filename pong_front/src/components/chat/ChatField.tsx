import { useState, useContext, useEffect, useRef } from 'react';
import * as Chat from './ChatField.styles';
import { SocketContext } from "../../common/states/contextSocket"
import { useSetRecoilState } from 'recoil';
import { chatMenuModalState } from '../../common/states/recoilModalState';

import * as C from './Chat.styles'

import { Box, Typography, Container } from '@mui/material';
import Message from './Message';

function ChatField (props: {roomName: string, current: string}) {
    const socket = useContext(SocketContext);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [chat, setChat] = useState<{user: string, msg: string}>({user: "", msg: ""});
    const [chatList, setChatList] = useState<{user: string, msg: string}[]>([]);
    const setShowModal = useSetRecoilState(chatMenuModalState)

    useEffect(() => {
        if (!chatContainerRef.current) return;
    
        const chatContainer = chatContainerRef.current;
        const { scrollHeight, clientHeight } = chatContainer;
    
        if (scrollHeight > clientHeight) {
          chatContainer.scrollTop = scrollHeight - clientHeight;
        }
      }, [chatList.length]);

    useEffect(() => {
        if (chat && chat.msg !== "") {
            chat && setChatList((prev) => [...prev, chat]);
        }
    }, [chat]);
    useEffect(() => {
        socket.on('chat', (user, msg) => {
            setChat({user: user, msg: msg});
        })
        return (() => {
            socket.off('chat');
        })
    }, [socket]);

    return (
        <div className={C.chatFieldStyle} ref={chatContainerRef}>
            <ul style={{width: "100%", listStyle: "none", paddingLeft: 0}}>
                { chatList.map((chat, index) => (
                    <Message key={index} my_msg={chat.user === props.current} name={chat.user} msg={chat.msg} />
                )) }
            </ul>
        </div>
    )
}

export default ChatField;