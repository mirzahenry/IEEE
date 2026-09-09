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
  const [members, setMembers] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [tab, setTab] = useState('members');

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
    const { error } = await supabase.from('excom_members').update({ is_active: !member.is_active }).eq('id', member.id);
    if (!error) { toast.success('Updated'); fetchData(); }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">ExCom Management</h1>
        <Link to="/admin/excom/new" className="btn-primary flex items-center gap-2 self-start">
          <Plus className="w-5 h-5" /> Add Member
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
        {['members', 'positions'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2.5 text-sm font-medium capitalize border-b-2 transition-colors ${
              tab === t ? 'border-primary-600 text-primary-600 dark:text-primary-400 dark:border-primary-400' : 'border-transparent text-gray-600 dark:text-gray-400'
            }`}>{t}</button>
        ))}
      </div>

      {loading ? <LoadingSpinner /> : tab === 'members' ? (
        members.length === 0 ? (
          <EmptyState title="No members" description="Add your first ExCom member." />
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                    {['Photo', 'Name', 'Position', 'Department', 'Batch', 'Active', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {members.map(member => (
                    <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                      <td className="px-4 py-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                          {member.photo_url ? <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />
                            : <span className="text-primary-600 font-bold">{member.name.charAt(0)}</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{member.name}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300 text-sm">{member.excom_positions?.title}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300 text-sm">{member.department || '—'}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300 text-sm">{member.batch || '—'}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => toggleActive(member)}
                          className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${member.is_active ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
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
        <div className="space-y-3">
          {positions.map(pos => (
            <div key={pos.id} className="card p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <GripVertical className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{pos.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Order: {pos.display_order}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${pos.is_active ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                  {pos.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={() => deleteMember(deleteId)}
        title="Delete Member" message="Are you sure you want to delete this member?" />
    </div>
  );
};

export default AdminExCom;
