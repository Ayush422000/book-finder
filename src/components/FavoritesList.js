import React from 'react';
import BookCard from './BookCard';
import './FavoritesList.css';

const FavoritesList = ({ favorites, onToggleFavorite, onBookClick }) => {
  if (favorites.length === 0) {
    return (
      <div className="favorites-empty">
        <div className="favorites-empty-icon">💔</div>
        <h2>No favorites yet</h2>
        <p>Start exploring and add books to your favorites by clicking the heart icon!</p>
        <div className="favorites-tips">
          <h3>💡 Why use favorites?</h3>
          <ul>
            <li>Keep track of books you want to read</li>
            <li>Create your personal reading list</li>
            <li>Easily find books you've bookmarked</li>
            <li>Never forget a book recommendation</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-container">
      <div className="favorites-header">
        <h2>❤️ Your Favorite Books</h2>
        <p className="favorites-count">
          {favorites.length} book{favorites.length !== 1 ? 's' : ''} saved
        </p>
      </div>
      
      <div className="favorites-grid">
        {favorites.map((book) => (
          <BookCard
            key={book.key}
            book={book}
            isFavorite={true}
            onToggleFavorite={() => onToggleFavorite(book)}
            onBookClick={() => onBookClick(book)}
          />
        ))}
      </div>
      
      <div className="favorites-footer">
        <p className="favorites-note">
          💾 Your favorites are automatically saved in your browser
        </p>
      </div>
    </div>
  );
};

export default FavoritesList;
