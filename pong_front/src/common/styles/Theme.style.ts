import { createTheme } from "@mui/material";

export const theme = createTheme({
    palette: {
        primary: {
            main: '#9BCFFC',
        },
        secondary: {
            main: '#50D890',
        },
        text: {
            primary: '#141616',
            secondary: '#141616',
        },
        background: {
            default: '#EFFFFB',
        }
    },
    typography: {
        fontFamily: [
            'Nanum Gothic',
            'Jua',
            'sans-serif',
          ].join(','),
        h1: {
            fontFamily: [
                // 'Nanum Gothic',
                'Jua',
                'sans-serif',
            ].join(','),
        },
        h2: {
            fontFamily: [
                // 'Nanum Gothic',
                'Jua',
                'sans-serif',
            ].join(','),
        },
        body1: {
            fontFamily: [
                'Nanum Gothic',
                // 'Jua',
                'sans-serif',
            ].join(','),
        },
        body2: {
            fontFamily: [
                'Nanum Gothic',
                // 'Jua',
                'sans-serif',
            ].join(','),
        },
        button: {
            fontFamily: [
                //'Nanum Gothic',
                'Jua',
                'sans-serif',
            ].join(','),
        },
    }
});