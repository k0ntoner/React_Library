import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './сss/BookDetails.css';

const BookDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteError, setDeleteError] = useState('');

    useEffect(() => {
        fetch(`http://localhost:8080/library/books/${id}`, {
            method: 'GET',
            credentials: 'include',
        })
            .then(async (response) => {
                if (!response.ok) {
                    const text = await response.text();
                    navigate('/error', {
                        state: { status: response.status, message: text || 'Unknown error' },
                    });
                    throw new Error('Redirecting to error page');
                }
                return response.json();
            })
            .then((data) => {
                setBook(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [id, navigate]);

    const handleDeleteClick = () => {
        setShowConfirm(true);
    };

    const confirmDelete = async () => {
        setShowConfirm(false);
        setDeleteError('');
        try {
            const response = await fetch(`http://localhost:8080/library/books/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!response.ok) {
                const text = await response.text();
                setDeleteError(text || 'Failed to delete book');
                return;
            }

            navigate('/library/books');
        } catch (error) {
            console.error(error);
            setDeleteError('Something went wrong while deleting the book');
        }
    };

    if (loading) return <div className="book-details-page-container">Loading...</div>;
    if (!book) return <div className="book-details-page-container">Book not found.</div>;

    return (
        <div className="book-details-page-container">

            <div className="book-details-card">
                <div className="book-details-header">
                    <span className="book-header-icon">📘</span>
                    <h1 className="book-details-title">{book.title}</h1>
                </div>

                <div className="book-details-meta">
                    <div className="book-meta-row">
                        <span className="book-meta-label">Author:</span>
                        <span className="book-meta-content">{book.author}</span>
                    </div>
                    <div className="book-meta-row">
                        <span className="book-meta-label">ID:</span>
                        <span className="book-meta-content">{book.id}</span>
                    </div>
                    <div className="book-meta-row">
                        <span className="book-meta-label">Description:</span>
                    </div>
                    <div className="book-details-description">
                        {book.description || 'No description provided.'}
                    </div>
                </div>

                <div className="book-button-group">
                    <button className="book-action-button book-delete-button" onClick={handleDeleteClick}>
                        🗑️ Delete Book
                    </button>
                    <button className="book-action-button book-edit-button" onClick={() => navigate(`/library/books/${id}/edit`)}>
                        ✏️ Edit Book
                    </button>
                    <button className="book-action-button book-back-button" onClick={() => navigate('/library/books')}>
                        ← Back to Catalog
                    </button>
                </div>
                {deleteError && (
                    <div className="book-delete-error-banner">
                        ❌ {deleteError}
                    </div>
                )}
            </div>

            {showConfirm && (
                <div className="book-confirm-modal-overlay">
                    <div className="book-confirm-modal">
                        <p>Are you sure you want to delete this book?</p>
                        <div className="book-confirm-modal-actions">
                            <button onClick={confirmDelete} className="book-confirm-modal-confirm">Yes, Delete</button>
                            <button onClick={() => setShowConfirm(false)} className="book-confirm-modal-cancel">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookDetails;
