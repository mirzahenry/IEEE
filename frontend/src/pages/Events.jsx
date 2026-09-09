import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, ChevronRight, Filter } from 'lucide-react';
import { supabase } from '../config/supabase';
import { formatDate, formatTime } from '../utils/helpers';
import SectionHeader from '../components/common/SectionHeader';
import Badge from '../components/common/Badge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import Pagination from '../components/common/Pagination';

const EVENT_TYPES = ['All', 'workshop', 'seminar', 'webinar', 'competition', 'field_visit', 'training', 'research_talk', 'conference', 'other'];
const STATUS_COLORS = { upcoming: 'primary', ongoing: 'success', completed: 'warning', cancelled: 'danger' };

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [typeFilter, setTypeFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const PER_PAGE = 9;

  useEffect(() => { fetchEvents(); }, [activeTab, typeFilter, page]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      let query = supabase.from('events').select('*', { count: 'exact' });
      if (activeTab === 'upcoming') query = query.in('status', ['upcoming', 'ongoing']);
      else query = query.in('status', ['completed', 'cancelled']);
      if (typeFilter !== 'All') query = query.eq('event_type', typeFilter);
      query = query.order('event_date', { ascending: activeTab === 'upcoming' })
        .range((page - 1) * PER_PAGE, page * PER_PAGE - 1);
      const { data, error, count } = await query;
      if (error) throw error;
      setEvents(data || []);
      setTotalCount(count || 0);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-16 bg-gradient-to-br from-primary-900 to-gray-900 text-white">
        <div className="container-custom text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Calendar className="w-14 h-14 mx-auto mb-4 text-primary-300" />
            <h1 className="heading-xl mb-4">Events</h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Workshops, seminars, competitions, and more — expand your geospatial knowledge.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section bg-white dark:bg-gray-900">
        <div className="container-custom">
          {/* Tabs */}
          <div className="flex gap-2 mb-8 border-b border-gray-200 dark:border-gray-700">
            {['upcoming', 'past'].map(tab => (
              <button key={tab} onClick={() => { setActiveTab(tab); setPage(1); }}
                className={`px-6 py-3 text-sm font-medium capitalize border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-primary-600 text-primary-600 dark:text-primary-400 dark:border-primary-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}>
                {tab} Events
              </button>
            ))}
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2 mb-8 flex-wrap">
            <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            {EVENT_TYPES.map(type => (
              <button key={type} onClick={() => { setTypeFilter(type); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${
                  typeFilter === type
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}>
                {type === 'All' ? 'All Types' : type.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Grid */}
          {loading ? <LoadingSpinner /> : events.length === 0
            ? <EmptyState icon={Calendar} title="No events found" description="Check back later for upcoming events." />
            : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {events.map((event, i) => (
                  <motion.div key={event.id}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                    className="card card-hover overflow-hidden group">
                    {/* Poster */}
                    <div className="h-48 bg-gradient-to-br from-primary-700 to-earth-700 relative overflow-hidden">
                      {event.poster_url
                        ? <img src={event.poster_url} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        : <div className="w-full h-full flex items-center justify-center">
                            <Calendar className="w-16 h-16 text-white/30" />
                          </div>
                      }
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-3 left-3 flex gap-2">
                        <Badge variant={STATUS_COLORS[event.status]}>{event.status}</Badge>
                        {event.event_type && <Badge variant="gray">{event.event_type.replace('_', ' ')}</Badge>}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {event.title}
                      </h3>
                      <div className="space-y-1.5 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <Calendar className="w-4 h-4 flex-shrink-0" />
                          <span>{formatDate(event.event_date)}</span>
                        </div>
                        {event.start_time && (
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <Clock className="w-4 h-4 flex-shrink-0" />
                            <span>{formatTime(event.start_time)}{event.end_time && ` – ${formatTime(event.end_time)}`}</span>
                          </div>
                        )}
                        {event.venue && (
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span className="line-clamp-1">{event.venue}</span>
                          </div>
                        )}
                      </div>
                      {event.short_description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
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
              {totalCount > PER_PAGE && (
                <Pagination currentPage={page} totalPages={Math.ceil(totalCount / PER_PAGE)}
                  onPageChange={setPage} itemsPerPage={PER_PAGE} totalItems={totalCount} />
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Events;
