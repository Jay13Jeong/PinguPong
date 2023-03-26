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
        error: {
            main: '#F05454',
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
                'Jua',
                'sans-serif',
            ].join(','),
            fontSize: '4rem',
        },
        h2: {
            fontFamily: [
                'Jua',
                'sans-serif',
            ].join(','),
            fontSize: '3rem',
        },
        h3: {
            fontFamily: [
                'Jua',
                'sans-serif',
            ].join(','),
            fontSize: '2.5rem',
        },
        subtitle1: {
            fontFamily: [
                'Jua',
                'sans-serif',
            ].join(','),
            fontSize: '1.25rem',
        },
        subtitle2: {
            fontFamily: [
                'Jua',
                'sans-serif',
            ].join(','),
            fontSize: '1.75rem',
        },
        body1: {
            fontFamily: [
                'Nanum Gothic',
                'sans-serif',
            ].join(','),
            fontSize: '1.25rem',
        },
        body2: {
            fontFamily: [
                'Nanum Gothic',
                'sans-serif',
            ].join(','),
            fontSize: '1.25rem',
        },
        button: {
            fontFamily: [
                'Jua',
                'sans-serif',
            ].join(','),
            fontSize: '1.25rem',
        },
    }
});