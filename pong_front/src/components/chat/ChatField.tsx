import React, { useState, useContext, useEffect, useRef } from 'react';
import * as Chat from './ChatField.styles';
import { SocketContext } from "../../states/contextSocket"

function ChatField (props: {roomName: string, current: string}) {
    const socket = useContext(SocketContext);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [chat, setChat] = useState<{user: string, msg: string}>({user: "", msg: ""});
    // const [chatList, setChatList] = useState<{user: string, msg: string}[]>([]);
    const [chatList, setChatList] = useState<{user: string, msg: string}[]>([
        {user: "pinga", msg: "test1"},
        {user: "pinga", msg: "test2"},
        {user: "pinga", msg: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam elementum elit nisi, ac hendrerit purus posuere vel. Vivamus fringilla elementum congue."},
        {user: "jeyoon", msg: "Duis vitae justo porta, consectetur massa eu, aliquet mauris. In et dignissim velit, eu congue ipsum. Ut bibendum condimentum libero at pellentesque."},
        {user: "pingi", msg: "뭐라는 것임? 😇"},
        {user: "pinga", msg: "test1"},
        {user: "pinga", msg: "test2"},
        {user: "pinga", msg: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam elementum elit nisi, ac hendrerit purus posuere vel. Vivamus fringilla elementum congue."},
        {user: "jeyoon", msg: "Duis vitae justo porta, consectetur massa eu, aliquet mauris. In et dignissim velit, eu congue ipsum. Ut bibendum condimentum libero at pellentesque."},
        {user: "pingi", msg: "뭐라는 것임? 😇"},
        {user: "pinga", msg: "test1"},
        {user: "pinga", msg: "test2"},
        {user: "pinga", msg: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam elementum elit nisi, ac hendrerit purus posuere vel. Vivamus fringilla elementum congue."},
        {user: "jeyoon", msg: "Duis vitae justo porta, consectetur massa eu, aliquet mauris. In et dignissim velit, eu congue ipsum. Ut bibendum condimentum libero at pellentesque."},
        {user: "pingi", msg: "뭐라는 것임? 😇"},
        {user: "pinga", msg: "test1"},
        {user: "pinga", msg: "test2"},
        {user: "pinga", msg: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam elementum elit nisi, ac hendrerit purus posuere vel. Vivamus fringilla elementum congue."},
        {user: "jeyoon", msg: "Duis vitae justo porta, consectetur massa eu, aliquet mauris. In et dignissim velit, eu congue ipsum. Ut bibendum condimentum libero at pellentesque."},
        {user: "pingi", msg: "뭐라는 것임? 😇"},
        {user: "pinga", msg: "test1"},
        {user: "pinga", msg: "test2"},
        {user: "pinga", msg: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam elementum elit nisi, ac hendrerit purus posuere vel. Vivamus fringilla elementum congue."},
        {user: "jeyoon", msg: "Duis vitae justo porta, consectetur massa eu, aliquet mauris. In et dignissim velit, eu congue ipsum. Ut bibendum condimentum libero at pellentesque."},
        {user: "pingi", msg: "뭐라는 것임? 😇"},
    ]);

    useEffect(() => {
        chat && setChatList((prev) => [...prev, chat]);
    }, [chat]);
    useEffect(() => {
        console.log("chat-field", props.current);
        socket.on('chat', (user, msg) => {
            setChat({user: user, msg: msg});
        })
    }, [socket]);

    return (
        <Chat.ChatFieldContainer ref={chatContainerRef}>

        </Chat.ChatFieldContainer>
    )
}

export default ChatField;