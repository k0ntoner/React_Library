    import React, { useEffect, useState } from 'react';
    import { useNavigate } from 'react-router-dom';
    import './css/CreateCopyForm.css';

    const CreateCopyForm = () => {
        const [bookId, setBookId] = useState('');
        const [status, setStatus] = useState('AVAILABLE');
        const [books, setBooks] = useState([]);
        const [error, setError] = useState('');
        const navigate = useNavigate();

        useEffect(() => {
            fetch('http://localhost:8080/library/books', {
                method: 'GET',
                credentials: 'include'
            })
                .then((res) => res.json())
                .then(setBooks)
                .catch((err) => {
                    console.error(err);
                    setError('Failed to load books');
                });
        }, []);

        const handleSubmit = async (e) => {
            e.preventDefault();
            try {
                const selectedBook = books.find(book => String(book.id) === String(bookId));
                if (!selectedBook) {
                    throw new Error("Selected book not found");
                }

                const payload = {
                    bookDto: selectedBook,
                    status: status
                };

                const response = await fetch('http://localhost:8080/library/copies', {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) throw new Error(await response.text());
                navigate('/library/copies');
            } catch (err) {
                console.error(err);
                setError(err.message || 'Creation failed');
            }
        };


        return (
            <div className="copy-create-form-container">
                <div className="copy-create-form-card">
                    <h2 className="copy-create-form-title">➕ Add New Book Copy</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="copy-form-group">
                            <label>Book:</label>
                            <select
                                value={bookId}
                                onChange={(e) => setBookId(e.target.value)}
                                required
                            >
                                <option value="">Select a book</option>
                                {books.map((book) => (
                                    <option key={book.id} value={book.id}>
                                        {book.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="copy-form-group">
                            <label>Status:</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="AVAILABLE">AVAILABLE</option>
                                <option value="BORROWED">BORROWED</option>
                            </select>
                        </div>

                        {error && <div className="copy-create-form-error">{error}</div>}

                        <div className="copy-form-actions">
                            <button type="submit" className="copy-create-form-submit">Create</button>
                            <button
                                type="button"
                                className="copy-create-form-cancel"
                                onClick={() => navigate('/library/copies')}
                            >
                                ← Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    export default CreateCopyForm;
