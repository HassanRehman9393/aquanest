'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser } from '@/types/admin';
import { useAuth } from './AuthContext';

interface AdminAuthContextType {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  checkPermission: (permission: string) => boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const { user, isAuthenticated, isLoading } = useAuth();  useEffect(() => {
    // Sync admin state with main auth context
    if (isAuthenticated && user?.role === 'admin') {
      const adminUser: AdminUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: 'admin',
        permissions: [
          'products.view',
          'products.create',
          'products.edit',
          'products.delete',
          'orders.view',
          'orders.edit',
          'analytics.view',
          'users.view'
        ],
        lastLogin: new Date(),
        isActive: true
      };
      setAdmin(adminUser);
    } else {
      setAdmin(null);
    }
  }, [user, isAuthenticated]);

  const checkPermission = (permission: string): boolean => {
    if (!admin) return false;
    return admin.permissions.includes(permission) || admin.role === 'super_admin';
  };

  const isAuthenticatedAdmin = !!admin && isAuthenticated && user?.role === 'admin';

  return (
    <AdminAuthContext.Provider value={{
      admin,
      isAuthenticated: isAuthenticatedAdmin,
      isLoading,
      checkPermission
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
