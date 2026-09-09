import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, Home, ArrowLeft, Search } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  const quickLinks = [
    { path: '/',            label: 'Home' },
    { path: '/events',      label: 'Events' },
    { path: '/projects',    label: 'Projects' },
    { path: '/gallery',     label: 'Gallery' },
    { path: '/contact',     label: 'Contact' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-primary-950 to-gray-900 flex items-center justify-center px-4 py-20">

      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Floating orbs */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary-600/10 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-earth-600/10 rounded-full blur-3xl pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center max-w-lg mx-auto"
      >
        {/* Animated globe icon */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary-600/20 border border-primary-500/30 mb-8"
        >
          <Globe className="w-12 h-12 text-primary-400" />
        </motion.div>

        {/* 404 */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-8xl font-black text-white mb-4 tracking-tight"
        >
          4<span className="text-primary-400">0</span>4
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-white mb-3"
        >
          Page Not Found
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 mb-10 leading-relaxed"
        >
          Looks like this coordinate doesn't exist on our map.
          The page you're looking for may have been moved, renamed, or never existed.
        </motion.p>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3 justify-center mb-10"
        >
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold transition-all hover:scale-105 backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold transition-all hover:scale-105 shadow-lg shadow-primary-900/40"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <Link
            to="/search"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold transition-all hover:scale-105 backdrop-blur-sm"
          >
            <Search className="w-4 h-4" />
            Search
          </Link>
        </motion.div>

        {/* Quick links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-gray-500 text-sm mb-4">Or explore these pages:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {quickLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className="px-4 py-1.5 rounded-full bg-gray-800/60 hover:bg-primary-600/40 border border-gray-700 hover:border-primary-500/50 text-gray-300 hover:text-white text-sm transition-all"
              >
                {label}
              </Link>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
