import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/RegistrationForm.css';

const RegistrationForm = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phoneNumber: '',
        dateOfBirth: '',
        salary: '',
        role: 'ROLE_CUSTOMER',
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const baseUrl = 'http://localhost:8080/library/auth/register';
        const endpoint =
            form.role === 'ROLE_CUSTOMER'
                ? `${baseUrl}/customer`
                : `${baseUrl}/employee`;

        const body = {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            password: form.password,
            phoneNumber: form.phoneNumber,
            ...(form.role === 'ROLE_CUSTOMER' && { dateOfBirth: form.dateOfBirth }),
            ...(form.role === 'ROLE_EMPLOYEE' && { salary: parseFloat(form.salary) }),
        };

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (!res.ok) throw new Error(await res.text());
            navigate('/library/login');
        } catch (err) {
            console.error(err);
            setError(err.message || 'Registration failed');
        }
    };

    return (
        <div className="registration-container">
            <div className="registration-card">
                <h2>📝 Register</h2>
                <form onSubmit={handleSubmit}>
                    <label>First Name:</label>
                    <input name="firstName" value={form.firstName} onChange={handleChange} required />

                    <label>Last Name:</label>
                    <input name="lastName" value={form.lastName} onChange={handleChange} required />

                    <label>Email:</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} required />

                    <label>Password:</label>
                    <input name="password" type="password" value={form.password} onChange={handleChange} required />

                    <label>Phone Number:</label>
                    <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} required />

                    <label>Type of User:</label>
                    <select name="role" value={form.role} onChange={handleChange}>
                        <option value="ROLE_CUSTOMER">Customer</option>
                        <option value="ROLE_EMPLOYEE">Employee</option>
                    </select>

                    {form.role === 'ROLE_CUSTOMER' && (
                        <>
                            <label>Date of Birth:</label>
                            <input name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} required />
                        </>
                    )}

                    {form.role === 'ROLE_EMPLOYEE' && (
                        <>
                            <label>Salary:</label>
                            <input name="salary" type="number" step="0.01" value={form.salary} onChange={handleChange} required />
                        </>
                    )}

                    {error && <div className="form-error">{error}</div>}

                    <button type="submit" className="btn-submit">Register</button>
                    <button type="button" className="btn-cancel" onClick={() => navigate('/library/login')}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default RegistrationForm;
