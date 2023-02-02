import React from "react";
import { useSetRecoilState } from "recoil";
import { profileModalState } from "../../../states/recoilModalState";
import { Friend, User } from "../../profile/User";
import {CardButton} from "./Card";

function UserCardButton(props: {friend: Friend, userID: number, userName: string, userStatus: string, relate?: string}) {
    const profileState = useSetRecoilState(profileModalState);
    function clickHandler(user?: User, value?: number, e?: any) {
        // TODO 이동할 user의 id도 넣어주기..!
        // profileState({userId: 0, show: true});
        // console.log(user);
        // console.log(value);
        profileState({user: user, userId: (value? value : 0), show: true});
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

    function showRelate(relate: string | undefined) {
        switch(relate) {
            case "accepted" :
                return (
                    <span className="relate">
                        친구
                    </span>
                );
            case "blocked" :
                return (
                    <span className="relate">
                        차단중
                    </span>
                );
            case "pending" : 
                return (
                    <span className="relate">
                        보류중
                    </span>
                );
            default:
                return (null);
        }
    }

    return (
        <CardButton onClick={(e) => clickHandler(props.friend.you, props.userID, e)}>
            {showRelate(props.relate)}
            <span className="user-id">{props.userName}</span>
            {showStatus(props.userStatus)}
        </CardButton>
    );
}

export default UserCardButton;