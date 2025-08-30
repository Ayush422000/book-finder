import React from 'react';
import './ErrorMessage.css';

const ErrorMessage = ({ message, onDismiss }) => {
  return (
    <div className="error-container">
      <div className="error-content">
        <div className="error-icon">⚠️</div>
        <div className="error-text">
          <h3>Oops! Something went wrong</h3>
          <p>{message}</p>
        </div>
        <button 
          className="error-dismiss"
          onClick={onDismiss}
          aria-label="Dismiss error"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default ErrorMessage;
