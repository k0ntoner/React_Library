import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './css/EditCopyForm.css';

const EditCopyForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [copy, setCopy] = useState(null);
    const [books, setBooks] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch(`http://localhost:8080/library/copies/${id}`, {
            method: 'GET',
            credentials: 'include',
        })
            .then(async (res) => {
                if (!res.ok) throw new Error(await res.text());
                return res.json();
            })
            .then(setCopy)
            .catch((err) => {
                console.error(err);
                setError('Failed to fetch copy data');
            });

        fetch('http://localhost:8080/library/books', {
            method: 'GET',
            credentials: 'include',
        })
            .then((res) => res.json())
            .then(setBooks)
            .catch((err) => {
                console.error(err);
                setError('Failed to fetch books');
            });
    }, [id]);

    const handleBookChange = (e) => {
        const selectedId = parseInt(e.target.value);
        const selectedBook = books.find((book) => book.id === selectedId);
        setCopy((prev) => ({ ...prev, bookDto: selectedBook }));
    };

    const handleStatusChange = (e) => {
        setCopy((prev) => ({ ...prev, status: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/library/copies`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: copy.id,
                    bookDto: copy.bookDto,
                    status: copy.status
                }),
            });

            if (!response.ok) throw new Error(await response.text());
            navigate(`/library/copies/${id}`);
        } catch (err) {
            console.error(err);
            setError(err.message || 'Update failed');
        }
    };

    if (!copy) return <div className="copy-edit-form-container">Loading...</div>;

    return (
        <div className="copy-edit-form-container">
            <div className="copy-edit-form-card">
                <h2 className="copy-edit-form-title">✏️ Edit Book Copy</h2>

                <form onSubmit={handleSubmit}>
                    <div className="copy-form-group">
                        <label>Copy ID (read-only):</label>
                        <input type="text" value={copy.id} readOnly />
                    </div>

                    <div className="copy-form-group">
                        <label>Book:</label>
                        <select value={copy.bookDto.id} onChange={handleBookChange} required>
                            {books.map((book) => (
                                <option key={book.id} value={book.id}>
                                    {book.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="copy-form-group">
                        <label>Status:</label>
                        <select value={copy.status} onChange={handleStatusChange} required>
                            <option value="AVAILABLE">AVAILABLE</option>
                            <option value="BORROWED">BORROWED</option>
                        </select>
                    </div>

                    {error && <div className="copy-edit-form-error">{error}</div>}

                    <div className="copy-form-actions">
                        <button type="submit" className="copy-edit-form-submit">💾 Update</button>
                        <button
                            type="button"
                            className="copy-edit-form-cancel"
                            onClick={() => navigate(`/library/copies/${id}`)}
                        >
                            ← Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCopyForm;
