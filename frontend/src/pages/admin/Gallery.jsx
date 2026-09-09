import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Image } from 'lucide-react';
import { supabase } from '../../config/supabase';
import { formatDate } from '../../utils/helpers';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import toast from 'react-hot-toast';

const AdminGallery = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('gallery_albums').select(`*, gallery_images(count)`).order('created_at', { ascending: false });
    setAlbums(data || []);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('gallery_albums').delete().eq('id', id);
    if (!error) { toast.success('Album deleted'); load(); }
    else toast.error('Delete failed');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gallery Albums</h1>
        <Link to="/admin/gallery/new" className="btn-primary flex items-center gap-2"><Plus className="w-5 h-5" /> New Album</Link>
      </div>

      {loading ? <LoadingSpinner /> : albums.length === 0 ? <EmptyState icon={Image} title="No albums" description="Create your first gallery album." /> : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {albums.map(album => (
            <div key={album.id} className="card overflow-hidden group">
              <div className="h-40 bg-gradient-to-br from-primary-700 to-earth-700 relative">
                {album.cover_image
                  ? <img src={album.cover_image} alt={album.title} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center"><Image className="w-10 h-10 text-white/30" /></div>}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate">{album.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  {album.event_date && formatDate(album.event_date, 'short')}
                </p>
                <div className="flex gap-2">
                  <Link to={`/admin/gallery/edit/${album.id}`}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors">
                    <Edit2 className="w-3 h-3" /> Edit
                  </Link>
                  <button onClick={() => setDeleteId(album.id)}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => handleDelete(deleteId)} title="Delete Album" message="This will delete the album and all its images. Are you sure?" />
    </div>
  );
};

export default AdminGallery;
