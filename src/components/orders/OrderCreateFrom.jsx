import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/OrderCreateForm.css';

const OrderCreateForm = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [copies, setCopies] = useState([]);
    const [error, setError] = useState('');
    const [order, setOrder] = useState({
        userId: '',
        copyId: '',
        subscriptionType: '',
        orderDate: '',
        expirationDate: '',
        status: 'BORROWED',
    });

    useEffect(() => {
        fetch('http://localhost:8080/library/users', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json'
            }
        })
            .then(async (res) => {
                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(`Failed to fetch users: ${errorText}`);
                }
                return res.json();
            })
            .then((data) => {
                console.log("Fetched users:", data);
                setUsers(data);
            })
            .catch((e) => {
                console.error(e);
                setError('Failed to load users');
            });
    }, []);

    useEffect(() => {
        fetch('http://localhost:8080/library/copies', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json'
            }
        })
            .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch copies');
                return res.json();
            })
            .then(setCopies)
            .catch((e) => {
                console.error(e);
                setError('Failed to load copies');
            });
    }, []);


    const handleChange = (field) => (e) => {
        setOrder((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = users.find(u => u.id === order.userId);
            const copy = copies.find(c => String(c.id) === order.copyId);

            const userDto = {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber,
            };

            if (user.dateOfBirth) {
                userDto.dateOfBirth = user.dateOfBirth;
            }

            if (user.salary) {
                userDto.salary = user.salary;
            }

            const body = {
                userDto,
                bookCopyDto: {
                    id: copy.id,
                    bookDto: copy.bookDto,
                    status: 'BORROWED'
                },
                subscriptionType: order.subscriptionType,
                orderDate: order.orderDate,
                expirationDate: order.expirationDate,
                status: order.status
            };

            const response = await fetch('http://localhost:8080/library/orders', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (!response.ok) throw new Error(await response.text());
            navigate('/library/orders');
        } catch (err) {
            setError(err.message || 'Creation failed');
        }
    };


    return (
        <div className="order-create-container">
            <div className="order-create-card">
                <h2 className="order-create-title">📝 Create Order</h2>
                <form onSubmit={handleSubmit}>
                    <div className="order-form-group">
                        <label>User:</label>
                        <select value={order.userId} onChange={handleChange('userId')} required>
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
                        <select value={order.copyId} onChange={handleChange('copyId')} required>
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
                            <option value="" disabled>Select type</option>
                            <option value="READING_ROOM">READING_ROOM</option>
                            <option value="SUBSCRIPTION">SUBSCRIPTION</option>
                        </select>
                    </div>

                    <div className="order-form-group">
                        <label>Order Date:</label>
                        <input
                            type="date"
                            value={order.orderDate}
                            onChange={handleChange('orderDate')}
                            required
                        />
                    </div>

                    <div className="order-form-group">
                        <label>Expiration Date:</label>
                        <input
                            type="date"
                            value={order.expirationDate}
                            onChange={handleChange('expirationDate')}
                            required
                        />
                    </div>

                    <div className="order-form-group">
                        <label>Status:</label>
                        <select value={order.status} onChange={handleChange('status')} required disabled>
                            <option value="BORROWED">BORROWED</option>
                        </select>
                    </div>

                    {error && <div className="order-error-message">{error}</div>}

                    <div className="order-form-actions">
                        <button type="submit" className="order-submit-button">✅ Create</button>
                        <button type="button" className="order-cancel-button" onClick={() => navigate('/library/orders')}>
                            ← Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OrderCreateForm;
