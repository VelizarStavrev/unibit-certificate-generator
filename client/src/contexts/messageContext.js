import React from 'react';

const messageContext = React.createContext({
    currentMessages: [],
    setCurrentMessages: () => {}
});

export default messageContext;