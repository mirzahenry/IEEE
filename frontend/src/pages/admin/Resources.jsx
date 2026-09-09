import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Eye, EyeOff, Download } from 'lucide-react';
import { supabase } from '../../config/supabase';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import toast from 'react-hot-toast';

const AdminResources = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('resources').select('*').order('created_at', { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  const togglePublish = async (item) => {
    await supabase.from('resources').update({ is_published: !item.is_published }).eq('id', item.id);
    load();
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('resources').delete().eq('id', id);
    if (!error) { toast.success('Deleted'); load(); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Resources</h1>
        <Link to="/admin/resources/new" className="btn-primary flex items-center gap-2"><Plus className="w-5 h-5" /> Add</Link>
      </div>
      <div className="card overflow-hidden">
        {loading ? <LoadingSpinner /> : items.length === 0 ? <EmptyState title="No resources" /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                {['Title', 'Category', 'Author', 'Downloads', 'Status', 'Actions'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{h}</th>)}
              </tr></thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {items.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white max-w-[200px]"><p className="truncate">{item.title}</p></td>
                    <td className="px-4 py-3"><Badge variant="primary" size="sm">{item.category || '—'}</Badge></td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300 text-sm">{item.author || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300"><Download className="w-3 h-3" />{item.download_count || 0}</div>
                    </td>
                    <td className="px-4 py-3"><Badge variant={item.is_published ? 'success' : 'gray'} size="sm">{item.is_published ? 'Published' : 'Draft'}</Badge></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => togglePublish(item)} className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">{item.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                        <Link to={`/admin/resources/edit/${item.id}`} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></Link>
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
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => handleDelete(deleteId)} title="Delete Resource" message="Delete this resource?" />
    </div>
  );
};

export default AdminResources;
