import DMModal from "./DMModal";
import FriendModal from "./FriendModal";
import ProfileModal from "./ProfileModal";
import ProfileEditModal from "./ProfileEditModal";
import CreateChatModal from "./CreateChatModal";
import SecretChatModal from "./SecretChatModal";
import * as types from "../profile/User"


function Modal(props: {user : types.User}) {
    return (
        <>
            <CreateChatModal />
            <SecretChatModal />
            <DMModal />
            <FriendModal user={props.user} />
            <ProfileModal user={props.user}/>
            {/* <ProfileEditModal /> */}
        </>
    );
}

export default Modal;