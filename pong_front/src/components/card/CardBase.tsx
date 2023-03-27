import { Card } from "@mui/material";

type WrapperProp = {
    children: React.ReactElement;
};

export function CardBase({ children }: WrapperProp) {
    return (
        <Card sx={
            {
                padding: '10px',
                alignItems: 'center',
                textAlign: 'center',
                margin: "5px 0 5px 0",
                width: "500px",
                height: "fit-content",
            }
        }>
            {children}
        </Card>
    )
}