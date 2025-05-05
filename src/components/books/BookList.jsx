import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './сss/BookList.css';

const BookList = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isTableView, setIsTableView] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:8080/library/books', {
            method: 'GET',
            credentials: 'include',
        })
            .then(async (response) => {
                if (!response.ok) {
                    const text = await response.text();
                    navigate('/error', {
                        state: {
                            status: response.status,
                            message: text || 'Unknown error'
                        }
                    });
                    throw new Error('Redirecting to error page');
                }
                return response.json();
            })
            .then((data) => {
                setBooks(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [navigate]);

    return (
        <div className="book-list-background">
            <div className="book-list-wrapper">
                <h2 className="book-list-title">📖 Book Catalog</h2>

                <div className="book-list-buttons">
                    <button className="book-list-button nav" onClick={() => navigate('/library')}>
                        ← Back to Home
                    </button>
                    <button
                        className="book-list-button toggle"
                        onClick={() => setIsTableView((prev) => !prev)}
                    >
                        {isTableView ? '📦 Card View' : '📋 Table View'}
                    </button>
                    <button className="book-list-button create" onClick={() => navigate('/library/books/create')}>
                        ➕ Add New Book
                    </button>

                </div>

                {loading && <p className="text-center">Loading...</p>}

                {!loading && isTableView ? (
                    <table className="table table-bordered mt-4">
                        <thead className="table-light">
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {books.map((book) => (
                            <tr key={book.id}>
                                <td>{book.id}</td>
                                <td>{book.title}</td>
                                <td>{book.author}</td>
                                <td>{book.description}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => navigate(`/library/books/${book.id}`)}
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="book-list-grid">
                        {books.map((book) => (
                            <div key={book.id} className="book-list-card">
                                <div className="book-list-field">
                                    <span className="book-list-label">📘 Title:</span> {book.title}
                                </div>
                                <div className="book-list-field">
                                    <span className="book-list-label">✍️ Author:</span> {book.author}
                                </div>
                                <div className="book-list-field">
                                    <span className="book-list-label">📝 Description:</span> {book.description}
                                </div>
                                <button
                                    className="book-list-view"
                                    onClick={() => navigate(`/library/books/${book.id}`)}
                                >
                                    View Details
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookList;
