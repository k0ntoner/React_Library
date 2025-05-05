import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './сss/CreateBookForm.css';

const CreateBookForm = () => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const book = { title, author, description };

        try {
            const response = await fetch('http://localhost:8080/library/books', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(book)
            });

            if (!response.ok) {
                const text = await response.text();
                setError(text || 'Creation failed');
                return;
            }

            navigate('/library/books');
        } catch (err) {
            console.error(err);
            setError('Failed to connect to the server');
        }
    };

    return (
        <div className="book-create-container">
            <div className="book-create-card">
                <h2 className="book-create-title">📘 Add a New Book</h2>

                <form onSubmit={handleSubmit}>
                    <div className="book-create-group">
                        <label>Title:</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="book-create-group">
                        <label>Author:</label>
                        <input
                            type="text"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            required
                        />
                    </div>

                    <div className="book-create-group">
                        <label>Description:</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="4"
                        />
                    </div>

                    {error && <div className="book-create-error">{error}</div>}

                    <div className="book-create-actions">
                        <button type="submit" className="book-create-submit">➕ Create Book</button>
                        <button
                            type="button"
                            className="book-create-cancel"
                            onClick={() => navigate('/library/books')}
                        >
                            ← Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateBookForm;
