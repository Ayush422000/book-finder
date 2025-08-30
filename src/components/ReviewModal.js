import React, { useState, useEffect } from 'react';
import './ReviewModal.css';

const ReviewModal = ({ book, onClose, onSubmitReview }) => {
  const [reviewData, setReviewData] = useState({
    rating: 5,
    title: '',
    comment: '',
    username: '',
    wouldRecommend: true
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const validateForm = () => {
    const newErrors = {};

    if (!reviewData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (reviewData.username.trim().length < 2) {
      newErrors.username = 'Username must be at least 2 characters';
    }

    if (!reviewData.title.trim()) {
      newErrors.title = 'Review title is required';
    } else if (reviewData.title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    if (!reviewData.comment.trim()) {
      newErrors.comment = 'Review comment is required';
    } else if (reviewData.comment.trim().length < 10) {
      newErrors.comment = 'Comment must be at least 10 characters';
    }

    if (reviewData.rating < 1 || reviewData.rating > 5) {
      newErrors.rating = 'Rating must be between 1 and 5 stars';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const review = {
      id: Date.now() + Math.random(), // Simple unique ID
      bookKey: book.key,
      bookTitle: book.title,
      bookAuthor: book.authors[0] || 'Unknown Author',
      rating: reviewData.rating,
      title: reviewData.title.trim(),
      comment: reviewData.comment.trim(),
      username: reviewData.username.trim(),
      wouldRecommend: reviewData.wouldRecommend,
      date: new Date().toISOString(),
      helpful: 0 // For future helpful votes feature
    };

    onSubmitReview(review);
    onClose();
  };

  const handleInputChange = (field, value) => {
    setReviewData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const renderStars = (rating, isInteractive = false) => {
    return Array.from({ length: 5 }, (_, index) => (
      <button
        key={index}
        type="button"
        className={`star ${index < rating ? 'filled' : ''} ${isInteractive ? 'interactive' : ''}`}
        onClick={isInteractive ? () => handleInputChange('rating', index + 1) : undefined}
        disabled={!isInteractive}
      >
        ⭐
      </button>
    ));
  };

  return (
    <div className="review-modal-overlay" onClick={onClose}>
      <div className="review-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="review-modal-header">
          <h2>📝 Write a Review</h2>
          <button className="review-modal-close" onClick={onClose} aria-label="Close review modal">
            ✕
          </button>
        </div>

        <div className="review-book-info">
          <div className="review-book-cover">
            {book.cover_url ? (
              <img src={book.cover_url} alt={`Cover of ${book.title}`} />
            ) : (
              <div className="review-book-placeholder">📖</div>
            )}
          </div>
          <div className="review-book-details">
            <h3>{book.title}</h3>
            <p>by {book.authors.join(', ')}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="review-form">
          <div className="form-group">
            <label htmlFor="username">Your Name *</label>
            <input
              id="username"
              type="text"
              value={reviewData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              placeholder="Enter your name or username"
              className={errors.username ? 'error' : ''}
              maxLength={50}
            />
            {errors.username && <span className="error-text">{errors.username}</span>}
          </div>

          <div className="form-group">
            <label>Your Rating *</label>
            <div className="rating-input">
              {renderStars(reviewData.rating, true)}
              <span className="rating-text">{reviewData.rating} out of 5 stars</span>
            </div>
            {errors.rating && <span className="error-text">{errors.rating}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="review-title">Review Title *</label>
            <input
              id="review-title"
              type="text"
              value={reviewData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Summarize your review in a few words"
              className={errors.title ? 'error' : ''}
              maxLength={100}
            />
            <div className="char-count">{reviewData.title.length}/100</div>
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="review-comment">Your Review *</label>
            <textarea
              id="review-comment"
              value={reviewData.comment}
              onChange={(e) => handleInputChange('comment', e.target.value)}
              placeholder="Share your thoughts about this book... What did you like or dislike? Would you recommend it to others?"
              className={errors.comment ? 'error' : ''}
              rows={5}
              maxLength={1000}
            />
            <div className="char-count">{reviewData.comment.length}/1000</div>
            {errors.comment && <span className="error-text">{errors.comment}</span>}
          </div>

          <div className="form-group">
            <label className="recommendation-label">
              <input
                type="checkbox"
                checked={reviewData.wouldRecommend}
                onChange={(e) => handleInputChange('wouldRecommend', e.target.checked)}
              />
              <span className="checkmark">✓</span>
              I would recommend this book to others
            </label>
          </div>

          <div className="review-form-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="submit-button">
              📝 Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
