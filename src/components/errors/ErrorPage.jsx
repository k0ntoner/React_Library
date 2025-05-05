import React from 'react';

const ErrorPage = ({ status, message }) => {
    return (
        <div className="container mt-5 text-center">
            <h2 className="text-danger">❌ Error {status}</h2>
            <p>{message}</p>
        </div>
    );
};

export default ErrorPage;
