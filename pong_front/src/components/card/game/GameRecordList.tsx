import {useEffect, useState} from "react";
import CardList from "../CardList";
import GameCard from "./GameCard";
import * as types from "../../../common/types/User"
import axios from "axios";
import { REACT_APP_HOST } from "../../../common/configData";

function GameRecordList(props: {user: types.User}) {
    const [currPage, setCurrPage] = useState<number>(1);
    const [record, setRecord] = useState<types.Record[]>([]);
    
    useEffect(() => {
        const getGameData = async () => {
            try{
                const res = await axios.get('http://' + REACT_APP_HOST + '/api/game/' + props.user.id , {withCredentials: true}); //쿠키와 함께 보내기 true.
                if (res.data === null || res.data === undefined)
                return ;
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
            }catch(err: any){ }
        }
        getGameData();
    }, []);
    
    const cardsPerPage = 3; // 한 페이지에 보여줄 카드
    const offset = (currPage - 1) * cardsPerPage;
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