// Progressive Image Loading - Blur-to-sharp transitions
import React, { useState, useEffect } from 'react';

export const ProgressiveImage = ({ 
  src, 
  placeholder, 
  alt = '', 
  className = '',
  style = {},
  tier = 'A'
}) => {
  const [currentSrc, setCurrentSrc] = useState(placeholder);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Don't load images in Tier D
    if (tier === 'D') {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const img = new Image();
    
    img.onload = () => {
      setCurrentSrc(src);
      setIsLoading(false);
    };
    
    img.onerror = () => {
      setHasError(true);
      setIsLoading(false);
    };
    
    img.src = src;
  }, [src, tier, placeholder]);

  // Tier D: Show ASCII art placeholder
  if (tier === 'D') {
    return (
      <div
        className={className}
        style={{
          ...style,
          background: '#f3f4f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'monospace',
          fontSize: '12px',
          color: '#6b7280',
          whiteSpace: 'pre',
          overflow: 'hidden'
        }}
      >
        {`┌─────────┐
│  IMAGE  │
│ PREVIEW │
└─────────┘`}
      </div>
    );
  }

  // Error state
  if (hasError) {
    return (
      <div
        className={className}
        style={{
          ...style,
          background: '#f3f4f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#9ca3af'
        }}
      >
        <span>⚠️ Image unavailable</span>
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      style={{
        ...style,
        filter: isLoading ? 'blur(10px)' : 'blur(0)',
        transition: 'filter 0.5s ease-out',
        background: '#f3f4f6'
      }}
      loading="lazy"
    />
  );
};

export default ProgressiveImage;
