import React from 'react';
import { Typography, Paper, ListItemText } from '@mui/material';
import * as S from './Message.styles';
import {useSetRecoilState } from 'recoil';
import { chatMenuModalState } from '../../common/states/recoilModalState';

function Message (props: {my_msg: boolean, name: string, msg: string}) {

    const setShowModal = useSetRecoilState(chatMenuModalState)

    function showMenuHander(userName: string) {
        setShowModal({user: userName, show: true});
    }

    return (
        <li className={props.my_msg ? S.myMessgeBox : S.otherMessageBox}>
            <Typography variant='subtitle1' component='div'
                onClick={props.my_msg ? undefined : () => {showMenuHander(props.name)}}
            >
                {props.my_msg ? "You" : props.name}
            </Typography>
            <Paper variant="outlined" sx={props.my_msg ? S.myMessage : S.otherMessage}>
                {props.msg}
            </Paper>
        </li>
    )
}

export default Message;