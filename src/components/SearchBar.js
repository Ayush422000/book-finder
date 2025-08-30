import React, { useState, useRef } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch, searchHistory, onClearHistory }) => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('title');
  const [showHistory, setShowHistory] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), searchType);
      setShowHistory(false);
    }
  };

  const handleHistoryClick = (historyItem) => {
    setQuery(historyItem.query);
    setSearchType(historyItem.type);
    setShowHistory(false);
    onSearch(historyItem.query, historyItem.type);
  };

  const searchTypes = [
    { value: 'title', label: '📖 Title', placeholder: 'e.g., The Great Gatsby' },
    { value: 'author', label: '✍️ Author', placeholder: 'e.g., F. Scott Fitzgerald' },
    { value: 'subject', label: '🏷️ Subject', placeholder: 'e.g., Science Fiction' },
    { value: 'isbn', label: '🔢 ISBN', placeholder: 'e.g., 9780743273565' },
    { value: 'publisher', label: '🏢 Publisher', placeholder: 'e.g., Penguin Books' }
  ];

  const currentType = searchTypes.find(type => type.value === searchType);

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-type-selector">
          <select 
            value={searchType} 
            onChange={(e) => setSearchType(e.target.value)}
            className="search-type-select"
          >
            {searchTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="search-input-container">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowHistory(true)}
            placeholder={currentType?.placeholder || 'Search for books...'}
            className="search-input"
            autoComplete="off"
          />
          
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="clear-button"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
        
        <button type="submit" className="search-button">
          🔍 Search
        </button>
      </form>

      {showHistory && searchHistory.length > 0 && (
        <div className="search-history">
          <div className="search-history-header">
            <h3>Recent Searches</h3>
            <button 
              onClick={onClearHistory}
              className="clear-history-button"
            >
              Clear All
            </button>
          </div>
          
          <div className="search-history-list">
            {searchHistory.map((item, index) => (
              <button
                key={index}
                onClick={() => handleHistoryClick(item)}
                className="search-history-item"
              >
                <div className="history-query">
                  <span className="history-type">
                    {searchTypes.find(t => t.value === item.type)?.label}
                  </span>
                  <span className="history-text">{item.query}</span>
                </div>
                <span className="history-results">
                  {item.resultsCount} results
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {showHistory && (
        <div 
          className="search-overlay"
          onClick={() => setShowHistory(false)}
        />
      )}
    </div>
  );
};

export default SearchBar;
