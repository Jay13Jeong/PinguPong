import React, {useState} from "react";
import CardList from "./CardList";
import UserCardButton from "./UserCardButton";
import * as types from "../../profile/User"

function UserCardButtonList(props: {friends: types.friend[]}) {
    const [currPage, setCurrPage] = useState<number>(1);
    const cardsPerPage = 5; // 한 페이지에 보여줄 카드
    const offset = (currPage - 1) * cardsPerPage;
    let totalPage = Math.ceil(props.friends.length / cardsPerPage);

    return (
        <CardList currPage={currPage} totalPage={totalPage} setCurrPage={setCurrPage}>
            {props.friends.slice(offset, offset + cardsPerPage).map((item) => 
                <UserCardButton key={item.userId} userID={item.userId} userName={item.userName} userStatus={item.userStatus}/>
           )}
        </CardList>
    )
}

export default  UserCardButtonList;