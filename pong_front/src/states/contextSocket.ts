import {createContext} from "react";
import io, { Socket } from "socket.io-client";
import { REACT_APP_HOST } from "../util/configData";

const ENDPOINT = "http://" + REACT_APP_HOST + ":3000";
export const socket = io(ENDPOINT, {
    transports: ['websocket'],
    withCredentials: true,
});

export const SocketContext = createContext<Socket>({} as Socket);