import React, {useState, useEffect, useContext} from "react";
import Loader from "../util/Loader";
import {Center, Stack} from "../../styles/Layout"
import { SocketContext } from "../../states/contextSocket";
import GameCardButton from "../util/card/GameCardButton";
import CardList from "../util/card/CardList";

function GameWatchList () {
    const [loading, setLoading] = useState<boolean>(true);
    const [currPage, setCurrPage] = useState<number>(1)
    const [gameList, setGameList] = useState<{p1: string, p2: string}[]>([]);
    const socket = useContext(SocketContext);

    useEffect(() => {
        socket.emit('api/get/roomlist');
        socket.on('api/get/roomlist', (data: {p1: string, p2: string}[]) => {
            setGameList((prev) => [...prev, ...data]);
            setLoading(false);
        });
        return(()=>{
            socket.off('api/get/roomlist');
        })
    }, [socket]);

    /* variables */
    const cardsPerPage = 8; // 한 페이지에 보여줄 카드
    const offset = (currPage - 1) * cardsPerPage;
    let totalPage = Math.ceil(gameList.length / cardsPerPage);      // 전체 페이지


    if (loading) {
        return (
        <Center>
            <Loader text="게임 목록 로딩 중"/>
        </Center>
        );
    }
    return (
        <Center>
            <Stack>
            <h1>👾 Live Game List 👾</h1>
            <CardList currPage={currPage} totalPage={totalPage} setCurrPage={setCurrPage}>
                {gameList.slice(offset, offset + cardsPerPage).map((item, index) => 
                    <GameCardButton key={index} p1={item.p1} p2={item.p2}/>
            )}
            </CardList>
            </Stack>
        </Center>
    );
}

export default GameWatchList;