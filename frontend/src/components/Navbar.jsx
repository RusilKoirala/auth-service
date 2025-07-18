import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { Menu, X, Github } from 'lucide-react';
import ShieldLogo from '../assets/shield-logo.svg';
import { useState, useEffect, useRef } from 'react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const mobileMenuButtonRef = useRef(null);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Projects', href: '/projects' },
    { name: 'Documentation', href: '/docs' },
  ];

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) &&
          mobileMenuButtonRef.current && !mobileMenuButtonRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isMobileMenuOpen]);

  // Handle escape key to close mobile menu
  const handleEscapeKey = (event) => {
    if (event.key === 'Escape') {
      setIsMobileMenuOpen(false);
      mobileMenuButtonRef.current?.focus();
    }
  };

  // Focus management for mobile menu
  useEffect(() => {
    if (isMobileMenuOpen && mobileMenuRef.current) {
      const firstFocusableElement = mobileMenuRef.current.querySelector(
        'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusableElement?.focus();
    }
  }, [isMobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav className="bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-50" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-primary rounded-lg p-1 transition-colors duration-200"
            aria-label="AuthService Home"
          >
            <img src={ShieldLogo} alt="Logo" className="w-8 h-8" />
            <span className="text-xl font-bold text-foreground">AuthService</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8" role="menubar">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary rounded-lg px-2 py-1 ${
                  location.pathname === item.href
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                role="menuitem"
                aria-current={location.pathname === item.href ? 'page' : undefined}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <a
              href="https://github.com/rusilkoirala/auth-service"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              aria-label="GitHub Repository"
            >
              <Github className="w-6 h-6" />
            </a>
            
            {user ? (
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary rounded-lg px-2 py-1"
                  aria-label="Go to dashboard"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  aria-label="Logout from account"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary rounded-lg px-2 py-1"
                  aria-label="Sign in to your account"
                >
                  Login
                </Link>
                <Link 
                  to="/login" 
                  className="btn-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  aria-label="Get started with AuthService"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              ref={mobileMenuButtonRef}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-foreground" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5 text-foreground" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div 
            ref={mobileMenuRef}
            id="mobile-menu"
            className="md:hidden py-4 border-t border-border bg-background/95 backdrop-blur-sm"
            role="menu"
            aria-label="Mobile navigation menu"
          >
            <div className="flex flex-col space-y-3">
              {/* Navigation Links */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3">
                  Navigation
                </h3>
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:bg-primary/10 ${
                      location.pathname === item.href
                        ? 'text-primary bg-primary/10'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                    }`}
                    role="menuitem"
                    aria-current={location.pathname === item.href ? 'page' : undefined}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              
              {/* User Actions */}
              <div className="space-y-2 pt-2 border-t border-border">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3">
                  Account
                </h3>
                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:bg-primary/10 hover:bg-muted/60"
                      role="menuitem"
                      aria-label="Go to dashboard"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:bg-primary/10 hover:bg-muted/60"
                      role="menuitem"
                      aria-label="Logout from account"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:bg-primary/10 hover:bg-muted/60"
                      role="menuitem"
                      aria-label="Sign in to your account"
                    >
                      Login
                    </Link>
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 hover:bg-primary/90 transition-colors duration-200"
                      role="menuitem"
                      aria-label="Get started with AuthService"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}; 