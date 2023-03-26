import {useState, useEffect, useContext} from "react";
import { SocketContext } from "../../common/states/contextSocket";
import GameCardButton from "../../components/card/game/GameCardButton";
import CardList from "../../components/card/CardList";
import useCheckLogin from "../../util/useCheckLogin";
import { Stack, Typography } from "@mui/material";
import { DefaultBox, DefaultLinearProgress } from "../../components/common";

function GameWatchPage () {
    useCheckLogin();

    const [loading, setLoading] = useState<boolean>(true);
    const [currPage, setCurrPage] = useState<number>(1)
    const [gameList, setGameList] = useState<{p1: string, p2: string}[]>([]);
    const socket = useContext(SocketContext);

    useEffect(() => {
        socket.emit('pingGetRoomList');
        socket.on('pingGetRoomList', (data: {p1: string, p2: string}[]) => {
            setGameList((prev) => [...prev, ...data]);
            setLoading(false);
        });
        return(()=>{
            socket.off('pingGetRoomList');
        })
    }, [socket]);

    const cardsPerPage = 3; // 한 페이지에 보여줄 카드
    const offset = (currPage - 1) * cardsPerPage;
    let totalPage = Math.ceil(gameList.length / cardsPerPage);      // 전체 페이지

    return (
        <DefaultBox>
           <Stack
                justifyContent="center"
                alignItems="center"
           >
                {loading ? 
                <>
                    <Typography variant="subtitle1" gutterBottom>게임 목록 로딩중...</Typography>
                    <DefaultLinearProgress />
                </> : 
                <>
                    <Typography variant="h2" gutterBottom>👾 Live Game List 👾</Typography>
                    <CardList currPage={currPage} totalPage={totalPage} setCurrPage={setCurrPage}>
                        {gameList.slice(offset, offset + cardsPerPage).map((item, index) => 
                            <GameCardButton key={index} p1={item.p1} p2={item.p2}/>
                    )}
                    </CardList>
                </>}
            </Stack> 
        </DefaultBox>
    );
}

export default GameWatchPage