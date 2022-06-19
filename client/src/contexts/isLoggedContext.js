import React from 'react';

const isLogged = React.createContext({
    logged: false,
    setLogged: () => {}
});

export default isLogged;