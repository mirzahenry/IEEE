import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Star } from 'lucide-react';
import { supabase } from '../../config/supabase';
import { formatDate } from '../../utils/helpers';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import toast from 'react-hot-toast';

const AdminAchievements = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const { data } = await supabase.from('achievements').select('*').order('achievement_date', { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  const toggleFeatured = async (item) => {
    await supabase.from('achievements').update({ is_featured: !item.is_featured }).eq('id', item.id);
    loadData();
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('achievements').delete().eq('id', id);
    if (!error) { toast.success('Deleted'); loadData(); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Achievements</h1>
        <Link to="/admin/achievements/new" className="btn-primary flex items-center gap-2"><Plus className="w-5 h-5" /> Add</Link>
      </div>
      <div className="card overflow-hidden">
        {loading ? <LoadingSpinner /> : items.length === 0 ? <EmptyState title="No achievements" /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                {['Title', 'Category', 'Award', 'Date', 'Featured', 'Actions'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{h}</th>)}
              </tr></thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {items.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white max-w-[200px]"><p className="truncate">{item.title}</p></td>
                    <td className="px-4 py-3"><Badge variant="warning" size="sm">{item.category || '—'}</Badge></td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300 text-sm">{item.award_position || '—'}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">{item.achievement_date ? formatDate(item.achievement_date, 'short') : '—'}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleFeatured(item)}>
                        <Star className={`w-5 h-5 ${item.is_featured ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`} />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link to={`/admin/achievements/edit/${item.id}`} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></Link>
                        <button onClick={() => setDeleteId(item.id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => handleDelete(deleteId)} title="Delete Achievement" message="Delete this achievement?" />
    </div>
  );
};

export default AdminAchievements;
