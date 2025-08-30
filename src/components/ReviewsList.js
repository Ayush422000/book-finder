import React, { useState } from 'react';
import './ReviewsList.css';

const ReviewsList = ({ bookKey, reviews, onDeleteReview }) => {
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');

  const bookReviews = reviews.filter(review => review.bookKey === bookKey);

  const sortReviews = (reviews, sortBy) => {
    const sorted = [...reviews];
    
    switch (sortBy) {
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
      case 'highest':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'lowest':
        return sorted.sort((a, b) => a.rating - b.rating);
      case 'helpful':
        return sorted.sort((a, b) => b.helpful - a.helpful);
      default: // newest
        return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
  };

  const filterReviews = (reviews, filterBy) => {
    switch (filterBy) {
      case '5star':
        return reviews.filter(review => review.rating === 5);
      case '4star':
        return reviews.filter(review => review.rating === 4);
      case '3star':
        return reviews.filter(review => review.rating === 3);
      case '2star':
        return reviews.filter(review => review.rating === 2);
      case '1star':
        return reviews.filter(review => review.rating === 1);
      case 'recommended':
        return reviews.filter(review => review.wouldRecommend);
      default:
        return reviews;
    }
  };

  const processedReviews = sortReviews(filterReviews(bookReviews, filterBy), sortBy);

  const averageRating = bookReviews.length > 0 
    ? (bookReviews.reduce((sum, review) => sum + review.rating, 0) / bookReviews.length).toFixed(1)
    : 0;

  const recommendationPercentage = bookReviews.length > 0
    ? Math.round((bookReviews.filter(r => r.wouldRecommend).length / bookReviews.length) * 100)
    : 0;

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`star ${index < rating ? 'filled' : ''}`}>
        ⭐
      </span>
    ));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const reviewDate = new Date(dateString);
    const diffTime = Math.abs(now - reviewDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const handleHelpful = (reviewId) => {
    // This would update the helpful count - for now just a placeholder
    console.log('Marked review as helpful:', reviewId);
  };

  if (bookReviews.length === 0) {
    return (
      <div className="reviews-empty">
        <div className="reviews-empty-icon">💭</div>
        <h3>No reviews yet</h3>
        <p>Be the first to share your thoughts about this book!</p>
      </div>
    );
  }

  return (
    <div className="reviews-list-container">
      <div className="reviews-summary">
        <div className="reviews-stats">
          <div className="average-rating">
            <div className="rating-number">{averageRating}</div>
            <div className="rating-stars">{renderStars(Math.round(averageRating))}</div>
            <div className="rating-text">
              Based on {bookReviews.length} review{bookReviews.length !== 1 ? 's' : ''}
            </div>
          </div>
          
          <div className="recommendation-stat">
            <div className="recommendation-percent">{recommendationPercentage}%</div>
            <div className="recommendation-text">would recommend</div>
          </div>
        </div>
      </div>

      <div className="reviews-controls">
        <div className="control-group">
          <label htmlFor="sort-reviews">Sort by:</label>
          <select 
            id="sort-reviews"
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="control-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>
        
        <div className="control-group">
          <label htmlFor="filter-reviews">Filter:</label>
          <select 
            id="filter-reviews"
            value={filterBy} 
            onChange={(e) => setFilterBy(e.target.value)}
            className="control-select"
          >
            <option value="all">All Reviews</option>
            <option value="5star">5 Stars</option>
            <option value="4star">4 Stars</option>
            <option value="3star">3 Stars</option>
            <option value="2star">2 Stars</option>
            <option value="1star">1 Star</option>
            <option value="recommended">Recommended</option>
          </select>
        </div>
      </div>

      <div className="reviews-list">
        {processedReviews.map((review) => (
          <div key={review.id} className="review-item">
            <div className="review-header">
              <div className="review-user-info">
                <div className="review-avatar">
                  {review.username.charAt(0).toUpperCase()}
                </div>
                <div className="review-user-details">
                  <h4 className="review-username">{review.username}</h4>
                  <div className="review-rating">{renderStars(review.rating)}</div>
                </div>
              </div>
              
              <div className="review-meta">
                <div className="review-date" title={formatDate(review.date)}>
                  {getTimeAgo(review.date)}
                </div>
                {onDeleteReview && (
                  <button 
                    className="delete-review-button"
                    onClick={() => onDeleteReview(review.id)}
                    title="Delete this review"
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>

            <div className="review-content">
              <h5 className="review-title">{review.title}</h5>
              <p className="review-comment">{review.comment}</p>
              
              {review.wouldRecommend && (
                <div className="review-recommendation">
                  <span className="recommendation-badge">👍 Recommends this book</span>
                </div>
              )}
            </div>

            <div className="review-actions">
              <button 
                className="helpful-button"
                onClick={() => handleHelpful(review.id)}
              >
                👍 Helpful ({review.helpful})
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {processedReviews.length === 0 && filterBy !== 'all' && (
        <div className="no-filtered-reviews">
          <p>No reviews match the current filter.</p>
          <button 
            onClick={() => setFilterBy('all')}
            className="clear-filter-button"
          >
            Show All Reviews
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewsList;
