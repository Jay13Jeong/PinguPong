import { useEffect, useState } from "react";
import { useResetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";

import { dmModalState } from "../../../common/states/recoilModalState";
import Loader from "../../util/Loader";
import useGetData from "../../../util/useGetData";
import { REACT_APP_HOST } from "../../../common/configData";
import { CardButton} from "../Card.style";

function DmCardButton(props: {userName: string}) {
    const [targetId, setTargetId] = useState<number>();
    const [info, error, isLoading] = useGetData(`http://` + REACT_APP_HOST + `/api/user/name?username=${props.userName}`, props.userName);
    const resetState =  useResetRecoilState(dmModalState);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        if(!isLoading && info !== null) {
            setTargetId(info.id);
            setLoading(false);
        }
    }, [info, isLoading, error]);

    function clickHandler(e: React.MouseEvent<HTMLElement>) {
        resetState();
        navigate(`/dm/${targetId}`, {state: {
            targetId: targetId
        }});
    }
    return (
        <CardButton onClick={loading ? undefined : clickHandler}>
            {loading ? <Loader/> : 
            <span>
                {props.userName}
            </span>}
        </CardButton>
    )
}

export default DmCardButton;