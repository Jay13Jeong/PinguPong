import React from "react";
import { useSetRecoilState } from "recoil";
import { profileModalState } from "../../../states/recoilModalState";
import {CardButton} from "./Card";

function UserCardButton(props: {userID: number, userName: string, userStatus: string}) {
    const profileState = useSetRecoilState(profileModalState);
    function clickHandler(value: number, e: any) {
        // TODO 이동할 user의 id도 넣어주기..!
        profileState({userId: 0, show: true});
        // profileState({userId: value, show: true});
    }

    function showStatus(status: string) {
        switch(status) {
            case "on" :
                return (
                    <span className="status">
                        online
                    </span>
                );
            case "off" :
                return (
                    <span className="status">
                        offline
                    </span>
                );
            case "game" : 
                return (
                    <span className="status">
                        game
                    </span>
                );
            default:
                return (null);
        }
    }

    return (
        <CardButton onClick={(e) => clickHandler(props.userID, e)}>
            <span className="user-id">{props.userName}</span>
            {showStatus(props.userStatus)}
        </CardButton>
    );
}

export default UserCardButton;