import React from 'react';
import './Header.css';

const Header = ({ favoriteCount, showFavorites, onToggleFavorites }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-section">
          <h1 className="logo">
            📚 BookFinder
          </h1>
          <p className="tagline">Discover your next great read</p>
        </div>
        
        <nav className="nav">
          {/* <button 
            className={`nav-button ${!showFavorites ? 'active' : ''}`}
            onClick={() => !showFavorites && onToggleFavorites()}
          >
            🔍 Search
          </button> */}
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
