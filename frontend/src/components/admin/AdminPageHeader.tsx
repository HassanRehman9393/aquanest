'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { AdminBackButton } from './AdminBackButton';

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  showBackButton?: boolean;
  backHref?: string;
  backLabel?: string;
  children?: React.ReactNode;
}

export function AdminPageHeader({
  title,
  description,
  icon: Icon,
  showBackButton = true,
  backHref = '/admin',
  backLabel = 'Back to Dashboard',
  children
}: AdminPageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6 space-y-4"
    >
      {showBackButton && (
        <AdminBackButton href={backHref} label={backLabel} />
      )}
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            )}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {title}
            </h1>
          </div>
          {description && (
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
              {description}
            </p>
          )}
        </div>
        
        {children && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex gap-2"
          >
            {children}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
