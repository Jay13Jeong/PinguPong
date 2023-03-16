import { useState, useContext, useEffect, useRef } from 'react';
import * as Chat from './ChatField.styles';
import { SocketContext } from "../../common/states/contextSocket"
import {useSetRecoilState } from 'recoil';
import { chatMenuModalState } from '../../common/states/recoilModalState';


function ChatField (props: {roomName: string, current: string}) {
    const socket = useContext(SocketContext);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [chat, setChat] = useState<{user: string, msg: string}>({user: "", msg: ""});
    const [chatList, setChatList] = useState<{user: string, msg: string}[]>([]);
    const setShowModal = useSetRecoilState(chatMenuModalState)
    // const [showMenu, setShowMenu] = useState<{user: string, show: boolean}>({user: "", show: false});

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

    function showMenuHander(userName: string) {
        setShowModal({user: userName, show: true});
    }

    return (
        <Chat.ChatFieldContainer id={"chat-field"} ref={chatContainerRef}>
            { chatList.map((chat, index) => (
                <Chat.MessageBox key={index} className={chat.user === props.current ? "my_message" : "other"}>
                    <span onClick={chat.user === props.current ? undefined : (e) => {showMenuHander(chat.user)}}>
                        {chat.user === props.current ? '' : chat.user}
                    </span>
                    <Chat.Message className="message">{chat.msg}</Chat.Message>
                </Chat.MessageBox>
            )) }
        </Chat.ChatFieldContainer>
    )
}

export default ChatField;