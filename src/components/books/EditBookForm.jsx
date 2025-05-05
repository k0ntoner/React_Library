import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './сss/EditBookForm.css';

const EditBookForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch(`http://localhost:8080/library/books/${id}`, {
            method: 'GET',
            credentials: 'include'
        })
            .then(async (response) => {
                if (!response.ok) throw new Error(await response.text());
                return response.json();
            })
            .then(setBook)
            .catch((err) => {
                console.error(err);
                setError('Failed to fetch book data');
            });
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/library/books`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: book.title,
                    author: book.author,
                    description: book.description
                })
            });

            if (!response.ok) throw new Error(await response.text());
            navigate(`/library/books/${id}`);
        } catch (err) {
            console.error(err);
            setError(err.message || 'Update failed');
        }
    };

    const handleChange = (field) => (e) => {
        setBook((prev) => ({ ...prev, [field]: e.target.value }));
    };

    if (!book) {
        return <div className="book-edit-container">Loading book data...</div>;
    }

    return (
        <div className="book-edit-container">
            <div className="book-edit-card">
                <h2 className="book-edit-title">✏️ Edit Book</h2>

                <form onSubmit={handleSubmit}>
                    <div className="book-edit-group">
                        <label>ID (read-only):</label>
                        <input type="text" value={book.id} readOnly />
                    </div>

                    <div className="book-edit-group">
                        <label>Title:</label>
                        <input type="text" value={book.title} onChange={handleChange('title')} required />
                    </div>

                    <div className="book-edit-group">
                        <label>Author:</label>
                        <input type="text" value={book.author} onChange={handleChange('author')} required />
                    </div>

                    <div className="book-edit-group">
                        <label>Description:</label>
                        <textarea value={book.description} onChange={handleChange('description')} rows="4" />
                    </div>

                    {error && <div className="book-edit-error">{error}</div>}

                    <div className="book-edit-actions">
                        <button type="submit" className="book-edit-submit">💾 Update</button>
                        <button type="button" className="book-edit-cancel" onClick={() => navigate(`/library/books/${id}`)}>
                            ← Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditBookForm;
