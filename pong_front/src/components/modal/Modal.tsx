import DMModal from "./DMModal";
import FriendModal from "./FriendModal";
import ProfileModal from "./ProfileModal";
import BlockModal from "./BlockModal";


function Modal() {
    return (
        <>
            <DMModal />
            <BlockModal/>
            <FriendModal/>
            <ProfileModal/>
        </>
    );
}

export default Modal;