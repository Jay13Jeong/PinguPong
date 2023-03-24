import React from 'react';
import { Typography, Paper, ListItemText } from '@mui/material';
import { myMessage, otherMessage } from './Message.styles';
import Grid from '@mui/material/Unstable_Grid2';

import { ListItem } from '@mui/material';


function Message (props: {my_msg: boolean, name: string, msg: string}) {
    return (
        <>
        {props.my_msg ? null : <Typography variant='subtitle1'>{props.name}</Typography>}
        <Paper variant="outlined" sx={props.my_msg ? myMessage : otherMessage}>
            {props.msg}
        </Paper>
        </>
    )
}

export default Message;