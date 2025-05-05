import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './css/OrderEditForm.css';

const OrderEditForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [copies, setCopies] = useState([]);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch(`http://localhost:8080/library/orders/${id}`, { credentials: 'include' })
            .then(res => res.json())
            .then(setOrder)
            .catch(() => setError('Failed to fetch order'));

        fetch(`http://localhost:8080/library/users`, { credentials: 'include' })
            .then(res => res.json())
            .then(setUsers)
            .catch(() => setError('Failed to fetch users'));

        fetch(`http://localhost:8080/library/copies`, { credentials: 'include' })
            .then(res => res.json())
            .then(setCopies)
            .catch(() => setError('Failed to fetch copies'));
    }, [id]);

    const handleChange = (field) => (e) => {
        const value = e.target.value;
        setOrder(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = users.find(u => u.id === order.userDto.id);
            const copy = copies.find(c => String(c.id) === String(order.bookCopyDto.id));

            const userDto = {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                ...(user.dateOfBirth && { dateOfBirth: user.dateOfBirth }),
                ...(user.salary && { salary: user.salary }),
            };
            const bookStatus = order.status === 'RETURNED' ? 'AVAILABLE' : 'BORROWED';

            const payload = {
                id: order.id,
                userDto,
                bookCopyDto: {
                    id: copy.id,
                    bookDto: copy.bookDto,
                    status: bookStatus
                },
                subscriptionType: order.subscriptionType,
                orderDate: order.orderDate,
                expirationDate: order.expirationDate,
                status: order.status
            };

            const res = await fetch(`http://localhost:8080/library/orders`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error(await res.text());
            navigate(`/library/orders/${id}`);
        } catch (err) {
            setError(err.message || 'Update failed');
        }
    };

    if (!order) return <div className="order-edit-form-container">Loading...</div>;

    return (
        <div className="order-edit-form-container">
            <div className="order-edit-form-card">
                <h2 className="order-edit-form-title">✏️ Edit Order</h2>
                <form onSubmit={handleSubmit}>
                    <div className="order-form-group">
                        <label>User:</label>
                        <select value={order.userDto.id} onChange={(e) => {
                            const user = users.find(u => u.id === e.target.value);
                            setOrder(prev => ({ ...prev, userDto: user }));
                        }} required>
                            <option value="" disabled>Select a user</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.firstName} {user.lastName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="order-form-group">
                        <label>Book Copy:</label>
                        <select value={order.bookCopyDto.id} onChange={(e) => {
                            const copy = copies.find(c => String(c.id) === e.target.value);
                            setOrder(prev => ({ ...prev, bookCopyDto: copy }));
                        }} required>
                            <option value="" disabled>Select a copy</option>
                            {copies.map(copy => (
                                <option key={copy.id} value={copy.id}>
                                    {copy.bookDto.title} (Copy #{copy.id})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="order-form-group">
                        <label>Subscription Type:</label>
                        <select value={order.subscriptionType} onChange={handleChange('subscriptionType')} required>
                            <option value="READING_ROOM">READING_ROOM</option>
                            <option value="SUBSCRIPTION">SUBSCRIPTION</option>
                        </select>
                    </div>

                    <div className="order-form-group">
                        <label>Order Date:</label>
                        <input type="date" value={order.orderDate} onChange={handleChange('orderDate')} required />
                    </div>

                    <div className="order-form-group">
                        <label>Expiration Date:</label>
                        <input type="date" value={order.expirationDate} onChange={handleChange('expirationDate')} required />
                    </div>

                    <div className="order-form-group">
                        <label>Status:</label>
                        <select value={order.status} onChange={handleChange('status')} required>
                            <option value="BORROWED">BORROWED</option>
                            <option value="RETURNED">RETURNED</option>
                            <option value="OVERDUE">OVERDUE</option>
                        </select>
                    </div>

                    {error && <div className="order-edit-error">{error}</div>}

                    <div className="order-form-actions">
                        <button type="submit" className="order-submit-button">💾 Update</button>
                        <button type="button" className="order-cancel-button" onClick={() => navigate(`/library/orders/${id}`)}>
                            ← Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OrderEditForm;
