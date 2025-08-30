import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = () => {
  return (
    <div className="loading-container">
      <div className="loading-spinner-wrapper">
        <div className="loading-spinner"></div>
        <div className="loading-books">
          <span className="book-icon">📚</span>
          <span className="book-icon">📖</span>
          <span className="book-icon">📕</span>
        </div>
      </div>
      <h3 className="loading-text">Searching for books...</h3>
      <p className="loading-subtext">This may take a moment</p>
    </div>
  );
};

export default LoadingSpinner;
