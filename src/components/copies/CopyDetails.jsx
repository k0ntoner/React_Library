import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './css/CopyDetails.css';

const CopyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [copy, setCopy] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteError, setDeleteError] = useState('');

    useEffect(() => {
        fetch(`http://localhost:8080/library/copies/${id}`, {
            method: 'GET',
            credentials: 'include',
        })
            .then(async (response) => {
                if (!response.ok) throw new Error(await response.text());
                return response.json();
            })
            .then((data) => {
                setCopy(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    const confirmDelete = async () => {
        setShowConfirm(false);
        setDeleteError('');
        try {
            const response = await fetch(`http://localhost:8080/library/copies/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!response.ok) throw new Error(await response.text());
            navigate('/library/copies');
        } catch (err) {
            console.error(err);
            setDeleteError(err.message || 'Failed to delete copy');
        }
    };

    if (loading) return <div className="copy-details-page-container">Loading...</div>;
    if (!copy) return <div className="copy-details-page-container">Copy not found.</div>;

    return (
        <div className="copy-details-page-container">

            <div className="copy-details-card">
                <div className="copy-details-header">
                    <span className="copy-header-icon">📕</span>
                    <h1 className="copy-details-title">Copy #{copy.id}</h1>
                </div>

                <div className="copy-details-meta">
                    <div className="copy-meta-row">
                        <span className="copy-meta-label">Book:</span>
                        <span className="copy-meta-content">{copy.bookDto.title}</span>
                    </div>
                    <div className="copy-meta-row">
                        <span className="copy-meta-label">Status:</span>
                        <span className={`copy-meta-content ${copy.status === 'BORROWED' ? 'copy-status-borrowed' : ''}`}>
                        {copy.status}
                    </span>
                    </div>
                </div>

                <div className="copy-button-group">
                    <button className="copy-action-button copy-delete-button" onClick={() => setShowConfirm(true)}>
                        🗑️ Delete
                    </button>
                    <button className="copy-action-button copy-edit-button" onClick={() => navigate(`/library/copies/${id}/edit`)}>
                        ✏️ Edit
                    </button>
                    <button className="copy-action-button copy-back-button" onClick={() => navigate('/library/copies')}>
                        ← Back
                    </button>
                </div>
                {deleteError && (
                    <div className="copy-delete-error-banner">
                        ❌ {deleteError}
                    </div>
                )}
            </div>

            {showConfirm && (
                <div className="copy-confirm-modal-overlay">
                    <div className="copy-confirm-modal">
                        <p>Are you sure you want to delete this copy?</p>
                        <div className="copy-confirm-modal-actions">
                            <button className="copy-confirm-modal-confirm" onClick={confirmDelete}>Yes, Delete</button>
                            <button className="copy-confirm-modal-cancel" onClick={() => setShowConfirm(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

};

export default CopyDetails;
