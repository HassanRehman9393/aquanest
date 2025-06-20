'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Check, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cartStore';
import { Product } from '@/types/cart';
import { toast } from 'sonner';

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  showIcon?: boolean;
  children?: React.ReactNode;
}

export function AddToCartButton({
  product,
  quantity = 1,
  className,
  size = 'default',
  variant = 'default',
  showIcon = true,
  children
}: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const { addItem, openCart } = useCartStore();

  const handleAddToCart = async () => {
    if (isAdding || isAdded) return;

    setIsAdding(true);

    // Add to cart
    addItem(product, quantity);

    // Simulate async operation for smooth animation
    await new Promise(resolve => setTimeout(resolve, 600));

    setIsAdding(false);
    setIsAdded(true);

    // Show success toast
    toast.success(`${product.name} added to cart!`, {
      action: {
        label: 'View Cart',
        onClick: () => openCart(),
      },
    });

    // Reset added state after 2 seconds
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  const buttonContent = () => {
    if (isAdding) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex items-center gap-2"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Plus className="h-4 w-4" />
          </motion.div>
          Adding...
        </motion.div>
      );
    }

    if (isAdded) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="flex items-center gap-2"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <Check className="h-4 w-4" />
          </motion.div>
          Added to Cart!
        </motion.div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        {showIcon && <ShoppingCart className="h-4 w-4" />}
        {children || 'Add to Cart'}
      </div>
    );
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isAdding || isAdded || !product.inStock}
      size={size}
      variant={variant}
      className={className}
    >
      <AnimatePresence mode="wait">
        {buttonContent()}
      </AnimatePresence>
    </Button>
  );
}
