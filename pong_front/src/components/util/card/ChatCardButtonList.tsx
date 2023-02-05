import React, {useState, useEffect, useContext} from "react";
import { SocketContext } from "../../../states/contextSocket";
import CardList from "./CardList";
import ChatCardButton from "./ChatCardButton";
import SecretChatModal from "../../modal/SecretChatModal";
import useGetData from "../../../util/useGetData";
import { REACT_APP_HOST } from "../../../util/configData";

function ChatCardButtonList() {
    /* socket */
    const [myInfo, error, isLoading] = useGetData('http://' + REACT_APP_HOST + ':3000/api/user');
    const socket = useContext(SocketContext);
    const [current, setCurrent] = useState<string>('');     // 현재 유저의 id

    /* state */
    const [chatRooms, setChatRooms] = useState<string[]>([]);
    const [currPage, setCurrPage] = useState<number>(1)
    // TODO - 필요하다면 Loading state 추가

    /* variables */
    const cardsPerPage = 5;
    const offset = (currPage - 1) * cardsPerPage;
    let totalPage = Math.ceil(chatRooms.length / cardsPerPage);

    useEffect(() => {
        /* 현재 유저의 userName */
        if (myInfo !== null) {
            setCurrent(myInfo.username as string);
        }
    }, [myInfo, error, isLoading]);

    useEffect(() => {
        if (current !== '') {
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
    }, [socket, current]);

    return (
        <>
        <SecretChatModal current={current}/>
        <CardList currPage={currPage} totalPage={totalPage} setCurrPage={setCurrPage}>
            {chatRooms.slice(offset, offset + cardsPerPage).map((item, index) => 
                <ChatCardButton key={index} roomName={item} current={current}/>
                )}
        </CardList>
        </>
    )
}

export default ChatCardButtonList;