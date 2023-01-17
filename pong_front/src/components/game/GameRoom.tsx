import React, {useEffect} from "react";
import GameCanvas from "./GameCanvas";
import {Center, Stack} from "../../styles/Layout";


function GameRoom(props: any) {
    return (
        <Center>
            <Stack>
                <div>this is gameroom</div>
                {/* <GameScore /> */}
                {/* <GameUsers/> */}
                <GameCanvas/>
            </Stack>
        </Center>
    );
}

export default GameRoom;