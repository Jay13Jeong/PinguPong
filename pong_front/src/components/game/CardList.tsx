import React, {useState, useEffect} from "react";
import Loader from "../util/Loader";
import {Center, Stack} from "../../styles/Layout"
import axios from 'axios';
import GameCard from "./GameCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { createSecureContext } from "tls";

// props에 따라 다른 데이터들을 불러오는 방법도 괜찮을 것 같다.

function CardList (props: any) {
    // 상태 정의
    const [loading, setLoading] = useState<boolean>(false);
    const [currPage, setCurrPage] = useState<number>(1)
    // 변수 정의
    const cardsPerPage = 4; // 한 페이지에 보여줄 카드
    const offset = (currPage - 1) * cardsPerPage;
    let totalPage = 2;      // 전체 페이지
    
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
    ]

    if (loading) {
        return (<Loader text="Loading"/>);
    }
    return (
       <Center>
           <button disabled={currPage <= 1 ? true : false} onClick={() => setCurrPage(currPage - 1)}><FontAwesomeIcon icon={faAngleLeft} /></button>
           <Stack style={{margin: "20px"}}>
           {gameList.slice(offset, offset + cardsPerPage).map((item) => 
                <GameCard key={item.id} p1={item.p1} p2={item.p2} s1={item.s1} s2={item.s2}/>
           )}
           </Stack>
           <button disabled={currPage >= totalPage ? true : false} onClick={() => setCurrPage(currPage + 1)}><FontAwesomeIcon icon={faAngleRight} /></button>
       </Center>
    );
}

export default CardList;