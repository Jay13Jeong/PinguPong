import React from "react";

import { Stack, Box, IconButton } from "@mui/material";
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

function CardList (props: {currPage: number, totalPage: number, setCurrPage: Function, children: React.ReactNode}) {

    return (
       <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={1}
            sx={{minHeight: "310px"}}
       >
            <IconButton color="primary" size="large"
                disabled={props.currPage <= 1 ? true : false}
                onClick={() => props.setCurrPage(props.currPage - 1)}
            >
                <NavigateBeforeIcon />
            </IconButton>
            <Box sx={{minWidth: "510px"}}>
                {props.children}
            </Box>
            <IconButton color="primary" size="large"
                disabled={props.currPage >= props.totalPage ? true : false}
                onClick={() => props.setCurrPage(props.currPage + 1)}
            >
                <NavigateNextIcon />
            </IconButton>
       </Stack>
    );
}

export default CardList;