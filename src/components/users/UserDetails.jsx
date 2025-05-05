import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './css/UserDetails.css';

const UserDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch(`http://localhost:8080/library/users/${encodeURIComponent(id)}`, {
            credentials: 'include',
        })
            .then(async (res) => {
                if (!res.ok) throw new Error(await res.text());
                return res.json();
            })
            .then(setUser)
            .catch((err) => {
                console.error(err);
                setError('Failed to load user');
            });
    }, [id]);

    const handleLogout = async () => {
        try {
            const res = await fetch('http://localhost:8080/library/auth/logout', {
                method: 'POST',
                credentials: 'include',
                redirect: 'manual'
            });


                localStorage.removeItem('access_token');
                localStorage.removeItem('user_id');

                navigate('/library/login');
        } catch (err) {
            console.error('Logout failed:', err);
            alert('Logout failed. Try again.');
        }
    };

    if (!user) return <div className="user-details-container">{error || 'Loading...'}</div>;

    return (
        <div className="user-details-container">
            <div className="user-details-card">
                <div className="user-details-header">
                    <h2 className="user-details-title">👤 User Details</h2>
                    <button className="user-logout-button" onClick={handleLogout}>🚪 Logout</button>
                </div>

                <div className="user-meta">
                    <p><strong>ID:</strong> {user.id}</p>
                    <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Phone:</strong> {user.phoneNumber}</p>
                    {user.dateOfBirth && <p><strong>Date of Birth:</strong> {user.dateOfBirth}</p>}
                    {user.salary && <p><strong>Salary:</strong> ${user.salary}</p>}
                </div>

                <div className="user-orders">
                    <h3 className="orders-title">📦 User Orders</h3>
                    {user.orders.length === 0 ? (
                        <p className="no-orders">This user has no orders.</p>
                    ) : (
                        <ul className="order-list">
                            {user.orders.map((order) => (
                                <li key={order.id} className="order-item">
                                    <p><strong>Order ID:</strong> {order.id}</p>
                                    <p><strong>Book:</strong> {order.bookCopyDto.bookDto.title} (Copy #{order.bookCopyDto.id})</p>
                                    <p><strong>Subscription:</strong> {order.subscriptionType}</p>
                                    <p><strong>Order Date:</strong> {order.orderDate}</p>
                                    <p><strong>Expiration Date:</strong> {order.expirationDate}</p>
                                    <p><strong>Status:</strong> {order.status}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="user-edit-actions">
                    <button
                        className="user-action-button user-edit-button"
                        onClick={() => navigate(`/library/users/${id}/edit`)}>
                        ✏️ Edit
                    </button>
                    <button
                        className="user-action-button"
                        onClick={() => navigate('/library')}>
                        ← Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserDetails;
