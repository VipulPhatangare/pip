// Skeleton Screen Components - Loading placeholders
import React from 'react';

export const SkeletonBox = ({ width = '100%', height = '20px', style = {} }) => (
  <div
    style={{
      width,
      height,
      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
      borderRadius: '4px',
      ...style
    }}
  />
);

export const SkeletonPropertyCard = () => (
  <div style={{ 
    padding: '16px', 
    border: '1px solid #e5e7eb', 
    borderRadius: '12px',
    background: 'white'
  }}>
    {/* Image skeleton */}
    <SkeletonBox height="200px" style={{ marginBottom: '16px', borderRadius: '8px' }} />
    
    {/* Title skeleton */}
    <SkeletonBox width="80%" height="24px" style={{ marginBottom: '12px' }} />
    
    {/* Subtitle skeleton */}
    <SkeletonBox width="60%" height="16px" style={{ marginBottom: '16px' }} />
    
    {/* Price and location */}
    <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
      <SkeletonBox width="40%" height="20px" />
      <SkeletonBox width="40%" height="20px" />
    </div>
    
    {/* Button skeleton */}
    <SkeletonBox width="100%" height="40px" style={{ borderRadius: '8px' }} />
  </div>
);

export const SkeletonList = ({ count = 3 }) => (
  <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonPropertyCard key={i} />
    ))}
  </div>
);

export const SkeletonText = ({ lines = 3 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
    {Array.from({ length: lines }).map((_, i) => (
      <SkeletonBox 
        key={i} 
        width={i === lines - 1 ? '70%' : '100%'} 
        height="16px" 
      />
    ))}
  </div>
);

// Add shimmer animation globally
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shimmer {
      0% {
        background-position: -200% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }
  `;
  document.head.appendChild(style);
}

export default {
  Box: SkeletonBox,
  PropertyCard: SkeletonPropertyCard,
  List: SkeletonList,
  Text: SkeletonText
};
