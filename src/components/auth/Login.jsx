import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/Login.css';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8080/library/auth/login', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const text = await response.text();
                setError(text || 'Login failed');
                return;
            }

            const data = await response.json();
            localStorage.setItem('access_token', data.token);
            localStorage.setItem('user_id', data.userId);

            navigate('/library');
        } catch (err) {
            setError('Failed to connect to the server');
            console.error(err);
        }
    };

    return (
        <div className="login-wrapper d-flex align-items-center justify-content-center">
            <div className="login-card shadow-lg p-4 bg-white rounded">
                <h2 className="text-center mb-4">🔐 Library Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <button type="submit" className="btn btn-primary w-100">Login</button>
                </form>

                <div className="text-center mt-3">
                    <p>Don't have an account?</p>
                    <button className="btn btn-outline-primary w-100 mb-2" onClick={() => navigate('/library/registration')}>
                        Register
                    </button>
                    <button className="btn btn-outline-secondary w-100" onClick={() => navigate('/library')}>
                        ← Back to Home
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Login;
