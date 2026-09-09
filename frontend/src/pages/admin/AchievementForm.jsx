import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { supabase } from '../../config/supabase';
import { uploadFile } from '../../utils/uploadHelpers';
import toast from 'react-hot-toast';

const CATEGORIES = ['Competition Award', 'Research Award', 'University Award', 'Project Award', 'Hackathon', 'Conference Participation', 'National Competition', 'International Competition', 'Other'];

const AchievementForm = () => {
  const { id } = useParams(); const navigate = useNavigate(); const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', achievement_date: '', category: '', team_members: '', award_position: '', image_url: '', certificate_url: '', is_featured: false });

  useEffect(() => {
    if (isEdit) supabase.from('achievements').select('*').eq('id', id).single().then(({ data }) => data && setForm(f => ({ ...f, ...data })));
  }, [id]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { publicUrl } = await uploadFile(file, 'achievements', 'images');
      set('image_url', publicUrl);
      toast.success('Uploaded');
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) return toast.error('Title required');
    setLoading(true);
    try {
      const { error } = isEdit ? await supabase.from('achievements').update(form).eq('id', id) : await supabase.from('achievements').insert([form]);
      if (error) throw error;
      toast.success(isEdit ? 'Updated!' : 'Added!');
      navigate('/admin/achievements');
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  const label = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5';

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/admin/achievements')} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{isEdit ? 'Edit' : 'Add'} Achievement</h1>
      </div>
      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6 space-y-4">
            <div><label className={label}>Title *</label><input type="text" value={form.title} onChange={e => set('title', e.target.value)} className="input" required /></div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className={label}>Category</label><select value={form.category} onChange={e => set('category', e.target.value)} className="select"><option value="">Select</option>{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
              <div><label className={label}>Award/Position</label><input type="text" value={form.award_position} onChange={e => set('award_position', e.target.value)} className="input" placeholder="1st Place" /></div>
              <div><label className={label}>Date</label><input type="date" value={form.achievement_date} onChange={e => set('achievement_date', e.target.value)} className="input" /></div>
              <div><label className={label}>Team Members</label><input type="text" value={form.team_members} onChange={e => set('team_members', e.target.value)} className="input" placeholder="Comma separated names" /></div>
            </div>
            <div><label className={label}>Description</label><textarea value={form.description} onChange={e => set('description', e.target.value)} className="textarea" rows={5} /></div>
            <div><label className={label}>Certificate URL</label><input type="url" value={form.certificate_url} onChange={e => set('certificate_url', e.target.value)} className="input" placeholder="https://..." /></div>
            <div className="flex items-center gap-2"><input type="checkbox" id="feat" checked={form.is_featured} onChange={e => set('is_featured', e.target.checked)} className="w-4 h-4 text-primary-600 rounded" /><label htmlFor="feat" className="text-sm text-gray-700 dark:text-gray-300">Feature this achievement</label></div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">Image</h2>
            {form.image_url ? (
              <div className="relative"><img src={form.image_url} alt="Achievement" className="w-full h-44 object-cover rounded-lg" /><button type="button" onClick={() => set('image_url', '')} className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"><X className="w-3 h-3" /></button></div>
            ) : (
              <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary-400 transition-colors">
                <Upload className="w-7 h-7 text-gray-400 mb-1" /><span className="text-sm text-gray-500">{uploading ? 'Uploading...' : 'Upload image'}</span>
                <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
              </label>
            )}
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => navigate('/admin/achievements')} className="flex-1 btn-secondary">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 btn-primary flex items-center justify-center gap-2">
              {loading && <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}{isEdit ? 'Update' : 'Add'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AchievementForm;
