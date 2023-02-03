import DMModal from "./DMModal";
import FriendModal from "./FriendModal";
import ProfileModal from "./ProfileModal";
import ProfileEditModal from "./ProfileEditModal";
import CreateChatModal from "./CreateChatModal";
import SecretChatModal from "./SecretChatModal";
import * as types from "../profile/User"
import BlockModal from "./BlockModal";


function Modal() {
    return (
        <>
            <CreateChatModal />
            <SecretChatModal />
            <DMModal />
            <BlockModal/>
            <FriendModal/>
            <ProfileModal/>
            {/* <ProfileEditModal /> */}
        </>
    );
}

export default Modal;