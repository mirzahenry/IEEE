import { useState, useEffect } from 'react';
import { Search, Download, Filter } from 'lucide-react';
import { supabase } from '../../config/supabase';
import { formatDate } from '../../utils/helpers';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import toast from 'react-hot-toast';

const STATUS_COLORS = { registered: 'primary', attended: 'success', cancelled: 'danger' };

const Registrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [eventFilter, setEventFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const PER_PAGE = 15;

  useEffect(() => {
    supabase.from('events').select('id,title').order('event_date', { ascending: false })
      .then(({ data }) => setEvents(data || []));
  }, []);

  useEffect(() => { fetchRegistrations(); }, [search, eventFilter, statusFilter, page]);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      let q = supabase.from('event_registrations').select(`*, events(title)`, { count: 'exact' });
      if (search) q = q.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,student_id.ilike.%${search}%`);
      if (eventFilter) q = q.eq('event_id', eventFilter);
      if (statusFilter) q = q.eq('status', statusFilter);
      q = q.order('created_at', { ascending: false }).range((page - 1) * PER_PAGE, page * PER_PAGE - 1);
      const { data, error, count } = await q;
      if (error) throw error;
      setRegistrations(data || []);
      setTotal(count || 0);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  const updateStatus = async (id, status) => {
    const { error } = await supabase.from('event_registrations').update({ status }).eq('id', id);
    if (!error) { toast.success('Status updated'); fetchRegistrations(); }
    else toast.error('Update failed');
  };

  const exportCSV = () => {
    if (!registrations.length) return toast.error('No data to export');
    const headers = ['Name', 'Email', 'Phone', 'Student ID', 'Department', 'Semester', 'Batch', 'Event', 'Registered At', 'Status'];
    const rows = registrations.map(r => [
      r.full_name, r.email, r.phone || '', r.student_id || '',
      r.department || '', r.semester || '', r.batch || '',
      r.events?.title || '', formatDate(r.created_at, 'short'), r.status
    ]);
    const csvContent = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `registrations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click(); URL.revokeObjectURL(url);
    toast.success('CSV exported!');
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Registrations</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{total} total registrations</p>
        </div>
        <button onClick={exportCSV} className="btn-secondary flex items-center gap-2 self-start text-sm">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search name, email, student ID..." value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="input pl-9 py-2 text-sm" />
        </div>
        <select value={eventFilter} onChange={e => { setEventFilter(e.target.value); setPage(1); }}
          className="select py-2 text-sm w-full sm:w-48">
          <option value="">All Events</option>
          {events.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
        </select>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="select py-2 text-sm w-full sm:w-36">
          <option value="">All Status</option>
          <option value="registered">Registered</option>
          <option value="attended">Attended</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        {loading ? <LoadingSpinner /> : registrations.length === 0 ? (
          <EmptyState title="No registrations found" description="Registrations will appear here." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                    {['Name', 'Email', 'Phone', 'Student ID', 'Department', 'Event', 'Date', 'Status'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {registrations.map(reg => (
                    <tr key={reg.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">{reg.full_name}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{reg.email}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">{reg.phone || '—'}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">{reg.student_id || '—'}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">{reg.department || '—'}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300 max-w-[140px]">
                        <span className="line-clamp-1">{reg.events?.title}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">{formatDate(reg.created_at, 'short')}</td>
                      <td className="px-4 py-3">
                        <select value={reg.status} onChange={e => updateStatus(reg.id, e.target.value)}
                          className={`text-xs px-2 py-1 rounded-lg border-0 font-medium cursor-pointer ${
                            reg.status === 'attended' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                            reg.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                            'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300'
                          }`}>
                          <option value="registered">Registered</option>
                          <option value="attended">Attended</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
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
    </div>
  );
};

export default Registrations;
