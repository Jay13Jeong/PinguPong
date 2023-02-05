import {useState, useEffect, useContext} from "react";
import { SocketContext } from "../../../states/contextSocket";
import CardList from "./CardList";
import ChatCardButton from "./ChatCardButton";
import SecretChatModal from "../../modal/SecretChatModal";

function ChatCardButtonList(props: {current: string}) {
    /* socket */
    const socket = useContext(SocketContext);

    /* state */
    const [chatRooms, setChatRooms] = useState<string[]>([]);
    const [currPage, setCurrPage] = useState<number>(1)

    useEffect(() => {
        if (props.current !== '') {
            // TODO - 채팅방 목록을 보내달라 요청
            socket.emit('/api/get/RoomList');
            // TODO - 받아온 채팅방 목록을 state에 저장
            socket.on('/api/get/RoomList', (data: any) => {
                setChatRooms(data);
            });
        }
        return (() => {
            socket.off('/api/get/RoomList');
        })
    }, [socket, props]);

    /* variables */
    const cardsPerPage = 5;
    const offset = (currPage - 1) * cardsPerPage;
    let totalPage = Math.ceil(chatRooms.length / cardsPerPage);
    
    return (
        <>
        <SecretChatModal current={props.current}/>
        <CardList currPage={currPage} totalPage={totalPage} setCurrPage={setCurrPage}>
            {chatRooms.slice(offset, offset + cardsPerPage).map((item, index) => 
                <ChatCardButton key={index} roomName={item} current={props.current}/>
                )}
        </CardList>
        </>
    )
}

export default ChatCardButtonList;