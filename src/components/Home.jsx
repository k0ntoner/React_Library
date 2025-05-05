import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem('user_id');
    return (
        <div className="home-wrapper d-flex align-items-center justify-content-center">
            <div className="home-card text-center shadow-lg">
                <h1 className="mb-4">📚 Welcome to the <span className="highlight">Library</span></h1>
                <p className="mb-4 text-muted">Explore the most powerful library in the digital world.</p>
                <div className="button-group">
                    <button onClick={() => navigate('/library/books')} className="btn btn-home">📖 Book Catalog</button>
                    <button onClick={() => navigate('/library/copies')} className="btn btn-home">📚 Copies Catalog</button>
                    <button onClick={() => navigate('/library/orders')} className="btn btn-home">🧾 Orders</button>
                    <button onClick={() => navigate(`/library/users/${userId}`)} className="btn btn-home">👤 User Dashboard</button>
                    <button onClick={() => navigate('/library/login')} className="btn btn-outline-dark mt-3">
                        🔐 Sign In / Sign Up
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;
