import { useState, useEffect } from 'react';
import { Users, Search, Eye, Check, X, Clock, Settings, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../../config/supabase';
import { formatDate } from '../../utils/helpers';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import toast from 'react-hot-toast';

const STATUS_COLORS   = { pending: 'warning', reviewing: 'primary', accepted: 'success', rejected: 'danger' };
const STATUS_ICONS    = { pending: Clock, reviewing: Eye, accepted: Check, rejected: X };

// Default positions list
const DEFAULT_POSITIONS = [
  'General Member', 'Event Volunteer', 'Research Team',
  'Media & Design Team', 'Technical / IT Team',
  'Field Operations Team', 'Any Available Position',
];

const JoinApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selected,     setSelected]     = useState(null);
  const [deleteId,     setDeleteId]     = useState(null);
  const [tab,          setTab]          = useState('applications'); // applications | settings
  const [positions,    setPositions]    = useState(DEFAULT_POSITIONS);
  const [newPosition,  setNewPosition]  = useState('');
  const [adminNotes,   setAdminNotes]   = useState('');
  const [savingNotes,  setSavingNotes]  = useState(false);

  useEffect(() => { fetchApplications(); loadPositions(); }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('membership_applications')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setApplications(data || []);
    } catch (err) {
      toast.error('Failed to load applications');
    } finally { setLoading(false); }
  };

  const loadPositions = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'join_positions')
        .single();
      if (!error && data?.value) {
        const parsed = JSON.parse(data.value);
        if (Array.isArray(parsed) && parsed.length > 0) setPositions(parsed);
      }
    } catch {}
  };

  const savePositions = async (list) => {
    setPositions(list);
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({ key: 'join_positions', value: JSON.stringify(list), type: 'json' }, { onConflict: 'key' });
      if (error) throw error;
      toast.success('Positions saved!');
    } catch (err) {
      toast.error('Failed to save positions');
    }
  };

  const addPosition = () => {
    if (!newPosition.trim()) return;
    savePositions([...positions, newPosition.trim()]);
    setNewPosition('');
  };

  const removePosition = (i) => {
    savePositions(positions.filter((_, idx) => idx !== i));
  };

  const updateStatus = async (id, status) => {
    const { error } = await supabase
      .from('membership_applications')
      .update({ status })
      .eq('id', id);
    if (!error) {
      toast.success(`Status updated to ${status}`);
      fetchApplications();
      if (selected?.id === id) setSelected(s => ({ ...s, status }));
    } else toast.error('Update failed');
  };

  const saveNotes = async () => {
    if (!selected) return;
    setSavingNotes(true);
    const { error } = await supabase
      .from('membership_applications')
      .update({ admin_notes: adminNotes })
      .eq('id', selected.id);
    if (!error) { toast.success('Notes saved'); fetchApplications(); }
    else toast.error('Save failed');
    setSavingNotes(false);
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('membership_applications').delete().eq('id', id);
    if (!error) { toast.success('Deleted'); fetchApplications(); setSelected(null); }
    else toast.error('Delete failed');
  };

  const handleOpen = (app) => {
    setSelected(app);
    setAdminNotes(app.admin_notes || '');
  };

  const filtered = applications.filter(a => {
    const ms = !statusFilter || a.status === statusFilter;
    const msearch = !search ||
      a.full_name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      (a.department || '').toLowerCase().includes(search.toLowerCase());
    return ms && msearch;
  });

  const counts = {
    all:       applications.length,
    pending:   applications.filter(a => a.status === 'pending').length,
    reviewing: applications.filter(a => a.status === 'reviewing').length,
    accepted:  applications.filter(a => a.status === 'accepted').length,
    rejected:  applications.filter(a => a.status === 'rejected').length,
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Join Applications</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {counts.all} total · {counts.pending} pending
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
        {[['applications','Applications'],['settings','Form Settings']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === t ? 'border-primary-600 text-primary-600 dark:text-primary-400 dark:border-primary-400' : 'border-transparent text-gray-600 dark:text-gray-400'
            }`}>{l}</button>
        ))}
      </div>

      {/* ── Applications Tab ── */}
      {tab === 'applications' && (
        <>
          {/* Status pills */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {[['','All',counts.all],['pending','Pending',counts.pending],['reviewing','Reviewing',counts.reviewing],['accepted','Accepted',counts.accepted],['rejected','Rejected',counts.rejected]].map(([val,lbl,cnt]) => (
              <button key={val} onClick={() => setStatusFilter(val)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  statusFilter === val ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}>
                {lbl} ({cnt})
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="card p-3 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, email, department..."
                className="input pl-9 py-2 text-sm" />
            </div>
          </div>

          {/* List */}
          <div className="card overflow-hidden">
            {loading ? <LoadingSpinner /> : filtered.length === 0
              ? <EmptyState icon={Users} title="No applications" description="Applications from the Join Us form will appear here." />
              : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                      {['Name','Email','Department','Position','Applied','Status','Actions'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {filtered.map(app => (
                      <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">{app.full_name}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{app.email}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{app.department || '—'}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300 max-w-[140px]">
                          <span className="line-clamp-1">{app.position_interest || '—'}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">{formatDate(app.created_at, 'short')}</td>
                        <td className="px-4 py-3">
                          <select value={app.status}
                            onChange={e => updateStatus(app.id, e.target.value)}
                            className={`text-xs px-2 py-1 rounded-lg border-0 font-medium cursor-pointer ${
                              app.status === 'accepted'  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                              app.status === 'rejected'  ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                              app.status === 'reviewing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                              'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                            }`}>
                            <option value="pending">Pending</option>
                            <option value="reviewing">Reviewing</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button onClick={() => handleOpen(app)}
                              className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button onClick={() => setDeleteId(app.id)}
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
            )}
          </div>
        </>
      )}

      {/* ── Form Settings Tab ── */}
      {tab === 'settings' && (
        <div className="card p-6 max-w-2xl">
          <h2 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">
            Position Options
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            These positions will appear in the "Position of Interest" dropdown on the Join Us form.
          </p>

          {/* Add new */}
          <div className="flex gap-2 mb-6">
            <input type="text" value={newPosition} onChange={e => setNewPosition(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addPosition()}
              className="input flex-1" placeholder="Add new position..." />
            <button onClick={addPosition} className="btn-primary flex items-center gap-1 px-4">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>

          {/* List */}
          <div className="space-y-2">
            {positions.map((pos, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700">
                <span className="text-sm text-gray-900 dark:text-white font-medium">{pos}</span>
                <button onClick={() => removePosition(i)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-400 mt-4">
            Changes are saved to the database and will appear on the Join Us form immediately.
          </p>
        </div>
      )}

      {/* ── Application Detail Modal ── */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Application Details" size="lg">
        {selected && (
          <div className="space-y-6">
            {/* Status bar */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
              <div>
                <p className="font-bold text-gray-900 dark:text-white text-lg">{selected.full_name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{selected.email}</p>
              </div>
              <select value={selected.status}
                onChange={e => updateStatus(selected.id, e.target.value)}
                className={`text-sm px-3 py-2 rounded-lg border-0 font-semibold cursor-pointer ${
                  selected.status === 'accepted'  ? 'bg-green-100 text-green-800' :
                  selected.status === 'rejected'  ? 'bg-red-100 text-red-800' :
                  selected.status === 'reviewing' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                <option value="pending">Pending</option>
                <option value="reviewing">Reviewing</option>
                <option value="accepted">Accepted ✓</option>
                <option value="rejected">Rejected ✗</option>
              </select>
            </div>

            {/* Info grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: 'Phone',             value: selected.phone       },
                { label: 'Student ID',        value: selected.student_id  },
                { label: 'Department',        value: selected.department  },
                { label: 'Semester',          value: selected.semester    },
                { label: 'Batch',             value: selected.batch       },
                { label: 'Position Interest', value: selected.position_interest },
                { label: 'Applied On',        value: formatDate(selected.created_at) },
              ].filter(f => f.value).map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{value}</p>
                </div>
              ))}
            </div>

            {selected.skills && (
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Skills</p>
                <p className="text-sm text-gray-800 dark:text-gray-200">{selected.skills}</p>
              </div>
            )}
            {selected.why_join && (
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Why Join GRSS?</p>
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                  {selected.why_join}
                </div>
              </div>
            )}
            {selected.experience && (
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Experience</p>
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                  {selected.experience}
                </div>
              </div>
            )}

            {/* Admin notes */}
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Admin Notes</p>
              <textarea value={adminNotes} onChange={e => setAdminNotes(e.target.value)}
                rows={3} className="textarea text-sm"
                placeholder="Add internal notes about this applicant..." />
              <button onClick={saveNotes} disabled={savingNotes}
                className="mt-2 btn-primary text-sm py-2 flex items-center gap-1">
                {savingNotes ? 'Saving...' : 'Save Notes'}
              </button>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
              <a href={`mailto:${selected.email}?subject=GRSS Membership Application`}
                className="flex-1 btn-primary text-sm text-center py-2.5">
                📧 Reply via Email
              </a>
              <button onClick={() => { setDeleteId(selected.id); setSelected(null); }}
                className="px-4 py-2.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 text-sm font-medium transition-colors">
                Delete
              </button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={() => handleDelete(deleteId)}
        title="Delete Application" message="Permanently delete this application?" />
    </div>
  );
};

export default JoinApplications;
