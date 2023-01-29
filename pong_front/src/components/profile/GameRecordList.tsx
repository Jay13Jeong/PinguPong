import React, {useState} from "react";
import CardList from "../game/CardList";
import GameCard from "../game/GameCard";
import * as types from "./User"

function GameRecordList(props: {record: types.record[]}) {
    const [currPage, setCurrPage] = useState<number>(1);
    const cardsPerPage = 5; // 한 페이지에 보여줄 카드
    const offset = (currPage - 1) * cardsPerPage;
    let totalPage = Math.ceil(props.record.length / cardsPerPage);
    return (
        <CardList currPage={currPage} totalPage={totalPage} setCurrPage={setCurrPage}>
            {props.record.slice(offset, offset + cardsPerPage).map((item) => 
                <GameCard key={item.idx} p1={item.p1} p2={item.p2} s1={item.p1Score} s2={item.p2Score}/>
           )}
        </CardList>
    )
}

export default GameRecordList;