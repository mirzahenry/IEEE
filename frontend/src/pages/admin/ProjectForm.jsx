import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { supabase } from '../../config/supabase';
import { generateSlug } from '../../utils/helpers';
import { uploadFile } from '../../utils/uploadHelpers';
import toast from 'react-hot-toast';

const CATEGORIES = ['GIS', 'Remote Sensing', 'Machine Learning', 'Earth Observation', 'Environmental Monitoring', 'Geospatial AI', 'Climate', 'Urban Planning', 'Agriculture', 'Disaster Management', 'Other'];

const ProjectForm = () => {
  const { id } = useParams(); const navigate = useNavigate(); const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [members, setMembers] = useState([{ name: '', role: '' }]);
  const [form, setForm] = useState({ title: '', description: '', category: '', technologies: '', supervisor: '', start_date: '', end_date: '', status: 'ongoing', image_url: '', github_url: '', demo_url: '', research_paper_url: '', report_url: '', is_featured: false });

  useEffect(() => {
    if (isEdit) {
      supabase.from('projects').select('*, project_members(*)').eq('id', id).single()
        .then(({ data }) => {
          if (data) {
            setForm(f => ({ ...f, ...data }));
            if (data.project_members?.length) setMembers(data.project_members);
          }
        });
    }
  }, [id]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setMember = (i, k, v) => setMembers(ms => ms.map((m, idx) => idx === i ? { ...m, [k]: v } : m));
  const addMember = () => setMembers(ms => [...ms, { name: '', role: '' }]);
  const removeMember = (i) => setMembers(ms => ms.filter((_, idx) => idx !== i));

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { publicUrl } = await uploadFile(file, 'projects', 'images');
      set('image_url', publicUrl); toast.success('Uploaded');
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) return toast.error('Title required');
    setLoading(true);
    try {
      let projectId = id;
      const payload = { ...form };
      if (!isEdit) { payload.slug = generateSlug(form.title); }
      delete payload.project_members;

      if (isEdit) {
        const { error } = await supabase.from('projects').update(payload).eq('id', id);
        if (error) throw error;
        await supabase.from('project_members').delete().eq('project_id', id);
      } else {
        const { data, error } = await supabase.from('projects').insert([payload]).select().single();
        if (error) throw error;
        projectId = data.id;
      }

      const validMembers = members.filter(m => m.name.trim());
      if (validMembers.length) {
        await supabase.from('project_members').insert(validMembers.map(m => ({ ...m, project_id: projectId })));
      }

      toast.success(isEdit ? 'Updated!' : 'Created!');
      navigate('/admin/projects');
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  const label = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5';

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/admin/projects')} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{isEdit ? 'Edit' : 'Add'} Project</h1>
      </div>
      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6 space-y-4">
            <div><label className={label}>Project Title *</label><input type="text" value={form.title} onChange={e => set('title', e.target.value)} className="input" required /></div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className={label}>Category</label><select value={form.category} onChange={e => set('category', e.target.value)} className="select"><option value="">Select</option>{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
              <div><label className={label}>Status</label><select value={form.status} onChange={e => set('status', e.target.value)} className="select"><option value="planning">Planning</option><option value="ongoing">Ongoing</option><option value="completed">Completed</option><option value="paused">Paused</option></select></div>
              <div><label className={label}>Start Date</label><input type="date" value={form.start_date} onChange={e => set('start_date', e.target.value)} className="input" /></div>
              <div><label className={label}>End Date</label><input type="date" value={form.end_date} onChange={e => set('end_date', e.target.value)} className="input" /></div>
              <div><label className={label}>Supervisor</label><input type="text" value={form.supervisor} onChange={e => set('supervisor', e.target.value)} className="input" /></div>
              <div><label className={label}>Technologies</label><input type="text" value={form.technologies} onChange={e => set('technologies', e.target.value)} className="input" placeholder="Python, QGIS, etc." /></div>
            </div>
            <div><label className={label}>Description</label><textarea value={form.description} onChange={e => set('description', e.target.value)} className="textarea" rows={6} /></div>
          </div>

          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">Links</h2>
            {[['github_url','GitHub URL'], ['demo_url','Demo URL'], ['research_paper_url','Research Paper URL'], ['report_url','Report URL']].map(([k,lbl]) => (
              <div key={k}><label className={label}>{lbl}</label><input type="url" value={form[k]} onChange={e => set(k, e.target.value)} className="input" placeholder="https://..." /></div>
            ))}
          </div>

          <div className="card p-6 space-y-4">
            <div className="flex items-center justify-between"><h2 className="font-semibold text-gray-900 dark:text-white">Team Members</h2>
              <button type="button" onClick={addMember} className="btn-secondary text-sm py-1.5 flex items-center gap-1"><Plus className="w-4 h-4" /> Add</button></div>
            {members.map((m, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input type="text" value={m.name} onChange={e => setMember(i, 'name', e.target.value)} className="input flex-1" placeholder="Name" />
                <input type="text" value={m.role} onChange={e => setMember(i, 'role', e.target.value)} className="input flex-1" placeholder="Role (optional)" />
                <button type="button" onClick={() => removeMember(i)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><X className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">Project Image</h2>
            {form.image_url ? (
              <div className="relative"><img src={form.image_url} alt="Project" className="w-full h-44 object-cover rounded-lg" /><button type="button" onClick={() => set('image_url', '')} className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"><X className="w-3 h-3" /></button></div>
            ) : (
              <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary-400 transition-colors">
                <span className="text-sm text-gray-500">{uploading ? 'Uploading...' : 'Upload image'}</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
              </label>
            )}
            <div><label className={label}>Or URL</label><input type="url" value={form.image_url} onChange={e => set('image_url', e.target.value)} className="input text-sm" placeholder="https://..." /></div>
            <div className="flex items-center gap-2"><input type="checkbox" id="feat" checked={form.is_featured} onChange={e => set('is_featured', e.target.checked)} className="w-4 h-4 text-primary-600 rounded" /><label htmlFor="feat" className="text-sm text-gray-700 dark:text-gray-300">Featured</label></div>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => navigate('/admin/projects')} className="flex-1 btn-secondary">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 btn-primary flex items-center justify-center gap-2">
              {loading && <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}{isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
