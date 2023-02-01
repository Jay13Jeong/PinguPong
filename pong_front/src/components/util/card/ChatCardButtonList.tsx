import React, {useState, useEffect, useContext} from "react";
import { SocketContext } from "../../../states/contextSocket";
import CardList from "./CardList";
import ChatCardButton from "./ChatCardButton";

function ChatCardButtonList() {
    /* socket */
    const socket = useContext(SocketContext);

    /* state */
    // const [chatRooms, setChatRooms] = useState<IterableIterator<string>>();
    const [chatRooms, setChatRooms] = useState<string[]>([
        // "LIBFT 42번 평가받은 지식 공유합니다.",
        // "ft_container 뽀개기!",
        // "webserv물어보세요~",
        // "pingpong king이 되기까지의 여정",
        // "한달만에 멤버되는 법",
        // "pingupong 10전 10패 전략",
        // "오늘도 개발자가 안 된다고 말했다",
        // "유지보수하기 어렵게 코딩하는 방법 평생 개발자로 먹고 살 수 있다",
        // "개발자 되는 법",
        // "😇😇😇😇😇😇😇"
    ]);
    const [currPage, setCurrPage] = useState<number>(1)
    // TODO - 필요하다면 Loading state 추가

    /* variables */
    const cardsPerPage = 5;
    const offset = (currPage - 1) * cardsPerPage;
    let totalPage = Math.ceil(chatRooms.length / cardsPerPage);

    useEffect(() => {
        // TODO - 채팅방 목록을 보내달라 요청
        socket.emit('/api/get/RoomList');
        // TODO - 받아온 채팅방 목록을 state에 저장
        socket.on('/api/get/RoomList', (data: any) => {
            setChatRooms(data);
        });
    }, []);

    return (
        <CardList currPage={currPage} totalPage={totalPage} setCurrPage={setCurrPage}>
            {chatRooms.slice(offset, offset + cardsPerPage).map((item, index) => 
                <ChatCardButton key={index} roomName={item}/>
           )}
        </CardList>
    )
}

export default ChatCardButtonList;