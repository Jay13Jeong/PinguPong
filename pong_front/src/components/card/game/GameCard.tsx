import { CardBase } from "../CardBase"

import { Typography } from '@mui/material'

function GameCard (props: {p1: string, p2: string, s1: number, s2: number}) {
    return (
        <CardBase>
            <>
                <Typography variant="subtitle1">{props.p1} ⚔️ {props.p2}</Typography>
                <Typography variant="subtitle1">{props.s1} : {props.s2}</Typography>
            </>
        </CardBase>
    )
}

export default GameCard