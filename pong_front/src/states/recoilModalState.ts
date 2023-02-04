import { atom } from "recoil"
import { User } from "../components/profile/User"

export const dmModalState = atom<boolean>({
    key: "dmModalState",
    default: false
})

export const profileModalState = atom<{user?:User, userId: number, show: boolean}>({
    key: "profileModalState",
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
    key: "profileEditModalState",
    default: false
})

export const friendModalState = atom<boolean>({
    key: "friendModalState",
    default: false
})

export const blockModalState = atom<boolean>({
    key: "blockModalState",
    default: false
})

export const createChatModalState = atom<boolean>({
    key: "createChatModalState",
    default: false
})

export const secretChatModalState = atom<{roomName: string, show: boolean}>({
    key: "secretChatModalState",
    default: {
        roomName: "",
        show: false
    }
})

export const loginState = atom<boolean>({
    key: "loginState",
    default: false
})

export const changeChatPwModalState = atom<{roomName: string, show: boolean}>({
    key: "changeChatPwModalState",
    default: {
        roomName: "",
        show: false
    }
})

export const chatMenuModalState = atom<{user: string, show: boolean}>({
    key: "chatMenuModalState",
    default: {user: "", show: false}
})