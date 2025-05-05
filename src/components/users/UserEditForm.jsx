import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './css/UserEditForm.css';

const UserEditForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch(`http://localhost:8080/library/users/${encodeURIComponent(id)}`, {
            credentials: 'include',
        })
            .then(async res => {
                if (!res.ok) throw new Error(await res.text());
                return res.json();
            })
            .then(setUser)
            .catch(err => {
                console.error(err);
                setError('Failed to load user');
            });
    }, [id]);

    const handleChange = (field) => (e) => {
        setUser((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const isEmployee = user.salary !== undefined && user.salary !== null;
        const endpoint = isEmployee
            ? `http://localhost:8080/library/employees`
            : `http://localhost:8080/library/customers`;

        fetch(endpoint, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        })
            .then(async res => {
                if (!res.ok) throw new Error(await res.text());
                navigate(`/library/users/${encodeURIComponent(user.id)}`);
            })
            .catch(err => {
                console.error(err);
                setError('Failed to update user');
            });
    };

    if (!user) return <div className="user-edit-container">{error || 'Loading...'}</div>;

    return (
        <div className="user-edit-container">
            <div className="user-edit-card">
                <h2 className="user-edit-title">✏️ Edit User</h2>

                <form className="user-edit-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="First Name"
                        value={user.firstName}
                        onChange={handleChange('firstName')}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        value={user.lastName}
                        onChange={handleChange('lastName')}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={user.email}
                        readOnly
                    />
                    <input
                        type="text"
                        placeholder="Phone Number"
                        value={user.phoneNumber}
                        onChange={handleChange('phoneNumber')}
                        required
                    />

                    {user.dateOfBirth !== undefined && (
                        <input
                            type="date"
                            placeholder="Date of Birth"
                            value={user.dateOfBirth}
                            onChange={handleChange('dateOfBirth')}
                        />
                    )}

                    {user.salary !== undefined && (
                        <input
                            type="number"
                            placeholder="Salary"
                            value={user.salary}
                            onChange={handleChange('salary')}
                        />
                    )}

                    {error && <div className="user-edit-error">{error}</div>}

                    <div className="user-edit-actions">
                        <button type="submit" className="user-action-button">✅ Update</button>
                        <button type="button" className="user-action-button" onClick={() => navigate(-1)}>← Back</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserEditForm;
