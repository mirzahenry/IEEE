import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  ArrowRight, Calendar, Award, Users, Rocket,
  Globe, Satellite, Map, BookOpen, ChevronRight, Star, Bell
} from 'lucide-react';
import { supabase } from '../config/supabase';
import { getLatestAnnouncements } from '../services/announcementsService';
import { formatDate, truncateText } from '../utils/helpers';
import SectionHeader from '../components/common/SectionHeader';
import Badge from '../components/common/Badge';
import useSettings from '../hooks/useSettings';

// Animated counter component — no suffix, shows exact count
const Counter = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let startTime;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, end, duration]);

  return <span ref={ref}>{count}</span>;
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1 }
  }),
};

const Home = () => {
  const { settings: s } = useSettings();
  const [stats, setStats] = useState({ events: 0, projects: 0, achievements: 0, members: 0 });
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [featuredAchievements, setFeaturedAchievements] = useState([]);
  const [excomPreview, setExcomPreview] = useState([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [eventsRes, projectsRes, achievementsRes, membersRes,
             announcementsRes, featuredProjectsRes, featuredAchievementsRes, excomRes] =
        await Promise.all([
          supabase.from('events').select('id', { count: 'exact', head: true }),
          supabase.from('projects').select('id', { count: 'exact', head: true }),
          supabase.from('achievements').select('id', { count: 'exact', head: true }),
          supabase.from('excom_members').select('id', { count: 'exact', head: true }).eq('is_active', true),
          supabase.from('announcements').select('*').eq('is_published', true).order('publish_date', { ascending: false }).limit(3),
          supabase.from('projects').select('*').eq('is_featured', true).limit(3),
          supabase.from('achievements').select('*').eq('is_featured', true).limit(3),
          supabase.from('excom_members').select('*, excom_positions(title)').eq('is_active', true).order('display_order').limit(4),
        ]);

      if (eventsRes.count) setStats(s => ({ ...s, events: eventsRes.count }));
      if (projectsRes.count) setStats(s => ({ ...s, projects: projectsRes.count }));
      if (achievementsRes.count) setStats(s => ({ ...s, achievements: achievementsRes.count }));
      if (membersRes.count) setStats(s => ({ ...s, members: membersRes.count }));
      if (!announcementsRes.error) setAnnouncements(announcementsRes.data || []);
      if (!featuredProjectsRes.error) setFeaturedProjects(featuredProjectsRes.data || []);
      if (!featuredAchievementsRes.error) setFeaturedAchievements(featuredAchievementsRes.data || []);
      if (!excomRes.error) setExcomPreview(excomRes.data || []);

      // Upcoming events
      const evRes = await supabase.from('events').select('*')
        .in('status', ['upcoming', 'ongoing']).order('event_date', { ascending: true }).limit(3);
      if (!evRes.error) setUpcomingEvents(evRes.data || []);
    } catch (err) {
      console.error('Home data error:', err);
    }
  };

  const eventTypeColors = {
    workshop: 'primary', seminar: 'info', webinar: 'success',
    competition: 'warning', field_visit: 'gray', training: 'primary',
    research_talk: 'info', conference: 'warning', other: 'gray'
  };

  return (
    <div className="min-h-screen">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-950 via-primary-950 to-gray-900">
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '60px 60px' }} />

        {/* Floating orbs */}
        <motion.div animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }} transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-24 right-16 w-64 h-64 bg-primary-600/10 rounded-full blur-3xl" />
        <motion.div animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }} transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute bottom-24 left-16 w-80 h-80 bg-earth-600/10 rounded-full blur-3xl" />

        {/* Floating icons */}
        {[
          { icon: Globe, top: '20%', left: '8%', delay: 0 },
          { icon: Satellite, top: '15%', right: '10%', delay: 0.5 },
          { icon: Map, bottom: '25%', left: '6%', delay: 1 },
        ].map(({ icon: Icon, delay, ...pos }, i) => (
          <motion.div key={i}
            animate={{ y: [0, -12, 0], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4 + i, repeat: Infinity, delay }}
            className="absolute hidden lg:block"
            style={pos}
          >
            <Icon className="w-8 h-8 text-primary-400/40" />
          </motion.div>
        ))}

        <div className="container-custom relative z-10 py-32 text-center text-white">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/20 border border-primary-500/30 text-primary-300 text-sm font-medium mb-8">
              <Satellite className="w-4 h-4" /> FAST NUCES · IEEE GRSS Student Chapter
            </span>
          </motion.div>

          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Exploring{' '}
            <span className="bg-gradient-to-r from-primary-400 to-earth-400 bg-clip-text text-transparent">Earth</span>.
            <br />Advancing Technology.
          </motion.h1>

          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="text-xl md:text-2xl mb-6 text-gray-300 max-w-3xl mx-auto font-light">
            {s.tagline || 'Inspiring the Next Generation of Geospatial Innovators.'}
          </motion.p>

          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={3}
            className="text-base md:text-lg mb-12 text-gray-400 max-w-2xl mx-auto">
            {s.about_text || 'Join us in advancing knowledge in earth sciences, GIS, remote sensing, and geospatial technologies through research, innovation, and collaboration.'}
          </motion.p>

          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}
            className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/about"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold transition-all hover:scale-105 shadow-lg shadow-primary-900/50">
              Explore Our Society <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/events"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold transition-all hover:scale-105 backdrop-blur-sm">
              <Calendar className="w-5 h-5" /> Upcoming Events
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1.5">
            <div className="w-1 h-2 bg-white/60 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── ANNOUNCEMENT TICKER ── */}
      {announcements.length > 0 && (
        <div className="bg-primary-600 dark:bg-primary-700 text-white py-2.5 overflow-hidden">
          <div className="container-custom flex items-center gap-4">
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest flex-shrink-0 bg-white/20 px-3 py-1 rounded-full">
              <Bell className="w-3 h-3" /> News
            </span>
            <div className="overflow-hidden flex-1">
              <motion.div
                animate={{ x: ['100%', '-100%'] }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                className="flex gap-12 whitespace-nowrap"
              >
                {[...announcements, ...announcements].map((ann, i) => (
                  <Link key={i} to={`/announcements/${ann.slug}`}
                    className="text-sm hover:text-primary-200 transition-colors inline-flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-white/60 inline-block" />
                    {ann.title}
                  </Link>
                ))}
              </motion.div>
            </div>
            <Link to="/announcements"
              className="flex-shrink-0 text-xs font-medium bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors">
              All →
            </Link>
          </div>
        </div>
      )}

      {/* ── STATS ── */}
      <section className="py-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Users, label: 'Active Members', value: stats.members, color: 'text-primary-600 dark:text-primary-400', bg: 'bg-primary-50 dark:bg-primary-900/20' },
              { icon: Calendar, label: 'Events Hosted', value: stats.events, color: 'text-earth-600 dark:text-earth-400', bg: 'bg-earth-50 dark:bg-earth-900/20' },
              { icon: Rocket, label: 'Projects', value: stats.projects, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
              { icon: Award, label: 'Achievements', value: stats.achievements, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
            ].map((stat, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible"
                viewport={{ once: true }} custom={i} className="text-center group">
                <div className={`w-16 h-16 ${stat.bg} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className={`text-4xl font-bold ${stat.color} mb-1`}>
                  <Counter end={stat.value} />
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT PREVIEW ── */}
      <section className="section bg-gray-50 dark:bg-gray-800/50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <span className="inline-block text-primary-600 dark:text-primary-400 font-semibold text-sm uppercase tracking-wider mb-3">About GRSS</span>
              <h2 className="heading-lg mb-6 text-gray-900 dark:text-white">
                Pioneering Geospatial Research & Innovation
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg leading-relaxed">
                The Geosciences and Remote Sensing Society is a student-driven organization dedicated to advancing knowledge in earth sciences, remote sensing, GIS, and geospatial technologies.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                We bridge academic learning with real-world applications through workshops, research projects, field visits, and competitions — empowering students to become the next generation of earth scientists and geospatial innovators.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: Map, label: 'GIS & Mapping' },
                  { icon: Satellite, label: 'Remote Sensing' },
                  { icon: Globe, label: 'Earth Observation' },
                  { icon: BookOpen, label: 'Research' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
                    <item.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
                  </div>
                ))}
              </div>
              <Link to="/about" className="btn-primary inline-flex items-center gap-2">
                Learn More <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
              className="grid grid-cols-2 gap-4">
              {[
                { title: 'Mission', text: 'Foster innovation and research in geosciences and remote sensing technologies among students.', icon: Rocket, color: 'from-primary-600 to-primary-700' },
                { title: 'Vision', text: 'Be a leading student society in earth observation and geospatial sciences.', icon: Globe, color: 'from-earth-600 to-earth-700' },
                { title: 'Research', text: 'Conduct cutting-edge projects in GIS, satellite imagery, and environmental monitoring.', icon: Satellite, color: 'from-blue-600 to-blue-700' },
                { title: 'Community', text: 'Build a network of passionate geoscientists and remote sensing professionals.', icon: Users, color: 'from-purple-600 to-purple-700' },
              ].map((card, i) => (
                <motion.div key={i} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}
                  className="p-5 rounded-xl bg-white dark:bg-gray-800 shadow-md border border-gray-100 dark:border-gray-700">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center mb-3`}>
                    <card.icon className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{card.title}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{card.text}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── UPCOMING EVENTS ── */}
      <section className="section bg-white dark:bg-gray-900">
        <div className="container-custom">
          <SectionHeader title="Upcoming Events" subtitle="Events" centered
            description="Join our workshops, seminars, and activities to grow your knowledge." />
          {upcomingEvents.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No upcoming events at the moment. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {upcomingEvents.map((event, i) => (
                <motion.div key={event.id} variants={fadeUp} initial="hidden" whileInView="visible"
                  viewport={{ once: true }} custom={i}
                  className="card card-hover overflow-hidden group">
                  <div className="h-44 bg-gradient-to-br from-primary-600 to-earth-600 relative overflow-hidden">
                    {event.poster_url
                      ? <img src={event.poster_url} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      : <div className="w-full h-full flex items-center justify-center">
                          <Calendar className="w-16 h-16 text-white/40" />
                        </div>
                    }
                    <div className="absolute top-3 left-3">
                      <Badge variant={event.status === 'ongoing' ? 'success' : 'primary'}>
                        {event.status}
                      </Badge>
                    </div>
                    {event.event_type && (
                      <div className="absolute top-3 right-3">
                        <Badge variant={eventTypeColors[event.event_type] || 'gray'}>
                          {event.event_type.replace('_', ' ')}
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(event.event_date)}</span>
                    </div>
                    {event.short_description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {event.short_description}
                      </p>
                    )}
                    <Link to={`/events/${event.slug}`}
                      className="inline-flex items-center gap-1 text-primary-600 dark:text-primary-400 text-sm font-medium hover:gap-2 transition-all">
                      View Details <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          <div className="text-center">
            <Link to="/events" className="btn-outline inline-flex items-center gap-2">
              View All Events <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── ANNOUNCEMENTS ── */}
      {announcements.length > 0 && (
        <section className="section bg-gray-50 dark:bg-gray-800/50">
          <div className="container-custom">
            <SectionHeader title="Latest Announcements" subtitle="News" centered />
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {announcements.map((ann, i) => (
                <motion.div key={ann.id} variants={fadeUp} initial="hidden" whileInView="visible"
                  viewport={{ once: true }} custom={i}
                  className="card card-hover p-6 flex flex-col">
                  {ann.is_featured && (
                    <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400 text-xs font-medium mb-3">
                      <Star className="w-3 h-3 fill-current" /> Featured
                    </div>
                  )}
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">{ann.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 flex-1">
                    {truncateText(ann.content, 120)}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700 mt-auto">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(ann.publish_date, 'short')}</span>
                    <Link to={`/announcements/${ann.slug}`}
                      className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline flex items-center gap-1">
                      Read More <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="text-center">
              <Link to="/announcements" className="btn-outline inline-flex items-center gap-2">
                All Announcements <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── FEATURED PROJECTS ── */}
      {featuredProjects.length > 0 && (
        <section className="section bg-white dark:bg-gray-900">
          <div className="container-custom">
            <SectionHeader title="Featured Projects" subtitle="Projects" centered
              description="Cutting-edge research and technology projects from our society members." />
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {featuredProjects.map((project, i) => (
                <motion.div key={project.id} variants={fadeUp} initial="hidden" whileInView="visible"
                  viewport={{ once: true }} custom={i}
                  className="card card-hover overflow-hidden group">
                  <div className="h-40 bg-gradient-to-br from-primary-800 to-earth-800 relative overflow-hidden">
                    {project.image_url
                      ? <img src={project.image_url} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      : <div className="w-full h-full flex items-center justify-center">
                          <Rocket className="w-12 h-12 text-white/30" />
                        </div>
                    }
                    <div className="absolute top-3 left-3">
                      <Badge variant={project.status === 'completed' ? 'success' : 'primary'}>
                        {project.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-5">
                    <Badge variant="gray" size="sm">{project.category}</Badge>
                    <h3 className="font-bold text-gray-900 dark:text-white my-2 line-clamp-2">{project.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                      {truncateText(project.description, 100)}
                    </p>
                    <Link to={`/projects/${project.slug}`}
                      className="inline-flex items-center gap-1 text-primary-600 dark:text-primary-400 text-sm font-medium hover:gap-2 transition-all">
                      View Project <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="text-center">
              <Link to="/projects" className="btn-outline inline-flex items-center gap-2">
                All Projects <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── ACHIEVEMENTS ── */}
      {featuredAchievements.length > 0 && (
        <section className="section bg-gray-50 dark:bg-gray-800/50">
          <div className="container-custom">
            <SectionHeader title="Our Achievements" subtitle="Achievements" centered />
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {featuredAchievements.map((ach, i) => (
                <motion.div key={ach.id} variants={fadeUp} initial="hidden" whileInView="visible"
                  viewport={{ once: true }} custom={i}
                  className="card card-hover p-6 text-center">
                  <div className="w-14 h-14 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-7 h-7 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  {ach.award_position && (
                    <Badge variant="warning" className="mb-3">{ach.award_position}</Badge>
                  )}
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">{ach.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{ach.description}</p>
                  {ach.achievement_date && (
                    <p className="text-xs text-gray-400 mt-3">{formatDate(ach.achievement_date, 'short')}</p>
                  )}
                </motion.div>
              ))}
            </div>
            <div className="text-center">
              <Link to="/achievements" className="btn-outline inline-flex items-center gap-2">
                View All Achievements <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── EXCOM PREVIEW ── */}
      {excomPreview.length > 0 && (
        <section className="section bg-white dark:bg-gray-900">
          <div className="container-custom">
            <SectionHeader title="Meet Our ExCom" subtitle="Leadership" centered
              description="The dedicated team leading GRSS forward." />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              {excomPreview.map((member, i) => (
                <motion.div key={member.id} variants={fadeUp} initial="hidden" whileInView="visible"
                  viewport={{ once: true }} custom={i}
                  className="text-center group">
                  <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-3 border-4 border-primary-100 dark:border-primary-900/50 group-hover:border-primary-400 transition-colors shadow-md">
                    {member.photo_url
                      ? <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                      : <div className="w-full h-full bg-gradient-to-br from-primary-600 to-earth-600 flex items-center justify-center">
                          <span className="text-white text-2xl font-bold">{member.name.charAt(0)}</span>
                        </div>
                    }
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{member.name}</h4>
                  <p className="text-xs text-primary-600 dark:text-primary-400 mt-0.5">
                    {member.excom_positions?.title}
                  </p>
                </motion.div>
              ))}
            </div>
            <div className="text-center">
              <Link to="/excom" className="btn-outline inline-flex items-center gap-2">
                View Full ExCom <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="section bg-gradient-to-br from-primary-900 via-primary-800 to-earth-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="container-custom text-center relative z-10">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <Globe className="w-16 h-16 mx-auto mb-6 text-primary-300 opacity-80" />
            <h2 className="heading-lg mb-6">Ready to Get Involved?</h2>
            <p className="text-xl mb-10 text-gray-200 max-w-2xl mx-auto">
              Join us in exploring the world through geosciences and remote sensing.
              Be part of something extraordinary.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-primary-700 font-semibold hover:bg-gray-100 transition-all hover:scale-105 shadow-lg">
                Get in Touch <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/events"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary-600/40 hover:bg-primary-600/60 border border-primary-500/40 text-white font-semibold transition-all hover:scale-105">
                <Calendar className="w-5 h-5" /> Upcoming Events
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
