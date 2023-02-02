import DMModal from "./DMModal";
import FriendModal from "./FriendModal";
import ProfileModal from "./ProfileModal";
import ProfileEditModal from "./ProfileEditModal";
import CreateChatModal from "./CreateChatModal";
import SecretChatModal from "./SecretChatModal";

function Modal() {
    return (
        <>
            <CreateChatModal />
            <SecretChatModal />
            <DMModal />
            <FriendModal />
            <ProfileModal />
            <ProfileEditModal />
        </>
    );
}

export default Modal;