import React, {useEffect, useState} from "react";
import CardList from "./CardList";
import GameCard from "./GameCard";
import * as types from "../../profile/User"
import axios from "axios";
import { REACT_APP_HOST } from "../../../util/configData";

function GameRecordList(props: {user: types.User}) {
    const [currPage, setCurrPage] = useState<number>(1);
    const [record, setRecord] = useState<types.Record[]>([]);
    const cardsPerPage = 5; // 한 페이지에 보여줄 카드
    const offset = (currPage - 1) * cardsPerPage;
    useEffect(() => {
        // TODO: 유저 게임기록을 받아온다.
        axios.get('http://' + REACT_APP_HOST + ':3000/api/game/' + props.user.id , {withCredentials: true}) //쿠키와 함께 보내기 true.
        .then(res => {
            // console.log(res.data);
            if (res.data){
                let records : types.Record[] = res.data.map((rec: any) => {
                    return {
                        idx: rec.id,
                        p1: rec.winner.username,
                        p2: rec.loser.username,
                        p1Score: rec.winnerScore,
                        p2Score: rec.loserScore,
                    }
                })
                setRecord(records);
            }
        })
        .catch(err => {
        })
    }, []);
    let totalPage = Math.ceil(record.length / cardsPerPage);
    
    return (
        <CardList currPage={currPage} totalPage={totalPage} setCurrPage={setCurrPage}>
            {record.slice(offset, offset + cardsPerPage).map((item) => 
                <GameCard key={item.idx} p1={item.p1} p2={item.p2} s1={item.p1Score} s2={item.p2Score}/>
           )}
        </CardList>
    )
}

export default GameRecordList;