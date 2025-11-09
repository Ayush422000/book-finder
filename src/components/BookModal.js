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
  const description = getDescription();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <div className="modal-body">
          {/* Top Section: Cover, Title, Author, Rating, Favorite Button */}
          <div className="modal-header-section">
            <div className="modal-cover-wrapper">
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
                  </div>
                </div>
              )}
            </div>
            
            <div className="modal-header-info">
              <div className="modal-title-section">
                <h1 className="modal-title">{book.title}</h1>
                <h2 className="modal-author">by {formatAuthors(book.authors)}</h2>
                
                {reviewCount > 0 && (
                  <div className="modal-rating-inline">
                    <span className="rating-number">{averageRating}</span>
                    <div className="rating-stars-inline">
                      {Array.from({ length: 5 }, (_, index) => (
                        <span key={index} className={`star ${index < Math.round(averageRating) ? 'filled' : ''}`}>
                          ⭐
                        </span>
                      ))}
                    </div>
                    <span className="rating-text">({reviewCount})</span>
                  </div>
                )}
              </div>

              <button
                className={`modal-favorite-button ${isFavorite ? 'favorited' : ''}`}
                onClick={onToggleFavorite}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <span className="button-icon">{isFavorite ? '❤️' : '🤍'}</span>
                <span className="button-text">{isFavorite ? 'In Favorites' : 'Add to Favorites'}</span>
              </button>
            </div>
          </div>

          {/* Compact Meta Information */}
          <div className="modal-meta-compact">
            {book.first_publish_year && (
              <div className="meta-badge">
                <span className="meta-icon">📅</span>
                <span className="meta-text">{book.first_publish_year}</span>
              </div>
            )}
            {book.pages && (
              <div className="meta-badge">
                <span className="meta-icon">📄</span>
                <span className="meta-text">{book.pages}p</span>
              </div>
            )}
            {book.language && (
              <div className="meta-badge">
                <span className="meta-icon">🌍</span>
                <span className="meta-text">{book.language.toUpperCase()}</span>
              </div>
            )}
            {book.publisher && (
              <div className="meta-badge">
                <span className="meta-icon">🏢</span>
                <span className="meta-text">{book.publisher}</span>
              </div>
            )}
            {book.isbn && (
              <div className="meta-badge">
                <span className="meta-icon">🔢</span>
                <span className="meta-text">{book.isbn}</span>
              </div>
            )}
            {book.rating && (
              <div className="meta-badge">
                <span className="meta-icon">⭐</span>
                <span className="meta-text">{book.rating}/5</span>
              </div>
            )}
          </div>

          {/* Subjects */}
          {book.subjects && book.subjects.length > 0 && (
            <div className="modal-subjects-compact">
              {book.subjects.slice(0, 4).map((subject, index) => (
                <span key={index} className="subject-tag-compact">
                  {subject}
                </span>
              ))}
              {book.subjects.length > 4 && (
                <span className="subject-tag-compact more">
                  +{book.subjects.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Tabs Section */}
          <div className="modal-tabs-section">
            <div className="tab-buttons-compact">
              <button 
                className={`tab-button-compact ${activeTab === 'details' ? 'active' : ''}`}
                onClick={() => setActiveTab('details')}
                aria-label="View book details"
              >
                <span className="tab-icon">📖</span>
                <span>Details</span>
              </button>
              <button 
                className={`tab-button-compact ${activeTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setActiveTab('reviews')}
                aria-label="View reviews"
              >
                <span className="tab-icon">💭</span>
                <span>Reviews ({reviewCount})</span>
              </button>
            </div>
            
            <div className="tab-content-compact">
              {activeTab === 'details' && (
                <div className="details-tab-compact">
                  {loadingInfo ? (
                    <div className="loading-description-compact">
                      <div className="loading-spinner-small"></div>
                      <span>Loading description...</span>
                    </div>
                  ) : description ? (
                    <div className="modal-description-compact">
                      <p>{description.length > 300 ? `${description.substring(0, 300)}...` : description}</p>
                    </div>
                  ) : (
                    <div className="no-description">
                      <p>No description available for this book.</p>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'reviews' && (
                <div className="reviews-tab-compact">
                  <div className="reviews-header-compact">
                    {onOpenReviewModal && (
                      <button 
                        className="write-review-button-compact"
                        onClick={onOpenReviewModal}
                      >
                        <span>✍️</span>
                        <span>Write Review</span>
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
          
          {/* Action Buttons - Compact and Organized */}
          <div className="modal-actions-compact">
            <button 
              className="action-button-compact primary"
              onClick={() => {
                const searchQuery = `${book.title} ${book.authors[0]}`;
                window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery + ' buy book')}`, '_blank');
              }}
              aria-label="Find book to buy"
            >
              <svg className="action-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" fill="currentColor"/>
              </svg>
              <span>Buy</span>
            </button>
            
            <button 
              className="action-button-compact secondary"
              onClick={() => {
                const searchQuery = `${book.title} ${book.authors[0]}`;
                window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery + ' library')}`, '_blank');
              }}
              aria-label="Find book in library"
            >
              <svg className="action-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/>
              </svg>
              <span>Library</span>
            </button>
            
            {book.key && (
              <button 
                className="action-button-compact secondary"
                onClick={() => {
                  window.open(`https://openlibrary.org${book.key}`, '_blank');
                }}
                aria-label="View on Open Library"
              >
                <svg className="action-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" fill="currentColor"/>
                </svg>
                <span>Open Library</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookModal;
