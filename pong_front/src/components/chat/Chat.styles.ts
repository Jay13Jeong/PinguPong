import { styled } from "@mui/material"
import { DefaultBox } from "../common";
import { css } from "@emotion/css";

export const ChatRoomWrapper = styled(DefaultBox)(({ theme }) => ({
    display: "grid",
    width: "1000px",
    height: "600px",
    justifyContent: "center",
    alignItems: "center",
    gridTemplateColumns: "1fr 4fr",
    gridTemplateRows: "10fr 1fr 1fr 1fr",
}));

export const duelRequestBtnStyle = {
    gridColumn: "1/2",
    gridRow: "2/3",
}

export const changePwBtnStyle = {
    gridColumn: "1/2",
    gridRow: "3/4",
}

export const exitChatBtnStyle = {
    gridColumn: "1/2",
    gridRow: "4/5",
}

export const cchatFieldStyle = {
    gridColumn: "2/3",
    gridRow: "1/4",
    height: "600px",
    overflow: "auto",
    display: "flex",
    flexDirection: "row",
}

export const chatFieldStyle = css({
    height: "600px",
    overflow: "auto",
})

export const chatInputStyle = {
    display: "grid",
    gridTemplateColumns: "9fr 1fr",
}

export const messageStyle = {
    maxWidth: "80%",
    marginBottom: "0.5rem",
    wordBrake: "break-all",
    wordWrap: "break-word",
    padding: "12px",
    borderRadius: "0.5rem",
    border: "1px solid #06283D",
}

export const myMessageBoxStyle = {
    display: "flex",
    flexDirection: "column",
    alignSelf: "flex-end",
    "& .message": {
        background: "#47B5FF",
        alignSelf: "flex-end",
    }
}

export const otherMessageBoxStyle = {
    display: "flex",
    flexDirection: "column",
    "& .message": {
        background: "#DFF6FF"
    }
}

