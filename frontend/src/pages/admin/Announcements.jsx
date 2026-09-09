import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../config/supabase';
import { formatDate } from '../../utils/helpers';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import toast from 'react-hot-toast';

const AdminAnnouncements = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => { fetch(); }, []);

  const fetch = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
    if (!error) setItems(data || []);
    setLoading(false);
  };

  const togglePublish = async (item) => {
    const { error } = await supabase.from('announcements').update({ is_published: !item.is_published }).eq('id', item.id);
    if (!error) { toast.success('Updated'); fetch(); }
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('announcements').delete().eq('id', id);
    if (!error) { toast.success('Deleted'); fetch(); }
    else toast.error('Delete failed');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Announcements</h1>
        <Link to="/admin/announcements/new" className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" /> New
        </Link>
      </div>
      <div className="card overflow-hidden">
        {loading ? <LoadingSpinner /> : items.length === 0 ? <EmptyState title="No announcements" /> : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {items.map(item => (
              <div key={item.id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <div className="flex-1 min-w-0 mr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">{item.title}</h3>
                    {item.is_featured && <Badge variant="warning" size="sm">Featured</Badge>}
                    <Badge variant={item.is_published ? 'success' : 'gray'} size="sm">{item.is_published ? 'Published' : 'Draft'}</Badge>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(item.created_at, 'short')} {item.author && `· ${item.author}`}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => togglePublish(item)}
                    className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    {item.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <Link to={`/admin/announcements/edit/${item.id}`}
                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </Link>
                  <button onClick={() => setDeleteId(item.id)}
                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => handleDelete(deleteId)}
        title="Delete Announcement" message="Delete this announcement permanently?" />
    </div>
  );
};

export default AdminAnnouncements;
