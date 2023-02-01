import DMModal from "./DMModal";
import FriendModal from "./FriendModal";
import ProfileModal from "./ProfileModal";
import ProfileEditModal from "./ProfileEditModal";
import CreateChatModal from "./CreateChatModal";

function Modal() {
    return (
        <>
            <CreateChatModal />
            <DMModal />
            <FriendModal />
            <ProfileModal />
            <ProfileEditModal />
        </>
    );
}

export default Modal;