import React from 'react';
import { useLocation } from 'react-router-dom';
import ErrorPage from './ErrorPage';

const ErrorWrapper = () => {
    const location = useLocation();
    const { status, message } = location.state || {
        status: 'Unknown',
        message: 'No error details provided.'
    };

    return <ErrorPage status={status} message={message} />;
};

export default ErrorWrapper;
