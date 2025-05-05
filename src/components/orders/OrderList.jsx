import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/OrderList.css';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isTableView, setIsTableView] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:8080/library/orders', {
            method: 'GET',
            credentials: 'include',
        })
            .then(async (response) => {
                if (!response.ok) {
                    const text = await response.text();
                    navigate('/error', {
                        state: { status: response.status, message: text || 'Unknown error' }
                    });
                    throw new Error('Redirecting to error page');
                }
                return response.json();
            })
            .then((data) => {
                setOrders(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [navigate]);

    return (
        <div className="order-list-page-container">
            <h2 className="order-list-page-title">📦 All Orders</h2>

            <div className="order-list-page-top-buttons">
                <button className="order-list-page-button" onClick={() => navigate('/library')}>
                    ← Back to Home
                </button>

                <button
                    className="order-list-page-button-secondary"
                    onClick={() => setIsTableView(prev => !prev)}
                >
                    {isTableView ? '📦 Card View' : '📋 Table View'}
                </button>

                <button className="order-list-page-button" onClick={() => navigate('/library/orders/create')}>
                    ➕ Add New Order
                </button>
            </div>

            {loading && <p className="text-center">Loading...</p>}

            {!loading && isTableView ? (
                <table className="table table-bordered mt-4">
                    <thead className="table-light">
                    <tr>
                        <th>ID</th>
                        <th>User</th>
                        <th>Book</th>
                        <th>Ordered</th>
                        <th>Expires</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map(order => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.userDto.firstName} {order.userDto.lastName}</td>
                            <td>{order.bookCopyDto.bookDto.title}</td>
                            <td>{order.orderDate}</td>
                            <td>{order.expirationDate}</td>
                            <td>{order.status}</td>
                            <td>
                                <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => navigate(`/library/orders/${order.id}`)}
                                >
                                    View
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <div className="order-list-page-grid">
                    {orders.map((order) => (
                        <div key={order.id} className="order-list-page-card">
                            <div className="order-list-page-field">
                                <span className="order-list-page-label">🆔 ID:</span> {order.id}
                            </div>
                            <div className="order-list-page-field">
                                <span className="order-list-page-label">👤 User:</span> {order.userDto.firstName} {order.userDto.lastName}
                            </div>
                            <div className="order-list-page-field">
                                <span className="order-list-page-label">📘 Book:</span> {order.bookCopyDto.bookDto.title}
                            </div>
                            <div className="order-list-page-field">
                                <span className="order-list-page-label">🗓️ Ordered:</span> {order.orderDate}
                            </div>
                            <div className="order-list-page-field">
                                <span className="order-list-page-label">📅 Expires:</span> {order.expirationDate}
                            </div>
                            <button
                                className="order-list-page-view-button"
                                onClick={() => navigate(`/library/orders/${order.id}`)}
                            >
                                View Details
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderList;
