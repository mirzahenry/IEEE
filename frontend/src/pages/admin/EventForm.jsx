import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { supabase } from '../../config/supabase';
import { generateSlug } from '../../utils/helpers';
import { uploadFile } from '../../utils/uploadHelpers';
import toast from 'react-hot-toast';

const EventForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', short_description: '', event_date: '',
    start_time: '', end_time: '', venue: '', event_type: '',
    speaker: '', speaker_designation: '', registration_deadline: '',
    registration_link: '', poster_url: '', status: 'upcoming',
    is_featured: false, registration_enabled: true,
  });

  useEffect(() => {
    if (isEdit) {
      supabase.from('events').select('*').eq('id', id).single()
        .then(({ data }) => { if (data) setForm(f => ({ ...f, ...data })); });
    }
  }, [id]);

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return toast.error('Please select an image file');
    if (file.size > 10 * 1024 * 1024) return toast.error('Image must be under 10MB');
    setUploading(true);
    try {
      const { publicUrl } = await uploadFile(file, 'events', 'posters');
      set('poster_url', publicUrl);
      toast.success('Image uploaded');
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.event_date) return toast.error('Title and date are required');
    setLoading(true);
    try {
      const payload = { ...form };
      if (!isEdit) payload.slug = generateSlug(form.title);
      const { error } = isEdit
        ? await supabase.from('events').update(payload).eq('id', id)
        : await supabase.from('events').insert([payload]);
      if (error) throw error;
      toast.success(isEdit ? 'Event updated!' : 'Event created!');
      navigate('/admin/events');
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally { setLoading(false); }
  };

  const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5';

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/admin/events')}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{isEdit ? 'Edit Event' : 'Add New Event'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Fields */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6 space-y-4">
              <h2 className="font-semibold text-gray-900 dark:text-white">Basic Information</h2>
              <div>
                <label className={labelClass}>Event Title *</label>
                <input type="text" value={form.title} onChange={e => set('title', e.target.value)}
                  className="input" placeholder="Enter event title" required />
              </div>
              <div>
                <label className={labelClass}>Short Description</label>
                <input type="text" value={form.short_description} onChange={e => set('short_description', e.target.value)}
                  className="input" placeholder="Brief description (max 300 chars)" maxLength={300} />
              </div>
              <div>
                <label className={labelClass}>Full Description</label>
                <textarea value={form.description} onChange={e => set('description', e.target.value)}
                  className="textarea" rows={6} placeholder="Detailed event description..." />
              </div>
            </div>

            <div className="card p-6 space-y-4">
              <h2 className="font-semibold text-gray-900 dark:text-white">Date & Time</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Event Date *</label>
                  <input type="date" value={form.event_date} onChange={e => set('event_date', e.target.value)}
                    className="input" required />
                </div>
                <div>
                  <label className={labelClass}>Event Type</label>
                  <select value={form.event_type} onChange={e => set('event_type', e.target.value)} className="select">
                    <option value="">Select Type</option>
                    {['workshop','seminar','webinar','competition','field_visit','training','research_talk','awareness','conference','other'].map(t => (
                      <option key={t} value={t}>{t.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Start Time</label>
                  <input type="time" value={form.start_time} onChange={e => set('start_time', e.target.value)} className="input" />
                </div>
                <div>
                  <label className={labelClass}>End Time</label>
                  <input type="time" value={form.end_time} onChange={e => set('end_time', e.target.value)} className="input" />
                </div>
              </div>
            </div>

            <div className="card p-6 space-y-4">
              <h2 className="font-semibold text-gray-900 dark:text-white">Venue & Speaker</h2>
              <div>
                <label className={labelClass}>Venue</label>
                <input type="text" value={form.venue} onChange={e => set('venue', e.target.value)}
                  className="input" placeholder="Event venue or Online" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Speaker Name</label>
                  <input type="text" value={form.speaker} onChange={e => set('speaker', e.target.value)}
                    className="input" placeholder="Speaker name" />
                </div>
                <div>
                  <label className={labelClass}>Speaker Designation</label>
                  <input type="text" value={form.speaker_designation} onChange={e => set('speaker_designation', e.target.value)}
                    className="input" placeholder="Title / Organization" />
                </div>
              </div>
            </div>

            <div className="card p-6 space-y-4">
              <h2 className="font-semibold text-gray-900 dark:text-white">Registration</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Registration Deadline</label>
                  <input type="datetime-local" value={form.registration_deadline?.slice(0, 16) || ''}
                    onChange={e => set('registration_deadline', e.target.value)} className="input" />
                </div>
                <div>
                  <label className={labelClass}>External Registration Link</label>
                  <input type="url" value={form.registration_link} onChange={e => set('registration_link', e.target.value)}
                    className="input" placeholder="https://..." />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="regEnabled" checked={form.registration_enabled}
                  onChange={e => set('registration_enabled', e.target.checked)}
                  className="w-4 h-4 text-primary-600 rounded border-gray-300" />
                <label htmlFor="regEnabled" className="text-sm text-gray-700 dark:text-gray-300">Enable event registration</label>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="card p-6 space-y-4">
              <h2 className="font-semibold text-gray-900 dark:text-white">Status & Settings</h2>
              <div>
                <label className={labelClass}>Status</label>
                <select value={form.status} onChange={e => set('status', e.target.value)} className="select">
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="featured" checked={form.is_featured}
                  onChange={e => set('is_featured', e.target.checked)}
                  className="w-4 h-4 text-primary-600 rounded border-gray-300" />
                <label htmlFor="featured" className="text-sm text-gray-700 dark:text-gray-300">Featured Event</label>
              </div>
            </div>

            <div className="card p-6 space-y-4">
              <h2 className="font-semibold text-gray-900 dark:text-white">Event Poster</h2>
              {form.poster_url ? (
                <div className="relative">
                  <img src={form.poster_url} alt="Poster" className="w-full h-48 object-cover rounded-lg" />
                  <button type="button" onClick={() => set('poster_url', '')}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary-400 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {uploading ? 'Uploading...' : 'Click to upload poster'}
                  </span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                </label>
              )}
              <div>
                <label className={labelClass}>Or paste image URL</label>
                <input type="url" value={form.poster_url} onChange={e => set('poster_url', e.target.value)}
                  className="input text-sm" placeholder="https://..." />
              </div>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => navigate('/admin/events')} className="flex-1 btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="flex-1 btn-primary flex items-center justify-center gap-2">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                {isEdit ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
