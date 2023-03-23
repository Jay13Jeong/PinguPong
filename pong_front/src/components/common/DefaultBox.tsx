import { Box } from "@mui/material";

type WrapperProp = {
    children: React.ReactElement;
};

export function DefaultBox({ children }: WrapperProp) {
    return (
        <Box sx={{ 
            padding: '20px',
            backgroundColor: 'background.paper',
            borderRadius: 2,
         }}>
            {children}
        </Box>
    );
}