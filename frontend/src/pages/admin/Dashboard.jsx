import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Users, Award, Rocket, Image, FileText, Megaphone, UserCheck, BarChart2, TrendingUp } from 'lucide-react';
import { supabase } from '../../config/supabase';
import { formatDate } from '../../utils/helpers';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const StatCard = ({ icon: Icon, label, value, color, link }) => (
  <Link to={link || '#'}>
    <motion.div whileHover={{ y: -2 }}
      className="card p-6 flex items-center gap-4 hover:shadow-xl transition-shadow cursor-pointer">
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
      <div>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      </div>
    </motion.div>
  </Link>
);

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [recent, setRecent] = useState({ registrations: [], events: [], messages: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    try {
      const [events, upcoming, regs, members, achievements, projects, albums, resources, announcements, msgs, recentRegs, recentEvents] = await Promise.all([
        supabase.from('events').select('id', { count: 'exact', head: true }),
        supabase.from('events').select('id', { count: 'exact', head: true }).in('status', ['upcoming', 'ongoing']),
        supabase.from('event_registrations').select('id', { count: 'exact', head: true }),
        supabase.from('excom_members').select('id', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('achievements').select('id', { count: 'exact', head: true }),
        supabase.from('projects').select('id', { count: 'exact', head: true }),
        supabase.from('gallery_albums').select('id', { count: 'exact', head: true }),
        supabase.from('resources').select('id', { count: 'exact', head: true }),
        supabase.from('announcements').select('id', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('id', { count: 'exact', head: true }).eq('is_read', false),
        supabase.from('event_registrations').select('*, events(title)').order('created_at', { ascending: false }).limit(5),
        supabase.from('events').select('*').order('created_at', { ascending: false }).limit(5),
      ]);

      setStats({
        events: events.count || 0,
        upcoming: upcoming.count || 0,
        registrations: regs.count || 0,
        members: members.count || 0,
        achievements: achievements.count || 0,
        projects: projects.count || 0,
        albums: albums.count || 0,
        resources: resources.count || 0,
        announcements: announcements.count || 0,
        unreadMessages: msgs.count || 0,
      });
      setRecent({
        registrations: recentRegs.data || [],
        events: recentEvents.data || [],
        messages: [],
      });
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  if (loading) return <LoadingSpinner />;

  const statCards = [
    { icon: Calendar, label: 'Total Events', value: stats.events, color: 'bg-primary-600', link: '/admin/events' },
    { icon: TrendingUp, label: 'Upcoming Events', value: stats.upcoming, color: 'bg-green-600', link: '/admin/events' },
    { icon: UserCheck, label: 'Registrations', value: stats.registrations, color: 'bg-blue-600', link: '/admin/registrations' },
    { icon: Users, label: 'ExCom Members', value: stats.members, color: 'bg-purple-600', link: '/admin/excom' },
    { icon: Award, label: 'Achievements', value: stats.achievements, color: 'bg-yellow-600', link: '/admin/achievements' },
    { icon: Rocket, label: 'Projects', value: stats.projects, color: 'bg-indigo-600', link: '/admin/projects' },
    { icon: Image, label: 'Gallery Albums', value: stats.albums, color: 'bg-pink-600', link: '/admin/gallery' },
    { icon: FileText, label: 'Resources', value: stats.resources, color: 'bg-teal-600', link: '/admin/resources' },
    { icon: Megaphone, label: 'Announcements', value: stats.announcements, color: 'bg-orange-600', link: '/admin/announcements' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back! Here's what's happening.</p>
        </div>
        <Link to="/admin/events/new" className="btn-primary text-sm">+ Add Event</Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map((card, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <StatCard {...card} />
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Registrations */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Registrations</h2>
            <Link to="/admin/registrations" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">View All</Link>
          </div>
          {recent.registrations.length === 0
            ? <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">No registrations yet</p>
            : (
            <div className="space-y-3">
              {recent.registrations.map(reg => (
                <div key={reg.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-600 dark:text-primary-400 font-bold text-sm">{reg.full_name?.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{reg.full_name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{reg.events?.title}</p>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">{formatDate(reg.created_at, 'short')}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Events */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Events</h2>
            <Link to="/admin/events" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">View All</Link>
          </div>
          {recent.events.length === 0
            ? <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">No events yet</p>
            : (
            <div className="space-y-3">
              {recent.events.map(event => (
                <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{event.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(event.event_date, 'short')}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${event.status === 'upcoming' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
                    {event.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6 mt-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {[
            { to: '/admin/events/new', icon: Calendar, label: 'Add Event' },
            { to: '/admin/excom/new', icon: Users, label: 'Add Member' },
            { to: '/admin/announcements/new', icon: Megaphone, label: 'Announce' },
            { to: '/admin/projects/new', icon: Rocket, label: 'Add Project' },
            { to: '/admin/gallery/new', icon: Image, label: 'New Album' },
          ].map(({ to, icon: Icon, label }) => (
            <Link key={to} to={to}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all group">
              <Icon className="w-6 h-6 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
