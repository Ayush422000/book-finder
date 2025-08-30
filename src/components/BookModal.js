import React, { useState, useEffect } from 'react';
import './BookModal.css';
import ReviewsList from './ReviewsList';

const BookModal = ({ 
  book, 
  isFavorite, 
  onToggleFavorite, 
  onClose, 
  reviews, 
  getBookReviews, 
  getBookAverageRating, 
  onDeleteReview, 
  onOpenReviewModal 
}) => {
  const [imageError, setImageError] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState(null);
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

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

  useEffect(() => {
    const fetchAdditionalInfo = async () => {
      if (!book.key) return;

      setLoadingInfo(true);
      try {
        const response = await fetch(`https://openlibrary.org${book.key}.json`);
        if (response.ok) {
          const data = await response.json();
          setAdditionalInfo(data);
        }
      } catch (error) {
        console.error('Failed to fetch additional book info:', error);
      } finally {
        setLoadingInfo(false);
      }
    };

    fetchAdditionalInfo();
  }, [book.key]);

  const formatAuthors = (authors) => {
    if (!authors || authors.length === 0) return 'Unknown Author';
    return authors.join(', ');
  };

  const getDescription = () => {
    if (additionalInfo?.description) {
      if (typeof additionalInfo.description === 'string') {
        return additionalInfo.description;
      }
      if (additionalInfo.description.value) {
        return additionalInfo.description.value;
      }
    }
    return null;
  };

  const largeCoverUrl = book.cover_id 
    ? `https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg`
    : null;

  const bookReviews = getBookReviews ? getBookReviews(book.key) : [];
  const averageRating = getBookAverageRating ? getBookAverageRating(book.key) : 0;
  const reviewCount = bookReviews.length;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          ✕
        </button>
        
        <div className="modal-body">
          <div className="modal-cover-section">
            {largeCoverUrl && !imageError ? (
              <img
                src={largeCoverUrl}
                alt={`Cover of ${book.title}`}
                className="modal-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="modal-cover-placeholder">
                <div className="placeholder-content">
                  <div className="book-icon">📖</div>
                  <div className="placeholder-title">{book.title}</div>
                </div>
              </div>
            )}
            
            <button
              className={`modal-favorite-button ${isFavorite ? 'favorited' : ''}`}
              onClick={onToggleFavorite}
            >
              {isFavorite ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
            </button>
          </div>
          
          <div className="modal-info-section">
            <h1 className="modal-title">{book.title}</h1>
            <h2 className="modal-author">by {formatAuthors(book.authors)}</h2>
            
            {reviewCount > 0 && (
              <div className="modal-rating-summary">
                <div className="rating-display">
                  <span className="rating-number">{averageRating}</span>
                  <div className="rating-stars">
                    {Array.from({ length: 5 }, (_, index) => (
                      <span key={index} className={`star ${index < Math.round(averageRating) ? 'filled' : ''}`}>
                        ⭐
                      </span>
                    ))}
                  </div>
                  <span className="rating-text">
                    ({reviewCount} review{reviewCount !== 1 ? 's' : ''})
                  </span>
                </div>
              </div>
            )}
            
            <div className="modal-meta">
              {book.first_publish_year && (
                <div className="meta-item">
                  <span className="meta-label">📅 Published:</span>
                  <span className="meta-value">{book.first_publish_year}</span>
                </div>
              )}
              
              {book.publisher && (
                <div className="meta-item">
                  <span className="meta-label">🏢 Publisher:</span>
                  <span className="meta-value">{book.publisher}</span>
                </div>
              )}
              
              {book.isbn && (
                <div className="meta-item">
                  <span className="meta-label">🔢 ISBN:</span>
                  <span className="meta-value">{book.isbn}</span>
                </div>
              )}
              
              {book.pages && (
                <div className="meta-item">
                  <span className="meta-label">📄 Pages:</span>
                  <span className="meta-value">{book.pages}</span>
                </div>
              )}
              
              {book.rating && (
                <div className="meta-item">
                  <span className="meta-label">⭐ Rating:</span>
                  <span className="meta-value">{book.rating}/5</span>
                </div>
              )}
              
              {book.language && (
                <div className="meta-item">
                  <span className="meta-label">🌍 Language:</span>
                  <span className="meta-value">{book.language.toUpperCase()}</span>
                </div>
              )}
            </div>
            
            {book.subjects && book.subjects.length > 0 && (
              <div className="modal-subjects">
                <h3>🏷️ Subjects</h3>
                <div className="subjects-list">
                  {book.subjects.map((subject, index) => (
                    <span key={index} className="subject-tag">
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {loadingInfo && (
              <div className="loading-description">
                <div className="loading-spinner"></div>
                <span>Loading description...</span>
              </div>
            )}
            
            <div className="modal-tabs">
              <div className="tab-buttons">
                <button 
                  className={`tab-button ${activeTab === 'details' ? 'active' : ''}`}
                  onClick={() => setActiveTab('details')}
                >
                  📖 Details
                </button>
                <button 
                  className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
                  onClick={() => setActiveTab('reviews')}
                >
                  💭 Reviews ({reviewCount})
                </button>
              </div>
              
              <div className="tab-content">
                {activeTab === 'details' && (
                  <div className="details-tab">
                    {getDescription() && (
                      <div className="modal-description">
                        <h3>📝 Description</h3>
                        <p>{getDescription()}</p>
                      </div>
                    )}
                  </div>
                )}
                
                {activeTab === 'reviews' && (
                  <div className="reviews-tab">
                    <div className="reviews-tab-header">
                      <h3>User Reviews</h3>
                      {onOpenReviewModal && (
                        <button 
                          className="write-review-button"
                          onClick={onOpenReviewModal}
                        >
                          ✍️ Write a Review
                        </button>
                      )}
                    </div>
                    
                    <ReviewsList
                      bookKey={book.key}
                      reviews={reviews || []}
                      onDeleteReview={onDeleteReview}
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className="action-button primary"
                onClick={() => {
                  const searchQuery = `${book.title} ${book.authors[0]}`;
                  window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery + ' buy book')}`, '_blank');
                }}
              >
                🛒 Find to Buy
              </button>
              
              <button 
                className="action-button secondary"
                onClick={() => {
                  const searchQuery = `${book.title} ${book.authors[0]}`;
                  window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery + ' library')}`, '_blank');
                }}
              >
                🏛️ Find in Library
              </button>
              
              {book.key && (
                <button 
                  className="action-button secondary"
                  onClick={() => {
                    window.open(`https://openlibrary.org${book.key}`, '_blank');
                  }}
                >
                  🔗 View on Open Library
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookModal;
