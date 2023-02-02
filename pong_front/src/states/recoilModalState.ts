import { atom } from "recoil"
import { User } from "../components/profile/User"

export const dmModalState = atom<boolean>({
    key: "dmmodalstate",
    default: false
})

export const profileModalState = atom<{user?:User, userId: number, show: boolean}>({
    key: "profilemodalstate",
    default: {
        user: {
            id: 0,
            avatar: "test.jpg",
            userName: "pinga",
            myProfile: true, 
            userStatus: "test",
            rank: 0,
            odds: 0,
            record: []
        },
        userId: 0,
        show: false
    }
})

export const profileEditModalState = atom<boolean>({
    key: "profileeditmodalstate",
    default: false
})

export const friendModalState = atom<boolean>({
    key: "friendmodalstate",
    default: false
})

export const createChatModalState = atom<boolean>({
    key: "createchatmodalstate",
    default: false
})