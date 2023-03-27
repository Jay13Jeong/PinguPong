import { css } from '@emotion/css'

export const myMessgeBox = css({
    textAlign: "right"
})

export const otherMessageBox = css({
    textAlign: "left"
})

const messageBase = {
    maxWidth: '75%',
    padding: '10px',
    display: 'inline-block',
    borderColor: '#25316D',
    wordBreak: "break-all",
    wordWrap: "break-word",
    textAlign: "left"
}

export const myMessage = {
    ...messageBase,
    backgroundColor: '#97D2EC',
}

export const otherMessage = {
    ...messageBase,
    backgroundColor: '#FEF5AC',
}

