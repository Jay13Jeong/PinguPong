import {useState} from "react";
import CardList from "../CardList";
import UserCardButton from "./UserCardButton";
import * as types from "../../../common/types/User";

function UserCardButtonList(props: {friends: types.Friend[]}) {
    const [currPage, setCurrPage] = useState<number>(1);
    const cardsPerPage = 3; // 한 페이지에 보여줄 카드
    const offset = (currPage - 1) * cardsPerPage;
    let totalPage = Math.ceil(props.friends.length / cardsPerPage);

    return (
        <CardList currPage={currPage} totalPage={totalPage} setCurrPage={setCurrPage}>
            {props.friends.slice(offset, offset + cardsPerPage).map((item) => 
                <UserCardButton friend={item} key={item.userId} userID={item.userId} userName={item.userName} userStatus={item.userStatus} relate={item.relate}/>
           )}
        </CardList>
    )
}

export default  UserCardButtonList;