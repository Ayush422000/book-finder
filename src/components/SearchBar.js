import React, { useState, useRef, useEffect } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch, searchHistory, onClearHistory, isLandingPage = false }) => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('title');
  const [showHistory, setShowHistory] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isLandingPage && inputRef.current) {
      // Auto-focus on landing page for better UX
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLandingPage]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), searchType);
      setShowHistory(false);
      setIsFocused(false);
    }
  };

  const handleHistoryClick = (historyItem) => {
    setQuery(historyItem.query);
    setSearchType(historyItem.type);
    setShowHistory(false);
    setIsFocused(false);
    onSearch(historyItem.query, historyItem.type);
  };

  const searchTypes = [
    { value: 'title', label: '📖 Title', icon: '📖', placeholder: 'e.g., The Great Gatsby' },
    { value: 'author', label: '✍️ Author', icon: '✍️', placeholder: 'e.g., F. Scott Fitzgerald' },
    { value: 'subject', label: '🏷️ Subject', icon: '🏷️', placeholder: 'e.g., Science Fiction' },
    { value: 'isbn', label: '🔢 ISBN', icon: '🔢', placeholder: 'e.g., 9780743273565' },
    { value: 'publisher', label: '🏢 Publisher', icon: '🏢', placeholder: 'e.g., Penguin Books' }
  ];

  const currentType = searchTypes.find(type => type.value === searchType);

  return (
    <div className={`search-container ${isLandingPage ? 'landing-page-search' : ''}`}>
      {/* Search Type Pills - Modern Design */}
      {isLandingPage && (
        <div className="search-type-pills">
          {searchTypes.map((type) => (
            <button
              key={type.value}
              type="button"
              className={`search-type-pill ${searchType === type.value ? 'active' : ''}`}
              onClick={() => setSearchType(type.value)}
              aria-label={`Search by ${type.value}`}
            >
              <span className="pill-icon">{type.icon}</span>
              <span className="pill-label">{type.label.replace(/[📖✍️🏷️🔢🏢]/g, '').trim()}</span>
            </button>
          ))}
        </div>
      )}

      <form 
        onSubmit={handleSubmit} 
        className={`search-form ${isFocused ? 'focused' : ''} ${isLandingPage ? 'landing-style' : ''}`}
      >
        {/* Search Icon */}
        <div className="search-icon-wrapper">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Search Input */}
        <div className="search-input-wrapper">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (searchHistory.length > 0) {
                setShowHistory(true);
              }
              setIsFocused(true);
            }}
            onBlur={() => {
              // Delay to allow history click
              setTimeout(() => {
                setIsFocused(false);
                setShowHistory(false);
              }, 200);
            }}
            placeholder={currentType?.placeholder || 'Search for books...'}
            className="search-input"
            autoComplete="off"
            aria-label="Search for books"
          />
          
          {/* Clear Button */}
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
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="m8 8 8 8M16 8l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>

        {/* Search Type Selector (Dropdown for non-landing pages) */}
        {!isLandingPage && (
          <div className="search-type-selector">
            <select 
              value={searchType} 
              onChange={(e) => setSearchType(e.target.value)}
              className="search-type-select"
              aria-label="Search type"
            >
              {searchTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Search Button */}
        <button 
          type="submit" 
          className="search-button"
          aria-label="Search"
        >
          <span className="button-text">Search</span>
          <svg className="button-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="m9 18 6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </form>

      {/* Keyboard Shortcut Hint */}
      {isLandingPage && !query && !isFocused && (
        <div className="keyboard-hint">
          <kbd>⌘</kbd> + <kbd>K</kbd> to search
        </div>
      )}

      {/* Search History Dropdown */}
      {showHistory && searchHistory.length > 0 && (
        <div className="search-history">
          <div className="search-history-header">
            <h3>Recent Searches</h3>
            <button 
              onClick={onClearHistory}
              className="clear-history-button"
              aria-label="Clear all search history"
            >
              Clear All
            </button>
          </div>
          
          <div className="search-history-list">
            {searchHistory.map((item, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleHistoryClick(item)}
                className="search-history-item"
              >
                <div className="history-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="history-query">
                  <span className="history-type">
                    {searchTypes.find(t => t.value === item.type)?.icon} {searchTypes.find(t => t.value === item.type)?.label.replace(/[📖✍️🏷️🔢🏢]/g, '').trim()}
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
      
      {/* Overlay - Only show when search history dropdown is visible */}
      {showHistory && searchHistory.length > 0 && (
        <div 
          className="search-overlay"
          onClick={() => {
            setShowHistory(false);
            setIsFocused(false);
          }}
          onMouseDown={(e) => e.preventDefault()}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default SearchBar;
