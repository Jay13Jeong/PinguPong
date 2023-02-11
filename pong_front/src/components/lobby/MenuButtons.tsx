import { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSetRecoilState } from "recoil";
import * as states from "../../common/states/recoilModalState";
import { SocketContext } from "../../states/contextSocket";
import { faCircleUser, faEnvelope, faPeopleGroup, faSignOutAlt, faUserSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { REACT_APP_HOST } from "../../util/configData";
import * as S from "./MenuButtons.style"
import axios from "axios";

export default function MenuButtons() {
    const socket = useContext(SocketContext);
    // TODO - 전역 상태로 관리할 필요가 있을지 생각해보기
    const dmState = useSetRecoilState(states.dmModalState);
    const profileState = useSetRecoilState(states.profileModalState);
    const friendState = useSetRecoilState(states.friendModalState);
    const blockState = useSetRecoilState(states.blockModalState);
    const navigate = useNavigate();

    const showDmModal = (e: React.MouseEvent<HTMLElement>) => {
        dmState(true);
    }

    const showProfileModal = () => {
        profileState({userId: 0, show: true}); // TODO - 친구 모달과 내 모달 분리할 것
    }

    const showFriendModal = () => {
        friendState(true);
    }

    const showBlockModal = () => {
        blockState(true);
    }

    const logout = () => {
        axios.get('http://' + REACT_APP_HOST + ':3000/api/auth/logout', {withCredentials: true}) //쿠키와 함께 보내기 true.
        .then(res => {
            if (res.data && res.data.msg === 'logout ok'){
                alert('sign out');
                navigate('/');
            }
        })
        .catch(err => {
            // TODO - Error?
        })
        .finally( () => {
          socket.disconnect();
        })
    }

    return (
        <S.MenuButtonsWrapper>
            <button onClick={showDmModal}><FontAwesomeIcon icon={faEnvelope}/></button>
            <button onClick={showProfileModal}><FontAwesomeIcon icon={faCircleUser}/></button>
            <button onClick={showFriendModal}><FontAwesomeIcon icon={faPeopleGroup}/></button>
            <button onClick={showBlockModal}><FontAwesomeIcon icon={faUserSlash}/></button>
            <button onClick={logout}><FontAwesomeIcon icon={faSignOutAlt}/></button>
        </S.MenuButtonsWrapper>
    );
}