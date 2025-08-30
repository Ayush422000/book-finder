import React, { useState } from 'react';
import BookCard from './BookCard';
import './BookList.css';

const BookList = ({ books, onToggleFavorite, isFavorite, onBookClick, getBookReviews, getBookAverageRating }) => {
  const [sortBy, setSortBy] = useState('relevance');
  const [filterBy, setFilterBy] = useState('all');

  const sortBooks = (books, sortBy) => {
    const sortedBooks = [...books];
    
    switch (sortBy) {
      case 'title':
        return sortedBooks.sort((a, b) => a.title.localeCompare(b.title));
      case 'author':
        return sortedBooks.sort((a, b) => 
          (a.authors[0] || '').localeCompare(b.authors[0] || '')
        );
      case 'year':
        return sortedBooks.sort((a, b) => 
          (b.first_publish_year || 0) - (a.first_publish_year || 0)
        );
      case 'rating':
        return sortedBooks.sort((a, b) => 
          (b.rating || 0) - (a.rating || 0)
        );
      default:
        return sortedBooks;
    }
  };

  const filterBooks = (books, filterBy) => {
    switch (filterBy) {
      case 'recent':
        return books.filter(book => 
          book.first_publish_year && book.first_publish_year >= 2010
        );
      case 'classic':
        return books.filter(book => 
          book.first_publish_year && book.first_publish_year < 1990
        );
      case 'rated':
        return books.filter(book => book.rating && book.rating >= 4.0);
      case 'with-cover':
        return books.filter(book => book.cover_url);
      default:
        return books;
    }
  };

  const processedBooks = sortBooks(filterBooks(books, filterBy), sortBy);

  if (books.length === 0) {
    return (
      <div className="no-results">
        <div className="no-results-icon">📚</div>
        <h2>Ready to find your next book?</h2>
        <p>Search by title, author, subject, ISBN, or publisher to get started!</p>
        <div className="search-tips">
          <h3>💡 Search Tips:</h3>
          <ul>
            <li>Try searching for specific titles like "Harry Potter"</li>
            <li>Look up your favorite authors like "Stephen King"</li>
            <li>Explore subjects like "Science Fiction" or "Romance"</li>
            <li>Search by ISBN for exact book editions</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="book-list-container">
      <div className="book-list-header">
        <div className="results-info">
          <h2>Found {books.length} books</h2>
          {filterBy !== 'all' && (
            <span className="filter-info">
              (showing {processedBooks.length} after filtering)
            </span>
          )}
        </div>
        
        <div className="controls">
          <div className="control-group">
            <label htmlFor="sort-select">Sort by:</label>
            <select 
              id="sort-select"
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="control-select"
            >
              <option value="relevance">Relevance</option>
              <option value="title">Title (A-Z)</option>
              <option value="author">Author (A-Z)</option>
              <option value="year">Publication Year</option>
              <option value="rating">Rating</option>
            </select>
          </div>
          
          <div className="control-group">
            <label htmlFor="filter-select">Filter:</label>
            <select 
              id="filter-select"
              value={filterBy} 
              onChange={(e) => setFilterBy(e.target.value)}
              className="control-select"
            >
              <option value="all">All Books</option>
              <option value="recent">Recent (2010+)</option>
              <option value="classic">Classic (pre-1990)</option>
              <option value="rated">Highly Rated (4.0+)</option>
              <option value="with-cover">With Cover Image</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="book-grid">
        {processedBooks.map((book) => (
          <BookCard
            key={book.key}
            book={book}
            isFavorite={isFavorite(book.key)}
            onToggleFavorite={() => onToggleFavorite(book)}
            onBookClick={() => onBookClick(book)}
            getBookReviews={getBookReviews}
            getBookAverageRating={getBookAverageRating}
          />
        ))}
      </div>
      
      {processedBooks.length === 0 && filterBy !== 'all' && (
        <div className="no-filtered-results">
          <p>No books match the current filter. Try adjusting your filter criteria.</p>
          <button 
            onClick={() => setFilterBy('all')}
            className="clear-filter-button"
          >
            Show All Results
          </button>
        </div>
      )}
    </div>
  );
};

export default BookList;
