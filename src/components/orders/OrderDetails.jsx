import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './css/OrderDetails.css';

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteError, setDeleteError] = useState('');

    useEffect(() => {
        fetch(`http://localhost:8080/library/orders/${id}`, {
            method: 'GET',
            credentials: 'include'
        })
            .then(async (res) => {
                if (!res.ok) throw new Error(await res.text());
                return res.json();
            })
            .then(data => {
                setOrder(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError('Failed to load order');
                setLoading(false);
            });
    }, [id]);

    const confirmDelete = async () => {
        try {
            const res = await fetch(`http://localhost:8080/library/orders/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!res.ok) throw new Error(await res.text());

            navigate('/library/orders');
        } catch (err) {
            console.error(err);
            setDeleteError(err.message || 'Failed to delete order');
        }

    };

    if (loading) return <div className="order-details-page-container">Loading...</div>;
    if (error || !order) return <div className="order-details-page-container">{error || 'Order not found.'}</div>;

    const user = order.userDto;
    const copy = order.bookCopyDto;

    return (
        <div className="order-details-page-container">
            <div className="order-details-card">
                <div className="order-details-header">
                    <span className="order-header-icon">📦</span>
                    <h1 className="order-details-title">Order #{order.id}</h1>
                </div>

                <div className="order-details-meta">
                    <div className="order-meta-row">
                        <span className="order-meta-label">User:</span>
                        <span className="order-meta-content">{user.firstName} {user.lastName}</span>
                    </div>
                    <div className="order-meta-row">
                        <span className="order-meta-label">Phone:</span>
                        <span className="order-meta-content">{user.phoneNumber}</span>
                    </div>
                    <div className="order-meta-row">
                        <span className="order-meta-label">Email:</span>
                        <span className="order-meta-content">{user.email}</span>
                    </div>
                    {'dateOfBirth' in user && (
                        <div className="order-meta-row">
                            <span className="order-meta-label">Date of Birth:</span>
                            <span className="order-meta-content">{user.dateOfBirth}</span>
                        </div>
                    )}
                    {'salary' in user && (
                        <div className="order-meta-row">
                            <span className="order-meta-label">Salary:</span>
                            <span className="order-meta-content">${user.salary}</span>
                        </div>
                    )}
                    <div className="order-meta-row">
                        <span className="order-meta-label">Book:</span>
                        <span className="order-meta-content">{copy.bookDto.title} (Copy #{copy.id})</span>
                    </div>
                    <div className="order-meta-row">
                        <span className="order-meta-label">Subscription Type:</span>
                        <span className="order-meta-content">{order.subscriptionType}</span>
                    </div>
                    <div className="order-meta-row">
                        <span className="order-meta-label">Order Date:</span>
                        <span className="order-meta-content">{order.orderDate}</span>
                    </div>
                    <div className="order-meta-row">
                        <span className="order-meta-label">Expiration Date:</span>
                        <span className="order-meta-content">{order.expirationDate}</span>
                    </div>
                    <div className="order-meta-row">
                        <span className="order-meta-label">Status:</span>
                        <span className={`order-meta-content ${order.status === 'OVERDUE' ? 'order-status-overdue' : ''}`}>
                            {order.status}
                        </span>
                    </div>
                </div>

                <div className="order-button-group">
                    <button className="order-action-button order-delete-button" onClick={() => setShowConfirm(true)}>
                        🗑️ Delete
                    </button>
                    <button className="order-action-button order-edit-button" onClick={() => navigate(`/library/orders/${id}/edit`)}>
                        ✏️ Edit
                    </button>
                    <button className="order-action-button order-back-button" onClick={() => navigate('/library/orders')}>
                        ← Back
                    </button>
                </div>
                {deleteError && (
                    <div className="order-delete-error-banner">
                        ❌ {deleteError}
                    </div>
                )}
            </div>

            {showConfirm && (
                <div className="order-confirm-modal-overlay">
                    <div className="order-confirm-modal">
                        <p>Are you sure you want to delete this order?</p>
                        <div className="order-confirm-modal-actions">
                            <button className="order-confirm-modal-confirm" onClick={confirmDelete}>Yes, Delete</button>
                            <button className="order-confirm-modal-cancel" onClick={() => setShowConfirm(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default OrderDetails;
