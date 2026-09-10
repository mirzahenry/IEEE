import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { path: '/',              label: 'Home',         exact: true },
  { path: '/about',         label: 'About'                     },
  { path: '/excom',         label: 'ExCom'                     },
  { path: '/events',        label: 'Events'                    },
  { path: '/announcements', label: 'News'                      },
  { path: '/achievements',  label: 'Achievements'              },
  { path: '/projects',      label: 'Projects'                  },
  { path: '/gallery',       label: 'Gallery'                   },
  { path: '/resources',     label: 'Resources'                 },
  { path: '/join',          label: 'Join Us'                   },
  { path: '/contact',       label: 'Contact'                   },
];

const Navbar = () => {
  const [isOpen,   setIsOpen]   = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  const isActive = (path, exact) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  const navBg = scrolled
    ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-md border-b border-gray-200/60 dark:border-gray-800/60'
    : 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm';

  return (
    <nav className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${navBg}`}>
      <div className="max-w-screen-2xl mx-auto px-4 xl:px-8">
        <div className="flex items-center h-16 gap-3">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0 mr-3">
            <img
              src="/logo.png"
              alt="IEEE Logo"
              className="w-12 h-12 object-contain group-hover:scale-105 transition-transform duration-200"
            />
            <div className="hidden sm:block leading-tight">
              <p className="text-base font-bold text-gray-900 dark:text-white leading-none">ieee</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-none mt-0.5">
                Students Branch Fast cfd
              </p>
            </div>
          </Link>

          {/* ── Desktop nav links ── */}
          <div className="hidden lg:flex items-center flex-1 min-w-0">
            {NAV_LINKS.map(({ path, label, exact }) => (
              <Link key={path} to={path}
                className={`whitespace-nowrap px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                  isActive(path, exact)
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/25'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/70'
                }`}>
                {label}
              </Link>
            ))}
          </div>

          {/* ── Right actions ── */}
          <div className="flex items-center gap-1.5 ml-auto shrink-0">

            {/* Search */}
            <Link to="/search" aria-label="Search"
              className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Search className="w-[18px] h-[18px]" />
            </Link>

            {/* Login button */}
            <Link to="/admin/login"
              className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 active:scale-95 text-white text-[13px] font-semibold transition-all shadow-sm">
              <Lock className="w-3.5 h-3.5" />
              Login
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
                <div className="pt-2 border-t border-gray-100 dark:border-gray-800 mt-2">
                  <Link to="/admin/login"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-semibold">
                    <Lock className="w-4 h-4" /> Login
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
