import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

import {CardListWrapper} from "./CardList.style";

function CardList (props: {currPage: number, totalPage: number, setCurrPage: Function, children: React.ReactNode}) {

    return (
       <CardListWrapper>
            <button className="card-list-button" disabled={props.currPage <= 1 ? true : false} 
            onClick={() => props.setCurrPage(props.currPage - 1)}>
                <FontAwesomeIcon icon={faAngleLeft} />
            </button>
            <div className="card-list">
                {props.children}
            </div>
            <button className="card-list-button" disabled={props.currPage >= props.totalPage ? true : false} 
            onClick={() => props.setCurrPage(props.currPage + 1)}>
                <FontAwesomeIcon icon={faAngleRight} />
            </button>
       </CardListWrapper>
    );
}

export default CardList;