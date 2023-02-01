import React, {createContext} from "react";
import io, { Socket } from "socket.io-client";

const ENDPOINT = "http://localhost:3000"; // TODO - 나중에 환경변수로 빼 주기
export const socket = io(ENDPOINT, {
    transports: ['websocket'],
    withCredentials: true,
});

export const SocketContext = createContext<Socket>({} as Socket);