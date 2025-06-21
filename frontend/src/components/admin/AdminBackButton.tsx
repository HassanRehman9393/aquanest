'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminBackButtonProps {
  href?: string;
  label?: string;
  className?: string;
}

export function AdminBackButton({ 
  href = '/admin', 
  label = 'Back to Dashboard',
  className = ''
}: AdminBackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    router.push(href);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Button
        variant="ghost"
        onClick={handleBack}
        className="group hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300"
      >
        <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
        {label}
      </Button>
    </motion.div>
  );
}
