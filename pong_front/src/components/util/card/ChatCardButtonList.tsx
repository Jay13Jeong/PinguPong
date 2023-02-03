import React, {useState, useEffect, useContext} from "react";
import { SocketContext } from "../../../states/contextSocket";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CardList from "./CardList";
import ChatCardButton from "./ChatCardButton";
import SecretChatModal from "../../modal/SecretChatModal";
import useAxios from "../../../util/useAxios";

function ChatCardButtonList() {
    /* socket */
    const [myInfo, error, isLoading] = useAxios('http://localhost:3000/api/user');
    const socket = useContext(SocketContext);
    const [current, setCurrent] = useState<string>("");     // 현재 유저의 id
    const navigate = useNavigate();

    console.log("myInfo: ", myInfo);
    console.log("error: ", error);
    console.log("isLoading: ", isLoading);

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
        if (myInfo !== null) {
            console.log('current', current);
            setCurrent(myInfo.username as string);
        }
    }, [error, isLoading]);

    useEffect(() => {
        // axios.get('http://localhost:3000/api/user', {withCredentials: true}) //쿠키와 함께 보내기 true.
        // .then(res => {
        //     // console.log(res.data);
        //     if (res.data){
        //         setCurrent(res.data.username as string);
        //     }
        // })
        // .catch(err => {
        //     if (err.response.data.statusCode === 401)
        //     navigate('/'); //로그인 안되어 있다면 로그인페이지로 돌아간다.
        // })
        // TODO - 채팅방 목록을 보내달라 요청
        socket.emit('/api/get/RoomList');
        // TODO - 받아온 채팅방 목록을 state에 저장
        socket.on('/api/get/RoomList', (data: any) => {
            setChatRooms(data);
        });
        return (() => {
            socket.off('/api/get/RoomList');
        })
    }, []);

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