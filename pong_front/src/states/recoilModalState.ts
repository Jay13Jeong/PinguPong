import { atom } from "recoil"

export const dmModalState = atom<boolean>({
    key: "dmmodalstate",
    default: false
})

export const profileModalState = atom<{userId: number, show: boolean}>({
    key: "profilemodalstate",
    default: {
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