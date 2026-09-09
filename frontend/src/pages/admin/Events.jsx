import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Eye, Star, ToggleLeft, ToggleRight } from 'lucide-react';
import { supabase } from '../../config/supabase';
import { formatDate } from '../../utils/helpers';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Pagination from '../../components/common/Pagination';
import toast from 'react-hot-toast';

const STATUS_COLORS = { upcoming: 'primary', ongoing: 'success', completed: 'warning', cancelled: 'danger' };

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteId, setDeleteId] = useState(null);
  const PER_PAGE = 10;

  useEffect(() => { fetchEvents(); }, [search, statusFilter, page]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      let q = supabase.from('events').select('*', { count: 'exact' });
      if (search) q = q.ilike('title', `%${search}%`);
      if (statusFilter) q = q.eq('status', statusFilter);
      q = q.order('event_date', { ascending: false }).range((page - 1) * PER_PAGE, page * PER_PAGE - 1);
      const { data, error, count } = await q;
      if (error) throw error;
      setEvents(data || []);
      setTotal(count || 0);
    } catch (err) { toast.error('Failed to load events'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
      toast.success('Event deleted');
      fetchEvents();
    } catch { toast.error('Delete failed'); }
  };

  const toggleFeatured = async (event) => {
    const { error } = await supabase.from('events').update({ is_featured: !event.is_featured }).eq('id', event.id);
    if (!error) { toast.success('Updated'); fetchEvents(); }
  };

  const toggleStatus = async (event) => {
    const next = { upcoming: 'ongoing', ongoing: 'completed', completed: 'upcoming', cancelled: 'upcoming' }[event.status];
    const { error } = await supabase.from('events').update({ status: next }).eq('id', event.id);
    if (!error) { toast.success('Status updated'); fetchEvents(); }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Events</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{total} events total</p>
        </div>
        <Link to="/admin/events/new" className="btn-primary flex items-center gap-2 self-start">
          <Plus className="w-5 h-5" /> Add Event
        </Link>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search events..." value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="input pl-9 py-2 text-sm" />
        </div>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="select py-2 text-sm w-full sm:w-40">
          <option value="">All Status</option>
          <option value="upcoming">Upcoming</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? <LoadingSpinner /> : events.length === 0 ? (
          <EmptyState title="No events found" description="Create your first event to get started." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                    {['Event', 'Date', 'Type', 'Status', 'Featured', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {events.map(event => (
                    <tr key={event.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white line-clamp-1">{event.title}</p>
                          {event.venue && <p className="text-xs text-gray-500 dark:text-gray-400">{event.venue}</p>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">{formatDate(event.event_date, 'short')}</td>
                      <td className="px-4 py-3">
                        {event.event_type && <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-lg capitalize">{event.event_type.replace('_', ' ')}</span>}
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => toggleStatus(event)}>
                          <Badge variant={STATUS_COLORS[event.status]}>{event.status}</Badge>
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => toggleFeatured(event)} className="transition-colors">
                          <Star className={`w-5 h-5 ${event.is_featured ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`} />
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <a href={`/events/${event.slug}`} target="_blank" rel="noopener noreferrer"
                            className="p-1.5 text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                            <Eye className="w-4 h-4" />
                          </a>
                          <Link to={`/admin/events/edit/${event.id}`}
                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button onClick={() => setDeleteId(event.id)}
                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {total > PER_PAGE && (
              <Pagination currentPage={page} totalPages={Math.ceil(total / PER_PAGE)}
                onPageChange={setPage} itemsPerPage={PER_PAGE} totalItems={total} />
            )}
          </>
        )}
      </div>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={() => handleDelete(deleteId)}
        title="Delete Event" message="Are you sure you want to delete this event? All registrations will also be deleted." />
    </div>
  );
};

export default AdminEvents;
