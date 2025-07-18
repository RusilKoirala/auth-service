import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ 
  size = 'md', 
  text = 'Loading...', 
  variant = 'spinner',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  if (variant === 'dots') {
    return (
      <div className={`flex items-center justify-center space-x-1 ${className}`}>
        <div className="flex space-x-1">
          <div className={`${sizeClasses[size]} bg-primary rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
          <div className={`${sizeClasses[size]} bg-primary rounded-full animate-bounce`} style={{ animationDelay: '150ms' }}></div>
          <div className={`${sizeClasses[size]} bg-primary rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></div>
        </div>
        {text && (
          <span className={`ml-3 text-muted-foreground ${textSizes[size]}`}>
            {text}
          </span>
        )}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={`flex items-center justify-center space-x-3 ${className}`}>
        <div className={`${sizeClasses[size]} bg-primary rounded-full animate-pulse`}></div>
        {text && (
          <span className={`text-muted-foreground ${textSizes[size]}`}>
            {text}
          </span>
        )}
      </div>
    );
  }

  // Default spinner variant
  return (
    <div className={`flex items-center justify-center space-x-3 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
      {text && (
        <span className={`text-muted-foreground ${textSizes[size]}`}>
          {text}
        </span>
      )}
    </div>
  );
};

// Specialized loading components for common use cases
export const PageLoader = ({ text = 'Loading page...' }) => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <LoadingSpinner size="lg" text={text} />
  </div>
);

export const ButtonLoader = ({ text = 'Loading...' }) => (
  <LoadingSpinner size="sm" text={text} />
);

export const CardLoader = ({ text = 'Loading...' }) => (
  <div className="card p-8 flex items-center justify-center">
    <LoadingSpinner size="md" text={text} />
  </div>
);

export const InlineLoader = ({ text = 'Loading...' }) => (
  <LoadingSpinner size="sm" text={text} />
);

// Skeleton loading components
export const Skeleton = ({ className = '', height = 'h-4' }) => (
  <div className={`animate-pulse bg-muted rounded ${height} ${className}`}></div>
);

export const SkeletonText = ({ lines = 3, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton 
        key={i} 
        height={i === lines - 1 ? 'h-3' : 'h-4'} 
        className={i === lines - 1 ? 'w-3/4' : ''}
      />
    ))}
  </div>
);

export const SkeletonCard = ({ className = '' }) => (
  <div className={`card p-6 ${className}`}>
    <div className="space-y-4">
      <Skeleton height="h-6" className="w-1/2" />
      <SkeletonText lines={3} />
      <div className="flex space-x-2">
        <Skeleton height="h-8" className="w-20" />
        <Skeleton height="h-8" className="w-24" />
      </div>
    </div>
  </div>
); 