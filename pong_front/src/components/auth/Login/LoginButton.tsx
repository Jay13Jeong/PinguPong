import { REACT_APP_HOST } from '../../../common/configData';
import * as S from './LoginButton.style';
import { DefaultBox } from '../../common';
import { Typography, Stack, Box } from '@mui/material';
export default function LoginButton() {
    return (
        <DefaultBox>
        <Stack>
            <Typography variant='h1' sx={{marginBottom: '10px'}}>Pingu Pong</Typography>
            <S.LoginButton 
                className='loginbtn' 
                onClick={()=>{window.location.href = "http://" + REACT_APP_HOST + "/api/auth/google/login"}}>
                    <Box sx={{minWidth: '100%', border: '1px dashed #141616'}}>
                        GOOGLE LOGIN
                    </Box>
            </S.LoginButton>
            <S.LoginButton 
                className='loginbtn' 
                onClick={()=>{window.location.href = "http://" + REACT_APP_HOST + "/api/auth/42/login"}}>
                    <Box sx={{minWidth: '100%', border: '1px dashed #141616'}}>
                        42 LOGIN
                    </Box>
            </S.LoginButton>
        </Stack>
        </DefaultBox>
    );
}