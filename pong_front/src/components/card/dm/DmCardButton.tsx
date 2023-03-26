import { useEffect, useState } from "react";
import { useResetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { Typography, CardActionArea, CircularProgress } from "@mui/material";
import { dmModalState } from "../../../common/states/recoilModalState";
import useGetData from "../../../util/useGetData";
import { REACT_APP_HOST } from "../../../common/configData";
import { CardBase } from "../CardBase";

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
        <CardBase>
            { loading ? <CircularProgress /> :
                <CardActionArea onClick={clickHandler}>
                    <Typography variant="subtitle2" sx={{minWidth: "400px"}}>{props.userName}</Typography>
                </CardActionArea>
            }
        </CardBase>
    )
}

export default DmCardButton;