'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface SafeImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  width?: number;
  height?: number;
  fallbackSrc?: string;
  loading?: 'lazy' | 'eager';
}

export function SafeImage({ 
  src, 
  alt, 
  fill, 
  className, 
  width, 
  height,
  loading = 'lazy',
  fallbackSrc = 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=600&h=400&fit=crop&crop=center'
}: SafeImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImageSrc(fallbackSrc);
    }
  };
  // Validate URL before using
  let validSrc = imageSrc;
  try {
    if (imageSrc && imageSrc.trim()) {
      // Check if it's a relative path (starts with /) or an absolute URL
      if (imageSrc.startsWith('/') || imageSrc.startsWith('http')) {
        // Relative paths and absolute URLs are valid
        validSrc = imageSrc;
      } else {
        // Try to parse as URL for other cases
        new URL(imageSrc);
        validSrc = imageSrc;
      }
    } else {
      validSrc = fallbackSrc;
    }
  } catch (error) {
    console.warn('Invalid image URL:', imageSrc);
    validSrc = fallbackSrc;
  }
  const imageProps = {
    src: validSrc,
    alt,
    className,
    loading,
    onError: handleError,
    ...(fill ? { fill: true } : { width: width || 400, height: height || 300 })
  };

  return <Image {...imageProps} />;
}
