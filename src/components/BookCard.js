import React, { useState } from 'react';
import './BookCard.css';

const BookCard = ({ book, isFavorite, onToggleFavorite, onBookClick, getBookReviews, getBookAverageRating }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  const formatAuthors = (authors) => {
    if (!authors || authors.length === 0) return 'Unknown Author';
    if (authors.length === 1) return authors[0];
    if (authors.length === 2) return authors.join(' & ');
    return `${authors[0]} & ${authors.length - 1} others`;
  };

  // Get review data if functions are available
  const reviewCount = getBookReviews ? getBookReviews(book.key).length : 0;
  const averageRating = getBookAverageRating ? parseFloat(getBookAverageRating(book.key)) : 0;

  return (
    <div className="book-card" onClick={onBookClick}>
      <div className="book-cover-container">
        {book.cover_url && !imageError ? (
          <>
            {imageLoading && (
              <div className="cover-placeholder loading">
                <div className="loading-spinner"></div>
              </div>
            )}
            <img
              src={book.cover_url}
              alt={`Cover of ${book.title}`}
              className={`book-cover ${imageLoading ? 'hidden' : ''}`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </>
        ) : (
          <div className="cover-placeholder">
            <div className="placeholder-content">
              <div className="book-icon">📖</div>
              <div className="placeholder-title">
                {truncateText(book.title, 30)}
              </div>
            </div>
          </div>
        )}
        
        <button
          className={`favorite-button ${isFavorite ? 'favorited' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>
      
      <div className="book-info">
        <h3 className="book-title" title={book.title}>
          {truncateText(book.title, 50)}
        </h3>
        
        <p className="book-author" title={formatAuthors(book.authors)}>
          by {truncateText(formatAuthors(book.authors), 40)}
        </p>
        
        <div className="book-meta">
          {book.first_publish_year && (
            <span className="publish-year">📅 {book.first_publish_year}</span>
          )}
          
          {/* Show user reviews rating if available, otherwise show API rating */}
          {averageRating > 0 ? (
            <span className="rating user-rating">⭐ {averageRating} ({reviewCount})</span>
          ) : book.rating ? (
            <span className="rating">⭐ {book.rating}</span>
          ) : null}
          
          {book.pages && (
            <span className="pages">📄 {book.pages}p</span>
          )}
        </div>
        
        {book.subjects && book.subjects.length > 0 && (
          <div className="book-subjects">
            {book.subjects.slice(0, 2).map((subject, index) => (
              <span key={index} className="subject-tag">
                {truncateText(subject, 15)}
              </span>
            ))}
            {book.subjects.length > 2 && (
              <span className="subject-tag more">
                +{book.subjects.length - 2}
              </span>
            )}
          </div>
        )}
        
        {book.publisher && (
          <p className="book-publisher">
            🏢 {truncateText(book.publisher, 30)}
          </p>
        )}
      </div>
    </div>
  );
};

export default BookCard;
