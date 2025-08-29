import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Monitor, Menu, X, Globe } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: t('nav.home'), href: '/' },
  ];

  const categories = [
    { 
      name: t('category.frontend.general.title'), 
      href: '/frontend-general',
      key: 'frontend-general' 
    },
    { 
      name: t('category.frontend.tech.title'), 
      href: '/frontend-tech',
      key: 'frontend-tech' 
    },
    { 
      name: t('category.backend.general.title'), 
      href: '/backend-general',
      key: 'backend-general' 
    },
    { 
      name: t('category.backend.tech.title'), 
      href: '/backend-tech',
      key: 'backend-tech' 
    },
    { 
      name: t('category.web.general.title'), 
      href: '/web-general',
      key: 'web-general' 
    },
    { 
      name: t('exam.frontend.title'), 
      href: '/frontend-exam',
      key: 'frontend-exam' 
    },
    { 
      name: t('exam.backend.title'), 
      href: '/backend-exam',
      key: 'backend-exam' 
    },
  ];

  const isActive = (href: string) => location.pathname === href;

  const pageVariants = {
    initial: { opacity: 0, x: 20, scale: 0.98 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: -20, scale: 0.98 }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.4
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-2xl font-bold text-primary hover:opacity-80 transition-opacity"
            >
              <Globe className="h-8 w-8" />
              <span className="hidden sm:inline">Interview Q&A</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive(item.href)
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Categories Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    {t('nav.categories')}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {categories.map((category) => (
                    <DropdownMenuItem key={category.key} asChild>
                      <Link 
                        to={category.href}
                        className={isActive(category.href) ? 'bg-accent' : ''}
                      >
                        {category.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>

            {/* Controls */}
            <div className="flex items-center space-x-2">
              {/* Language Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                className="text-xs font-medium"
              >
                {language === 'en' ? 'العربية' : 'English'}
              </Button>

              {/* Theme Toggle */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme('light')}>
                    <Sun className="mr-2 h-4 w-4" />
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme('dark')}>
                    <Moon className="mr-2 h-4 w-4" />
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme('system')}>
                    <Monitor className="mr-2 h-4 w-4" />
                    System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="md:hidden border-t"
              >
                <div className="py-4 space-y-2">
                  {navigation.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={`block px-4 py-2 text-sm font-medium transition-colors hover:text-primary ${
                        isActive(item.href)
                          ? 'text-primary bg-accent'
                          : 'text-muted-foreground'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  
                  <div className="px-4 py-2">
                    <div className="text-xs font-semibold text-muted-foreground mb-2">
                      {t('nav.categories')}
                    </div>
                    {categories.map((category) => (
                      <Link
                        key={category.key}
                        to={category.href}
                        className={`block px-4 py-2 text-sm transition-colors hover:text-primary ${
                          isActive(category.href)
                            ? 'text-primary bg-accent'
                            : 'text-muted-foreground'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2025 Interview Q&A Platform. Built with React 19 + Vite.</p>
            <a
                        href="https://www.linkedin.com/in/ahmed-mohmed-707603256"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline hover:text-primary/80"
                      >
                        Ahmed Mohamed
                      </a>
                      . Built for developers and programmers preparing for interviews.
                    
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;