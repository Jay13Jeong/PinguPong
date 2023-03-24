const messageBase = {
    maxWidth: '80%',
    padding: '10px',
    display: 'flex',
    borderColor: '#25316D',
    wordBreak: "keep-all",
    wordWrap: "break-word",
}

export const myMessage = {
    ...messageBase,
    backgroundColor: '#97D2EC',
    justifyContent: 'flex-end',
}

export const otherMessage = {
    ...messageBase,
    backgroundColor: '#FEF5AC',
    justifyContent: 'flex-start',
}

