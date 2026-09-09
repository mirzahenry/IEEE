import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../../config/supabase';
import { generateSlug } from '../../utils/helpers';
import toast from 'react-hot-toast';

const AnnouncementForm = () => {
  const { id } = useParams(); const navigate = useNavigate(); const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', author: '', is_published: false, is_featured: false, featured_image: '' });

  useEffect(() => {
    if (isEdit) supabase.from('announcements').select('*').eq('id', id).single().then(({ data }) => data && setForm(f => ({ ...f, ...data })));
  }, [id]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.content) return toast.error('Title and content required');
    setLoading(true);
    try {
      const payload = { ...form, publish_date: new Date().toISOString() };
      if (!isEdit) payload.slug = generateSlug(form.title);
      const { error } = isEdit
        ? await supabase.from('announcements').update(payload).eq('id', id)
        : await supabase.from('announcements').insert([payload]);
      if (error) throw error;
      toast.success(isEdit ? 'Updated!' : 'Created!');
      navigate('/admin/announcements');
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  const label = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5';

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/admin/announcements')} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{isEdit ? 'Edit' : 'New'} Announcement</h1>
      </div>
      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <div className="card p-6 space-y-4">
          <div><label className={label}>Title *</label><input type="text" value={form.title} onChange={e => set('title', e.target.value)} className="input" required /></div>
          <div><label className={label}>Author</label><input type="text" value={form.author} onChange={e => set('author', e.target.value)} className="input" placeholder="Your name" /></div>
          <div><label className={label}>Content *</label><textarea value={form.content} onChange={e => set('content', e.target.value)} className="textarea" rows={8} required /></div>
          <div><label className={label}>Featured Image URL</label><input type="url" value={form.featured_image} onChange={e => set('featured_image', e.target.value)} className="input" placeholder="https://..." /></div>
          <div className="flex gap-6">
            {[['is_published','Publish'], ['is_featured','Feature']].map(([k,lbl]) => (
              <div key={k} className="flex items-center gap-2">
                <input type="checkbox" id={k} checked={form[k]} onChange={e => set(k, e.target.checked)} className="w-4 h-4 text-primary-600 rounded" />
                <label htmlFor={k} className="text-sm text-gray-700 dark:text-gray-300">{lbl}</label>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={() => navigate('/admin/announcements')} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
            {loading && <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}{isEdit ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AnnouncementForm;
