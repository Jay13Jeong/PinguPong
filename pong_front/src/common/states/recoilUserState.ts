import { atom } from "recoil";
import { User } from "../../common/types/User";

export const userState = atom<User>({
    key: 'userState',
    default: {
        id: 0,
        avatar : undefined,
        userName: '',
        myProfile: false,
        userStatus: '',
        rank: 0,
        odds: 0,
        record: [],
        following: false,
        block: false,
        relate: ''
    }
});