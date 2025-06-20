'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Menu, X, Droplets, ShoppingCart, User, Home, Package, Info, MessageCircle, Play, Star, LogOut, Settings, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'About Us', href: '/about', icon: Info },
    { name: 'Testimonials', href: '/testimonials', icon: Star },
    { name: 'Contact', href: '/contact', icon: MessageCircle },
  ];

  const isActive = (path: string) => pathname === path;

  // Update active tab based on current pathname
  useEffect(() => {
    const currentNav = navigation.find(nav => nav.href === pathname);
    if (currentNav) {
      setActiveTab(currentNav.name);
    }
  }, [pathname]);

  const handleAuthAction = (action: 'login' | 'register' | 'profile' | 'logout') => {
    switch (action) {
      case 'login':
        router.push('/auth/login');
        break;
      case 'register':
        router.push('/auth/register');
        break;
      case 'profile':
        router.push('/profile');
        break;
      case 'logout':
        logout();
        break;
    }
  };
  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-200/50 dark:border-gray-700/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="bg-blue-600 p-2 rounded-full"
            >
              <Droplets className="h-6 w-6 text-white" />
            </motion.div>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">AquaNest</span>
          </Link>          {/* Desktop Navigation with Tubelight Style */}
          <div className="hidden md:flex">
            <div className="flex items-center gap-2 bg-white/10 dark:bg-gray-800/10 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-lg py-1 px-1 rounded-full shadow-lg">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isItemActive = isActive(item.href);

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setActiveTab(item.name)}
                    className={cn(
                      "relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full transition-all duration-300",
                      "text-gray-700/80 dark:text-gray-300/80 hover:text-blue-600 dark:hover:text-blue-400",
                      isItemActive && "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm",
                    )}
                  >
                    <span className="flex items-center space-x-2">
                      <Icon size={16} strokeWidth={2} />
                      <span>{item.name}</span>
                    </span>
                    {isItemActive && (
                      <motion.div
                        layoutId="activeNavTab"
                        className="absolute inset-0 w-full bg-blue-500/5 rounded-full -z-10"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      >
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-blue-600 rounded-t-full">
                          <div className="absolute w-12 h-6 bg-blue-500/20 rounded-full blur-md -top-2 -left-2" />
                          <div className="absolute w-8 h-6 bg-blue-500/20 rounded-full blur-md -top-1" />
                          <div className="absolute w-4 h-4 bg-blue-500/20 rounded-full blur-sm top-0 left-2" />
                        </div>
                      </motion.div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>          {/* Desktop Actions with Tubelight Style */}
          <div className="hidden md:flex items-center">
            <div className="flex items-center gap-2 bg-white/10 dark:bg-gray-800/10 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-lg py-1 px-1 rounded-full shadow-lg mr-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative px-4 py-2 rounded-full hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all duration-300"
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
              <ThemeToggle />
            </div><div className="bg-white/10 dark:bg-gray-800/10 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-lg rounded-full shadow-lg">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      size="sm" 
                      className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 rounded-full px-6 py-2 font-semibold transition-all duration-300 hover:shadow-lg"
                    >
                      <UserCircle className="h-4 w-4 mr-2" />
                      {user?.name || 'Profile'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleAuthAction('profile')} className="cursor-pointer">
                      <UserCircle className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleAuthAction('logout')} className="cursor-pointer text-red-600 dark:text-red-400">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  size="sm" 
                  onClick={() => handleAuthAction('register')}
                  className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 rounded-full px-6 py-2 font-semibold transition-all duration-300 hover:shadow-lg"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Get Started
                </Button>
              )}
            </div>
          </div>{/* Mobile menu button */}
          <div className="md:hidden">
            <div className="bg-white/10 dark:bg-gray-800/10 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-lg rounded-full shadow-lg">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="rounded-full p-2 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all duration-300"
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200/50 dark:border-gray-700/50 py-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md rounded-b-2xl"
          >
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isItemActive = isActive(item.href);
                  return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 text-base font-medium rounded-xl mx-2 transition-all duration-300",
                      isItemActive
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-900/30 shadow-sm border border-blue-100 dark:border-blue-800'
                        : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50/50 dark:hover:bg-gray-800/50'
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon size={18} strokeWidth={2} />
                    <span>{item.name}</span>
                    {isItemActive && (
                      <div className="ml-auto w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                    )}
                  </Link>
                );
              })}              {/* Mobile Actions */}
              <div className="flex items-center space-x-2 px-4 py-2 mt-4">
                <div className="flex items-center gap-2 bg-white/20 dark:bg-gray-800/20 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-lg py-1 px-1 rounded-full shadow-lg flex-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex-1 rounded-full hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all duration-300"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Cart
                  </Button>
                  
                  {isAuthenticated ? (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        handleAuthAction('profile');
                        setIsMenuOpen(false);
                      }}
                      className="flex-1 rounded-full hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all duration-300"
                    >
                      <UserCircle className="h-4 w-4 mr-2" />
                      Profile
                    </Button>
                  ) : (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        handleAuthAction('login');
                        setIsMenuOpen(false);
                      }}
                      className="flex-1 rounded-full hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all duration-300"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Login
                    </Button>
                  )}
                  
                  <div className="flex items-center">
                    <ThemeToggle />
                  </div>
                </div>
              </div>
                <div className="px-4">
                <div className="bg-white/20 dark:bg-gray-800/20 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-lg rounded-full shadow-lg">
                  {isAuthenticated ? (
                    <Button 
                      onClick={() => {
                        handleAuthAction('profile');
                        setIsMenuOpen(false);
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 rounded-full py-3 font-semibold transition-all duration-300 hover:shadow-lg"
                    >
                      <UserCircle className="h-4 w-4 mr-2" />
                      {user?.name || 'Profile'}
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => {
                        handleAuthAction('register');
                        setIsMenuOpen(false);
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 rounded-full py-3 font-semibold transition-all duration-300 hover:shadow-lg"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Get Started
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;
