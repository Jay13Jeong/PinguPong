import {useState, useEffect, useContext} from "react";
import { SocketContext } from "../../../common/states/contextSocket";
import CardList from "../../card/CardList";
import ChatCardButton from "./ChatCardButton";
import SecretChatModal from "../../chat/modal/SecretChatModal";

function ChatCardButtonList(props: {current: string}) {
    const socket = useContext(SocketContext);
    const [chatRooms, setChatRooms] = useState<string[]>([]);
    const [currPage, setCurrPage] = useState<number>(1)

    useEffect(() => {
        if (props.current !== '') {
            socket.emit('/api/get/RoomList');
            socket.on('/api/get/RoomList', (data: string[]) => {
                setChatRooms(data);
            });
        }
        return (() => {
            socket.off('/api/get/RoomList');
        })
    }, [socket, props.current]);

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