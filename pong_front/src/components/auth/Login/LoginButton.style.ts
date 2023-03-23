import { styled } from "@mui/material"
import { Button } from "@mui/material"
import { theme } from "../../../common/styles/Theme.style"

export const LoginButton = styled(Button) `
    background: ${theme.palette.primary.main};
    color: ${theme.palette.text.primary};
    font-size: 2rem;
    margin: 1rem;
    &:hover {
        background: ${theme.palette.secondary.main};
    }
`
