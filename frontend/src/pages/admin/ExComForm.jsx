import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { supabase } from '../../config/supabase';
import { getExcomPositions } from '../../services/excomService';
import { uploadFile } from '../../utils/uploadHelpers';
import toast from 'react-hot-toast';

const ExComForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [positions, setPositions] = useState([]);
  const [form, setForm] = useState({
    name: '', position_id: '', department: '', batch: '', bio: '',
    photo_url: '', email: '', linkedin_url: '', instagram_url: '',
    display_order: 0, is_active: true,
  });

  useEffect(() => {
    getExcomPositions().then(setPositions).catch(console.error);
    if (isEdit) {
      supabase.from('excom_members').select('*').eq('id', id).single()
        .then(({ data }) => { if (data) setForm(f => ({ ...f, ...data })); });
    }
  }, [id]);

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return toast.error('Please select an image');
    if (file.size > 5 * 1024 * 1024) return toast.error('Image must be under 5MB');
    setUploading(true);
    try {
      const { publicUrl } = await uploadFile(file, 'excom', 'photos');
      set('photo_url', publicUrl);
      toast.success('Photo uploaded');
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.position_id) return toast.error('Name and position are required');
    setLoading(true);
    try {
      const { error } = isEdit
        ? await supabase.from('excom_members').update(form).eq('id', id)
        : await supabase.from('excom_members').insert([form]);
      if (error) throw error;
      toast.success(isEdit ? 'Member updated!' : 'Member added!');
      navigate('/admin/excom');
    } catch (err) { toast.error(err.message || 'Operation failed'); }
    finally { setLoading(false); }
  };

  const label = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5';

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/admin/excom')}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{isEdit ? 'Edit Member' : 'Add Member'}</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6 space-y-4">
              <h2 className="font-semibold text-gray-900 dark:text-white">Personal Information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={label}>Full Name *</label>
                  <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
                    className="input" placeholder="Member's full name" required />
                </div>
                <div>
                  <label className={label}>Position *</label>
                  <select value={form.position_id} onChange={e => set('position_id', e.target.value)} className="select" required>
                    <option value="">Select Position</option>
                    {positions.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className={label}>Department</label>
                  <input type="text" value={form.department} onChange={e => set('department', e.target.value)}
                    className="input" placeholder="e.g. Remote Sensing" />
                </div>
                <div>
                  <label className={label}>Batch/Year</label>
                  <input type="text" value={form.batch} onChange={e => set('batch', e.target.value)}
                    className="input" placeholder="e.g. 2022" />
                </div>
                <div>
                  <label className={label}>Email</label>
                  <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                    className="input" placeholder="member@email.com" />
                </div>
                <div>
                  <label className={label}>Display Order</label>
                  <input type="number" value={form.display_order} onChange={e => set('display_order', parseInt(e.target.value))}
                    className="input" min={0} />
                </div>
              </div>
              <div>
                <label className={label}>Bio</label>
                <textarea value={form.bio} onChange={e => set('bio', e.target.value)}
                  className="textarea" rows={4} placeholder="Short bio about this member..." />
              </div>
            </div>

            <div className="card p-6 space-y-4">
              <h2 className="font-semibold text-gray-900 dark:text-white">Social Links</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={label}>LinkedIn URL</label>
                  <input type="url" value={form.linkedin_url} onChange={e => set('linkedin_url', e.target.value)}
                    className="input" placeholder="https://linkedin.com/in/..." />
                </div>
                <div>
                  <label className={label}>Instagram URL</label>
                  <input type="url" value={form.instagram_url} onChange={e => set('instagram_url', e.target.value)}
                    className="input" placeholder="https://instagram.com/..." />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="isActive" checked={form.is_active}
                  onChange={e => set('is_active', e.target.checked)}
                  className="w-4 h-4 text-primary-600 rounded border-gray-300" />
                <label htmlFor="isActive" className="text-sm text-gray-700 dark:text-gray-300">Active member (visible on website)</label>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card p-6 space-y-4">
              <h2 className="font-semibold text-gray-900 dark:text-white">Profile Photo</h2>
              {form.photo_url ? (
                <div className="relative">
                  <img src={form.photo_url} alt="Profile" className="w-full h-48 object-cover rounded-lg" />
                  <button type="button" onClick={() => set('photo_url', '')}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-36 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary-400 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">{uploading ? 'Uploading...' : 'Upload photo'}</span>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" disabled={uploading} />
                </label>
              )}
              <div>
                <label className={label}>Or paste photo URL</label>
                <input type="url" value={form.photo_url} onChange={e => set('photo_url', e.target.value)}
                  className="input text-sm" placeholder="https://..." />
              </div>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => navigate('/admin/excom')} className="flex-1 btn-secondary">Cancel</button>
              <button type="submit" disabled={loading} className="flex-1 btn-primary flex items-center justify-center gap-2">
                {loading && <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                {isEdit ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ExComForm;
