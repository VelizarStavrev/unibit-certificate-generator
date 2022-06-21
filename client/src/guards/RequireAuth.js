import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import isLogged from '../contexts/isLoggedContext';

function RequireAuth() {
    const { logged } = useContext(isLogged);

    if (!logged) {
        return <Navigate to="/login" replace={true} />;
    }

    return <Outlet />;
}

export default RequireAuth;