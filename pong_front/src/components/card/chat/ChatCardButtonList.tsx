import {useState, useEffect, useContext} from "react";
import { SocketContext } from "../../../common/states/contextSocket";
import CardList from "../../card/CardList";
import ChatCardButton from "./ChatCardButton";
import SecretChatModal from "../../chat/modal/SecretChatModal";
import { REACT_APP_HOST } from "../../../common/configData";
import useGetData from "../../../util/useGetData";

function ChatCardButtonList(props: {current: string, chatList: string[]}) {
    const [chatRooms, setChatRooms] = useState<string[]>([]);
    const [currPage, setCurrPage] = useState<number>(1);

    useEffect(() => {
        if (props.chatList)
            setChatRooms(props.chatList);
    },[props.chatList]);

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