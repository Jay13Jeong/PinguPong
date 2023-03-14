import { atom } from "recoil"

export const dmModalState = atom<boolean>({
    key: "dmModalState",
    default: false
})

export const profileModalState = atom<{ userId: number, show: boolean }>({
    key: "profileModalState",
    default: {
        userId: 0,
        show: false
    }
})

export const otherProfileModalState = atom<{ userId: number, show: boolean }>({
    key: "otherProfileModalState",
    default: {
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

export const pendingModalState = atom<boolean>({
    key: "pendingModalState",
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

export const gameInviteModalState = atom<boolean>({
    key: "gameInviteModalState",
    default: false
})