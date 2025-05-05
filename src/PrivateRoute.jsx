import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const [authorized, setAuthorized] = useState(null); // null = loading
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        fetch('http://localhost:8080/library/auth/check', {
            method: 'GET',
            credentials: 'include',
        })
            .then(res => {
                setAuthorized(res.ok);
                setChecking(false);
            })
            .catch(() => {
                setAuthorized(false);
                setChecking(false);
            });
    }, []);

    if (checking) return null; // or loading indicator
    return authorized ? children : <Navigate to="/library/login" />;
};

export default PrivateRoute;
