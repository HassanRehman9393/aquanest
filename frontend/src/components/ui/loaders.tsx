'use client';

import React, { memo } from 'react';
import { Loader2, Droplets } from 'lucide-react';

export const PageLoader = memo(() => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Droplets className="h-12 w-12 text-blue-600 animate-pulse" />
        <Loader2 className="h-6 w-6 text-blue-400 animate-spin absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 animate-pulse">Loading...</p>
    </div>
  );
});

PageLoader.displayName = 'PageLoader';

export const ComponentLoader = memo(({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6', 
    lg: 'h-8 w-8'
  };

  return (
    <div className="flex items-center justify-center p-4">
      <Loader2 className={`${sizeClasses[size]} text-blue-600 animate-spin`} />    </div>
  );
});

ComponentLoader.displayName = 'ComponentLoader';
