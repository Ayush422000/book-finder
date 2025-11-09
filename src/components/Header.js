import React from 'react';
import './Header.css';

const Header = ({ favoriteCount, showFavorites, onToggleFavorites, onGoHome, darkTheme, onToggleDarkTheme }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div 
          className="logo-section" 
          onClick={onGoHome}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onGoHome();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Go to home page"
        >
          <h1 className="logo">
            📚 BookFinder
          </h1>
          <p className="tagline">Discover your next great read</p>
        </div>
        
        <nav className="nav">
          <button 
            className="theme-toggle-button"
            onClick={onToggleDarkTheme}
            aria-label={darkTheme ? 'Switch to light theme' : 'Switch to dark theme'}
            title={darkTheme ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {darkTheme ? '☀️' : '🌙'}
          </button>
          <button 
            className={`nav-button ${showFavorites ? 'active' : ''}`}
            onClick={onToggleFavorites}
          >
            ❤️ Favorites
            {favoriteCount > 0 && (
              <span className="favorite-count">{favoriteCount}</span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
