import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, Moon, Sun, User } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { path: '/',             label: 'Home',         exact: true },
  { path: '/about',        label: 'About'                     },
  { path: '/excom',        label: 'ExCom'                     },
  { path: '/events',       label: 'Events'                    },
  { path: '/announcements',label: 'News'                      },
  { path: '/achievements', label: 'Achievements'              },
  { path: '/projects',     label: 'Projects'                  },
  { path: '/gallery',      label: 'Gallery'                   },
  { path: '/resources',    label: 'Resources'                 },
  { path: '/join',         label: 'Join Us'                   },
  { path: '/contact',      label: 'Contact'                   },
];

const Navbar = () => {
  const [isOpen,   setIsOpen]   = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme }  = useTheme();
  const { user, isAdmin }       = useAuth();
  const location = useLocation();

  /* ── scroll listener ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── close mobile menu on route change ── */
  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  /* ── active check ── */
  const isActive = (path, exact) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  /* ── bg ── */
  const navBg = scrolled
    ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-lg border-b border-gray-200/60 dark:border-gray-800/60'
    : 'bg-transparent';

  return (
    <nav className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${navBg}`}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-18 py-3">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-11 h-11 bg-gradient-to-br from-primary-600 to-earth-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
              <span className="text-white font-black text-base tracking-tight">IE</span>
            </div>
            <div className="hidden sm:block leading-tight">
              <p className="text-lg font-bold text-gray-900 dark:text-white">IEEE</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                Geosciences &amp; Remote Sensing
              </p>
            </div>
          </Link>

          {/* ── Desktop nav ── */}
          <div className="hidden lg:flex items-center gap-0.5 flex-wrap">
            {NAV_LINKS.map(({ path, label, exact }) => (
              <Link key={path} to={path}
                className={`px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive(path, exact)
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/25'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/70'
                }`}>
                {label}
              </Link>
            ))}
          </div>

          {/* ── Right actions ── */}
          <div className="flex items-center gap-1.5">
            {/* Search */}
            <Link to="/search" aria-label="Search"
              className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Search className="w-5 h-5" />
            </Link>

            {/* Theme toggle */}
            <button onClick={toggleTheme} aria-label="Toggle theme"
              className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              {theme === 'light'
                ? <Moon className="w-5 h-5" />
                : <Sun  className="w-5 h-5" />}
            </button>

            {/* Admin button — always goes to login page */}
            <Link to="/admin/login"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 active:scale-95 text-white text-sm font-semibold transition-all shadow-sm">
              <User className="w-4 h-4" />
              Admin
            </Link>

            {/* Hamburger */}
            <button onClick={() => setIsOpen(v => !v)} aria-label="Menu"
              className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ── Mobile menu ── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden border-t border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-900">
              <div className="py-3 px-2 space-y-0.5">
                {NAV_LINKS.map(({ path, label, exact }) => (
                  <Link key={path} to={path}
                    className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive(path, exact)
                        ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/25'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}>
                    {label}
                  </Link>
                ))}

                {/* Admin in mobile — always login page */}
                <div className="pt-2 border-t border-gray-100 dark:border-gray-800 mt-2">
                  <Link to="/admin/login"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-semibold">
                    <User className="w-4 h-4" /> Admin Login
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
