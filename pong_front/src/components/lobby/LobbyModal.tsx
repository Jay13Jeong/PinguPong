import { BlockModal, DMModal, FriendModal, ProfileModal } from "./modal";
// import { BlockModal, DMModal, FriendModal, MyProfileModal } from "./modal";

export default function LobbyModal() {
    return (
        <>
            <BlockModal />
            <DMModal />
            <FriendModal />
            <ProfileModal />
            {/* <MyProfileModal /> */}
        </>
    );
}