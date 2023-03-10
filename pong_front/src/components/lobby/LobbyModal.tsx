import { BlockModal, DMModal, FriendModal, PendingModal } from "./modal";

export default function LobbyModal() {
    return (
        <>
            <BlockModal />
            <DMModal />
            <FriendModal />
            <PendingModal />
        </>
    );
}