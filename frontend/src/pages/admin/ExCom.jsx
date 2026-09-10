import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, GripVertical } from 'lucide-react';
import { supabase } from '../../config/supabase';
import { getExcomPositions } from '../../services/excomService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import toast from 'react-hot-toast';

const AdminExCom = () => {
  const [members,       setMembers]       = useState([]);
  const [positions,     setPositions]     = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [deleteId,      setDeleteId]      = useState(null);
  const [deletePosId,   setDeletePosId]   = useState(null);
  const [tab,           setTab]           = useState('members');

  // New position form state
  const [newPosTitle,   setNewPosTitle]   = useState('');
  const [newPosOrder,   setNewPosOrder]   = useState('');
  const [addingPos,     setAddingPos]     = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const [membersRes, positionsRes] = await Promise.all([
      supabase.from('excom_members').select(`*, excom_positions(title)`).order('display_order'),
      getExcomPositions(),
    ]);
    if (!membersRes.error) setMembers(membersRes.data || []);
    if (positionsRes) setPositions(positionsRes);
    setLoading(false);
  };

  const deleteMember = async (id) => {
    const { error } = await supabase.from('excom_members').delete().eq('id', id);
    if (!error) { toast.success('Member deleted'); fetchData(); }
    else toast.error('Delete failed');
  };

  const toggleActive = async (member) => {
    const { error } = await supabase.from('excom_members')
      .update({ is_active: !member.is_active }).eq('id', member.id);
    if (!error) { toast.success('Updated'); fetchData(); }
  };

  // ── Position actions ──────────────────────────────────────
  const addPosition = async () => {
    if (!newPosTitle.trim()) return toast.error('Position title is required');
    setAddingPos(true);
    try {
      const { error } = await supabase.from('excom_positions').insert([{
        title:         newPosTitle.trim(),
        display_order: newPosOrder ? parseInt(newPosOrder) : positions.length + 1,
        is_active:     true,
      }]);
      if (error) throw error;
      toast.success('Position added!');
      setNewPosTitle('');
      setNewPosOrder('');
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Failed to add position');
    } finally { setAddingPos(false); }
  };

  const deletePosition = async (id) => {
    // Check if any member uses this position
    const { count } = await supabase.from('excom_members')
      .select('id', { count: 'exact', head: true }).eq('position_id', id);
    if (count > 0) {
      toast.error(`Cannot delete — ${count} member(s) use this position`);
      return;
    }
    const { error } = await supabase.from('excom_positions').delete().eq('id', id);
    if (!error) { toast.success('Position deleted'); fetchData(); }
    else toast.error('Delete failed');
  };

  const togglePosActive = async (pos) => {
    const { error } = await supabase.from('excom_positions')
      .update({ is_active: !pos.is_active }).eq('id', pos.id);
    if (!error) { toast.success('Updated'); fetchData(); }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">ExCom Management</h1>
        {tab === 'members' && (
          <Link to="/admin/excom/new" className="btn-primary flex items-center gap-2 self-start">
            <Plus className="w-5 h-5" /> Add Member
          </Link>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
        {[['members','Members'], ['positions','Positions']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === t
                ? 'border-primary-600 text-primary-600 dark:text-primary-400 dark:border-primary-400'
                : 'border-transparent text-gray-600 dark:text-gray-400'
            }`}>{l}</button>
        ))}
      </div>

      {loading ? <LoadingSpinner /> : tab === 'members' ? (

        /* ── Members Tab ── */
        members.length === 0 ? (
          <EmptyState title="No members" description="Add your first ExCom member." />
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                    {['Photo','Name','Position','Department','Batch','Active','Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {members.map(member => (
                    <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                      <td className="px-4 py-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                          {member.photo_url
                            ? <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />
                            : <span className="text-primary-600 font-bold">{member.name.charAt(0)}</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{member.name}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300 text-sm">{member.excom_positions?.title}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300 text-sm">{member.department || '—'}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300 text-sm">{member.batch || '—'}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => toggleActive(member)}
                          className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                            member.is_active
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                          }`}>
                          {member.is_active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Link to={`/admin/excom/edit/${member.id}`}
                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button onClick={() => setDeleteId(member.id)}
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
          </div>
        )

      ) : (

        /* ── Positions Tab ── */
        <div className="max-w-2xl space-y-6">

          {/* Add new position */}
          <div className="card p-6">
            <h2 className="font-semibold text-gray-900 dark:text-white text-lg mb-4">
              Add New Position
            </h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={newPosTitle}
                onChange={e => setNewPosTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addPosition()}
                className="input flex-1"
                placeholder="e.g. Social Media Manager, Web Developer..."
              />
              <input
                type="number"
                value={newPosOrder}
                onChange={e => setNewPosOrder(e.target.value)}
                className="input w-24"
                placeholder="Order"
                min={1}
              />
              <button
                onClick={addPosition}
                disabled={addingPos}
                className="btn-primary flex items-center gap-1.5 px-4 whitespace-nowrap">
                <Plus className="w-4 h-4" />
                {addingPos ? 'Adding...' : 'Add'}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Order number controls how positions appear in the dropdown (lower = first).
            </p>
          </div>

          {/* Positions list */}
          <div className="card overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                All Positions ({positions.length})
              </p>
            </div>

            {positions.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">No positions yet</div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {positions.map((pos) => (
                  <div key={pos.id}
                    className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <GripVertical className="w-4 h-4 text-gray-300 dark:text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">{pos.title}</p>
                        <p className="text-xs text-gray-400">Order: {pos.display_order}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => togglePosActive(pos)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                          pos.is_active
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                        }`}>
                        {pos.is_active ? 'Active' : 'Inactive'}
                      </button>
                      <button
                        onClick={() => setDeletePosId(pos.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete member confirm */}
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={() => deleteMember(deleteId)}
        title="Delete Member" message="Are you sure you want to delete this member?" />

      {/* Delete position confirm */}
      <ConfirmDialog isOpen={!!deletePosId} onClose={() => setDeletePosId(null)}
        onConfirm={() => deletePosition(deletePosId)}
        title="Delete Position" message="Are you sure you want to delete this position?" />
    </div>
  );
};

export default AdminExCom;
