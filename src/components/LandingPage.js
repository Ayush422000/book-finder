import React, { useEffect, useState } from 'react';
import './LandingPage.css';

const LandingPage = ({ onSearchClick }) => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setAnimated(true);
  }, []);

  const handlePopularSearchClick = (search) => {
    // Scroll to top smoothly to show search results
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Trigger search after a short delay to allow scroll
    setTimeout(() => {
      onSearchClick && onSearchClick(search);
    }, 300);
  };

  const features = [
    {
      icon: '🔍',
      title: 'Smart Search',
      description: 'Search by title, author, subject, ISBN, or publisher',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      icon: '❤️',
      title: 'Save Favorites',
      description: 'Keep track of books you want to read later',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      icon: '⭐',
      title: 'User Reviews',
      description: 'Read and write reviews with ratings',
      gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
    },
    {
      icon: '📚',
      title: 'Rich Details',
      description: 'Get comprehensive book information and covers',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      icon: '🎯',
      title: 'Advanced Filters',
      description: 'Filter by year, rating, and more',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    },
    {
      icon: '📱',
      title: 'Responsive Design',
      description: 'Works perfectly on all devices',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    }
  ];

  const popularSearches = [
    'Harry Potter',
    'The Great Gatsby',
    '1984',
    'To Kill a Mockingbird',
    'Pride and Prejudice'
  ];

  return (
    <div className="landing-page">
      {/* Animated Background Elements */}
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
        <div className="shape shape-5"></div>
      </div>

      {/* Hero Section */}
      <section className={`hero-section ${animated ? 'animate' : ''}`}>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">✨</span>
            <span>Discover Millions of Books</span>
          </div>
          
          <h1 className="hero-title">
            <span className="gradient-text">Find Your Next</span>
            <br />
            <span className="gradient-text-alt">Great Read</span>
          </h1>
          
          <p className="hero-description">
            Search through millions of books from Open Library. 
            Find books by title, author, subject, and more. 
            Save your favorites and discover new worlds.
          </p>

          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">20M+</div>
              <div className="stat-label">Books</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">Free</div>
              <div className="stat-label">Access</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Available</div>
            </div>
          </div>
        </div>

        {/* Floating Book Icons */}
        <div className="floating-books">
          <div className="floating-book book-1">📖</div>
          <div className="floating-book book-2">📕</div>
          <div className="floating-book book-3">📗</div>
          <div className="floating-book book-4">📘</div>
          <div className="floating-book book-5">📙</div>
          <div className="floating-book book-6">📔</div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`features-section ${animated ? 'animate' : ''}`}>
        <h2 className="section-title">
          <span className="section-title-icon">🌟</span>
          Powerful Features
        </h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div 
                className="feature-icon"
                style={{ background: feature.gradient }}
              >
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Searches */}
      <section className={`popular-searches-section ${animated ? 'animate' : ''}`}>
        <h2 className="section-title">
          <span className="section-title-icon">🔥</span>
          Popular Searches
        </h2>
        <div className="popular-searches">
          {popularSearches.map((search, index) => (
            <div 
              key={index} 
              className="popular-search-tag"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handlePopularSearchClick(search)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handlePopularSearchClick(search);
                }
              }}
            >
              {search}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className={`cta-section ${animated ? 'animate' : ''}`}>
        <div className="cta-content">
          <h2 className="cta-title">Ready to Start Reading?</h2>
          <p className="cta-description">
            Start searching above to discover your next favorite book!
          </p>
          <div className="cta-features">
            <div className="cta-feature">
              <span className="cta-check">✓</span>
              <span>Free to use</span>
            </div>
            <div className="cta-feature">
              <span className="cta-check">✓</span>
              <span>No registration required</span>
            </div>
            <div className="cta-feature">
              <span className="cta-check">✓</span>
              <span>Millions of books</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

