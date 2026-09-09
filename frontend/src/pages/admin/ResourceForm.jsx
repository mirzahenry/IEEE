import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { supabase } from '../../config/supabase';
import { generateSlug } from '../../utils/helpers';
import { uploadFile } from '../../utils/uploadHelpers';
import toast from 'react-hot-toast';

const CATEGORIES = ['GIS', 'Remote Sensing', 'Machine Learning', 'Research Paper', 'Tutorial', 'Workshop Material', 'Resources', 'Blog', 'Other'];
const FILE_TYPES = ['PDF', 'PPT', 'PPTX', 'DOC', 'DOCX', 'ZIP', 'Image', 'Other'];

const ResourceForm = () => {
  const { id } = useParams(); const navigate = useNavigate(); const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: '', author: '', file_url: '', file_type: '', thumbnail_url: '', is_published: false });

  useEffect(() => {
    if (isEdit) supabase.from('resources').select('*').eq('id', id).single().then(({ data }) => data && setForm(f => ({ ...f, ...data })));
  }, [id]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) return toast.error('File must be under 50MB');
    setUploading(true);
    try {
      const { publicUrl } = await uploadFile(file, 'resources', 'files');
      set('file_url', publicUrl);
      const ext = file.name.split('.').pop().toUpperCase();
      if (!form.file_type) set('file_type', ext);
      toast.success('File uploaded');
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) return toast.error('Title required');
    setLoading(true);
    try {
      const payload = { ...form };
      if (!isEdit) payload.slug = generateSlug(form.title);
      const { error } = isEdit ? await supabase.from('resources').update(payload).eq('id', id) : await supabase.from('resources').insert([payload]);
      if (error) throw error;
      toast.success(isEdit ? 'Updated!' : 'Created!');
      navigate('/admin/resources');
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  const label = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5';

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/admin/resources')} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{isEdit ? 'Edit' : 'Add'} Resource</h1>
      </div>
      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6 space-y-4">
            <div><label className={label}>Title *</label><input type="text" value={form.title} onChange={e => set('title', e.target.value)} className="input" required /></div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className={label}>Category</label><select value={form.category} onChange={e => set('category', e.target.value)} className="select"><option value="">Select</option>{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
              <div><label className={label}>Author</label><input type="text" value={form.author} onChange={e => set('author', e.target.value)} className="input" placeholder="Author name" /></div>
              <div><label className={label}>File Type</label><select value={form.file_type} onChange={e => set('file_type', e.target.value)} className="select"><option value="">Select</option>{FILE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
            </div>
            <div><label className={label}>Description</label><textarea value={form.description} onChange={e => set('description', e.target.value)} className="textarea" rows={5} /></div>
            <div><label className={label}>Thumbnail URL</label><input type="url" value={form.thumbnail_url} onChange={e => set('thumbnail_url', e.target.value)} className="input" placeholder="https://..." /></div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">File Upload</h2>
            <label className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary-400 transition-colors">
              <Upload className="w-7 h-7 text-gray-400 mb-1" />
              <span className="text-sm text-gray-500">{uploading ? 'Uploading...' : 'Upload file'}</span>
              <input type="file" accept=".pdf,.ppt,.pptx,.doc,.docx,.zip,image/*" onChange={handleFileUpload} className="hidden" disabled={uploading} />
            </label>
            {form.file_url && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
                <span className="text-green-600 dark:text-green-400 text-xs flex-1 truncate">✓ File uploaded</span>
                <button type="button" onClick={() => set('file_url', '')} className="text-red-500"><X className="w-3 h-3" /></button>
              </div>
            )}
            <div><label className={label}>Or File URL</label><input type="url" value={form.file_url} onChange={e => set('file_url', e.target.value)} className="input text-sm" placeholder="https://..." /></div>
            <div className="flex items-center gap-2"><input type="checkbox" id="pub" checked={form.is_published} onChange={e => set('is_published', e.target.checked)} className="w-4 h-4 text-primary-600 rounded" /><label htmlFor="pub" className="text-sm text-gray-700 dark:text-gray-300">Publish resource</label></div>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => navigate('/admin/resources')} className="flex-1 btn-secondary">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 btn-primary flex items-center justify-center gap-2">
              {loading && <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}{isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ResourceForm;
