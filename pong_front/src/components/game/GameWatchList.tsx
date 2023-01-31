import React, {useState, useEffect} from "react";
import Loader from "../util/Loader";
import {Center} from "../../styles/Layout"
import axios from 'axios';
import GameCardButton from "../util/card/GameCardButton";
import CardList from "../util/card/CardList";

function GameWatchList (props: any) {


    let gameList: {id: string, p1: string, p2: string, s1: number, s2: number}[] = [
        {
            id: "pingpong_kingvsloser",
            p1: "pingpong_king",
            p2: "loser",
            s1: 3,
            s2: 2
        },
        {
            id: "jeyoonvscheolee",
            p1: "jeyoon",
            p2: "cheolee",
            s1: 1,
            s2: 2
        },
        {
            id: "jeyoonvsjjeong",
            p1: "jeyoon",
            p2: "jjeong",
            s1: 1,
            s2: 3
        },
        {
            id: "cheoleevsjjeong",
            p1: "cheolee",
            p2: "jjeong",
            s1: 10,
            s2: 10
        },
        {
            id: "pingpong_kingvspingpong_master",
            p1: "pingpong_king",
            p2: "pingpong_master",
            s1: 5,
            s2: 7
        },
        {
            id: "loservsjeyoon",
            p1: "loser",
            p2: "jeyoon",
            s1: 1,
            s2: 3
        },
        {
            id: "1",
            p1: "loser",
            p2: "jeyoon",
            s1: 1,
            s2: 3
        },
        {
            id: "2",
            p1: "loser",
            p2: "jeyoon",
            s1: 1,
            s2: 3
        },
        {
            id: "3",
            p1: "loser",
            p2: "jeyoon",
            s1: 1,
            s2: 3
        },
        {
            id: "4",
            p1: "loser",
            p2: "jeyoon",
            s1: 1,
            s2: 3
        },
        {
            id: "5",
            p1: "loser",
            p2: "jeyoon",
            s1: 1,
            s2: 3
        },
    ]


    // 상태 정의
    const [loading, setLoading] = useState<boolean>(false);
    const [currPage, setCurrPage] = useState<number>(1)
    // 변수 정의
    const cardsPerPage = 10; // 한 페이지에 보여줄 카드
    const offset = (currPage - 1) * cardsPerPage;
    let totalPage = Math.ceil(gameList.length / cardsPerPage);      // 전체 페이지
    
    // // 데이터들을 불러온다.
    // const axiosInstance = axios.create({
    //     baseURL: "[BASE URL]",
    //     withCredentials: true,
    // });
    // const getGameList = async () => {
    //     return await axiosInstance.get('');
    // }

    // useEffect(()=>{
    //     setLoading(true);   // 로딩화면
    //     getGameList()
    //     .then((response) => {
    //         // gameList 처리
    //         // totalPage 초기화
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     });
    //     setLoading(false);
    // }, []);

    if (loading) {
        return (
        <Center>
            <Loader text="게임 목록 로딩 중"/>
        </Center>
        );
    }
    return (
        <Center>
        <CardList currPage={currPage} totalPage={totalPage} setCurrPage={setCurrPage}>
            {gameList.slice(offset, offset + cardsPerPage).map((item) => 
                <GameCardButton key={item.id} p1={item.p1} p2={item.p2} s1={item.s1} s2={item.s2}/>
           )}
        </CardList>
        </Center>
    );
}

export default GameWatchList;