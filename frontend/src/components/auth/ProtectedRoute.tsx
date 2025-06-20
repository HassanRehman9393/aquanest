'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Droplets } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ 
  children, 
  requireAuth = true, 
  redirectTo = '/auth/login',
  fallback
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && requireAuth && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isLoading, isAuthenticated, requireAuth, redirectTo, router]);

  // Show loading state
  if (isLoading) {
    return fallback || (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900/20 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg">
          <CardContent className="flex flex-col items-center justify-center p-8 space-y-6">
            <div className="relative">
              <div className="bg-blue-600 p-4 rounded-full animate-pulse">
                <Droplets className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -inset-1 bg-blue-500/20 rounded-full animate-ping"></div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Loading...
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Please wait while we verify your authentication
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If auth is required but user is not authenticated, don't render anything
  // (redirect will happen in useEffect)
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  // If auth is not required or user is authenticated, render children
  return <>{children}</>;
}

// Higher-order component version for easier use
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    requireAuth?: boolean;
    redirectTo?: string;
    fallback?: React.ReactNode;
  }
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}
