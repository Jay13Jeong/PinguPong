import { BlockModal, DMModal, FriendModal } from "./modal";
// import { BlockModal, DMModal, FriendModal, MyProfileModal } from "./modal";

export default function LobbyModal() {
    return (
        <>
            <BlockModal />
            <DMModal />
            <FriendModal />
            {/* <MyProfileModal /> */}
        </>
    );
}