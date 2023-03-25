import {useState} from "react";
import CardList from "../CardList";
import DmCardButton from "./DmCardButton";

function DmCardButtonList(props: {dmList: string[]}) {
    const [currPage, setCurrPage] = useState<number>(1);
    const cardsPerPage = 3; // 한 페이지에 보여줄 카드
    const offset = (currPage - 1) * cardsPerPage;
    let totalPage = Math.ceil(props.dmList.length / cardsPerPage);

    return (
        <CardList currPage={currPage} totalPage={totalPage} setCurrPage={setCurrPage}>
            {props.dmList.slice(offset, offset + cardsPerPage).map((item) => 
                <DmCardButton key={item} userName={item}/>
           )}
        </CardList>
    )
}

export default DmCardButtonList;