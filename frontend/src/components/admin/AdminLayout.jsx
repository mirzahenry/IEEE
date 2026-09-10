import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { supabase } from '../../config/supabase';
import {
  LayoutDashboard, Calendar, Users, Megaphone, Award,
  Rocket, Image, FileText, Settings, LogOut, Moon, Sun,
  Menu, X, Mail, ChevronRight, Globe, UserPlus
} from 'lucide-react';
import toast from 'react-hot-toast';

// ── sidebar item definition ───────────────────────────────
const NAV = [
  { path: '/admin',              icon: LayoutDashboard, label: 'Dashboard',     exact: true },
  { path: '/admin/events',       icon: Calendar,        label: 'Events'                     },
  { path: '/admin/registrations',icon: Users,           label: 'Registrations'              },
  { path: '/admin/excom',        icon: Users,           label: 'ExCom'                      },
  { path: '/admin/announcements',icon: Megaphone,       label: 'Announcements'              },
  { path: '/admin/achievements', icon: Award,           label: 'Achievements'               },
  { path: '/admin/projects',     icon: Rocket,          label: 'Projects'                   },
  { path: '/admin/gallery',      icon: Image,           label: 'Gallery'                    },
  { path: '/admin/resources',    icon: FileText,        label: 'Resources'                  },
  { path: '/admin/messages',             icon: Mail,            label: 'Messages',       badge: true     },
  { path: '/admin/join-applications',   icon: UserPlus,        label: 'Join Applications'                  },
  { path: '/admin/settings',            icon: Settings,        label: 'Settings'                           },
];

const AdminLayout = ({ children }) => {
  const [sidebarOpen,   setSidebarOpen]   = useState(false);
  const [unreadCount,   setUnreadCount]   = useState(0);
  const { signOut, user }                 = useAuth();
  const { theme, toggleTheme }            = useTheme();
  const location                          = useLocation();
  const navigate                          = useNavigate();

  // close sidebar on route change (mobile)
  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  // fetch unread message count
  useEffect(() => {
    fetchUnread();
    // poll every 60 s
    const interval = setInterval(fetchUnread, 60_000);
    return () => clearInterval(interval);
  }, []);

  const fetchUnread = async () => {
    try {
      const { count } = await supabase
        .from('contact_messages')
        .select('id', { count: 'exact', head: true })
        .eq('is_read', false);
      setUnreadCount(count || 0);
    } catch { /* silent */ }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out');
      navigate('/admin/login');
    } catch { toast.error('Logout failed'); }
  };

  const isActive = (path, exact) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  // ── sidebar content (reused for desktop + mobile) ────────
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-gray-100 dark:border-gray-700/60 flex-shrink-0">
        <Link to="/admin" className="flex items-center gap-2.5 group">
          <img
            src="/logo.png"
            alt="IEEE Logo"
            className="w-8 h-8 object-contain group-hover:scale-105 transition-transform"
          />
          <div className="leading-none">
            <p className="text-sm font-bold text-gray-900 dark:text-white">IEEE Admin</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Control Panel</p>
          </div>
        </Link>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {NAV.map(({ path, icon: Icon, label, badge, exact }) => {
          const active = isActive(path, exact);
          return (
            <Link
              key={path}
              to={path}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                active
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-600/25'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/60 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200'}`} />
              <span className="flex-1">{label}</span>
              {/* unread badge */}
              {badge && unreadCount > 0 && (
                <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ${
                  active ? 'bg-white text-primary-600' : 'bg-primary-600 text-white'
                }`}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
              {/* active indicator */}
              {active && <ChevronRight className="w-3.5 h-3.5 text-white/70 flex-shrink-0" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: user info + controls */}
      <div className="flex-shrink-0 border-t border-gray-100 dark:border-gray-700/60 p-3 space-y-2">
        {/* View site */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/60 hover:text-gray-900 dark:hover:text-white transition-all"
        >
          <Globe className="w-4 h-4" />
          <span>View Website</span>
        </a>

        {/* User row */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-700/40">
          <div className="w-7 h-7 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
            <span className="text-primary-600 dark:text-primary-400 text-xs font-bold uppercase">
              {user?.email?.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{user?.email}</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">Administrator</p>
          </div>
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400 transition-colors flex-shrink-0"
            title={theme === 'light' ? 'Dark mode' : 'Light mode'}
          >
            {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">

      {/* ── Desktop sidebar ─────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-60 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700/60 fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* ── Mobile overlay ──────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Mobile sidebar ──────────────────────────────── */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700/60 transform transition-transform duration-200 ease-out lg:hidden ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <SidebarContent />
      </aside>

      {/* ── Main area ───────────────────────────────────── */}
      <div className="flex-1 flex flex-col lg:pl-60 min-w-0">

        {/* Topbar */}
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700/60 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20 flex-shrink-0">
          {/* Hamburger (mobile) */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Page breadcrumb / title */}
          <div className="hidden lg:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            {NAV.find(n => isActive(n.path, n.exact))?.label || 'Admin'}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Unread badge on topbar (mobile) */}
            {unreadCount > 0 && (
              <Link
                to="/admin/messages"
                className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              </Link>
            )}
            <button
              onClick={toggleTheme}
              className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
