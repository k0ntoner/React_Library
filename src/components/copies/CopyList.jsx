import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/CopyList.css';

const CopyList = () => {
    const [copies, setCopies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isTableView, setIsTableView] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:8080/library/copies', {
            method: 'GET',
            credentials: 'include',
        })
            .then(async (response) => {
                if (!response.ok) {
                    const text = await response.text();
                    navigate('/error', {
                        state: {
                            status: response.status,
                            message: text || 'Unknown error',
                        },
                    });
                    throw new Error('Redirecting to error page');
                }
                return response.json();
            })
            .then((data) => {
                setCopies(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [navigate]);

    return (
        <div className="copy-list-background">
            <div className="copy-list-wrapper">
                <h2 className="copy-list-title">📚 Book Copies</h2>

                <div className="copy-list-buttons">
                    <button className="copy-nav-button" onClick={() => navigate('/library')}>
                        ← Back to Home
                    </button>
                    <button
                        className="copy-toggle-button"
                        onClick={() => setIsTableView(prev => !prev)}
                    >
                        {isTableView ? '📦 Card View' : '📋 Table View'}
                    </button>
                    <button className="copy-create-button" onClick={() => navigate('/library/copies/create')}>
                        ➕ Add New Copy
                    </button>
                </div>

                {loading && <p className="text-center">Loading...</p>}

                {!loading && isTableView ? (
                    <table className="table table-bordered mt-4">
                        <thead className="table-light">
                        <tr>
                            <th>ID</th>
                            <th>Book Title</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {copies.map(copy => (
                            <tr key={copy.id}>
                                <td>{copy.id}</td>
                                <td>{copy.bookDto.title}</td>
                                <td>{copy.status}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => navigate(`/library/copies/${copy.id}`)}
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="copy-card-grid">
                        {copies.map((copy) => (
                            <div
                                key={copy.id}
                                className={`copy-card ${copy.status === 'BORROWED' ? 'borrowed' : ''}`}
                            >
                                <div className="copy-field">
                                    <span className="copy-label">🆔 ID:</span> {copy.id}
                                </div>
                                <div className="copy-field">
                                    <span className="copy-label">📘 Book:</span> {copy.bookDto.title}
                                </div>
                                <div className="copy-field">
                                    <span className="copy-label">📌 Status:</span> {copy.status}
                                </div>
                                <button
                                    className="copy-view-button"
                                    onClick={() => navigate(`/library/copies/${copy.id}`)}
                                >
                                    View Details
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CopyList;
