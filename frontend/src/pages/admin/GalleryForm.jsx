import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, X, Plus } from 'lucide-react';
import { supabase } from '../../config/supabase';
import { generateSlug } from '../../utils/helpers';
import { uploadFile } from '../../utils/uploadHelpers';
import toast from 'react-hot-toast';

const GalleryForm = () => {
  const { id } = useParams(); const navigate = useNavigate(); const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [images, setImages] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', event_date: '', cover_image: '' });
  const fileRef = useRef();

  useEffect(() => {
    if (isEdit) {
      supabase.from('gallery_albums').select('*, gallery_images(*)').eq('id', id).single()
        .then(({ data }) => {
          if (data) {
            setForm(f => ({ ...f, title: data.title, description: data.description || '', event_date: data.event_date || '', cover_image: data.cover_image || '' }));
            setImages(data.gallery_images?.sort((a, b) => a.display_order - b.display_order) || []);
          }
        });
    }
  }, [id]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleImagesUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    let done = 0;
    try {
      for (const file of files) {
        const { publicUrl } = await uploadFile(file, 'gallery', 'images');
        done++;
        setUploadProgress(Math.round((done / files.length) * 100));
        setImages(imgs => [...imgs, { image_url: publicUrl, caption: '', display_order: imgs.length }]);
      }
      toast.success(`${files.length} image${files.length > 1 ? 's' : ''} uploaded`);
    } catch { toast.error('Some uploads failed'); }
    finally { setUploading(false); setUploadProgress(0); }
  };

  const removeImage = (i) => setImages(imgs => imgs.filter((_, idx) => idx !== i));
  const setCover = (url) => set('cover_image', url);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) return toast.error('Title required');
    setLoading(true);
    try {
      let albumId = id;
      if (isEdit) {
        const { error } = await supabase.from('gallery_albums').update(form).eq('id', id);
        if (error) throw error;
        await supabase.from('gallery_images').delete().eq('album_id', id);
      } else {
        const { data, error } = await supabase.from('gallery_albums').insert([{ ...form, slug: generateSlug(form.title) }]).select().single();
        if (error) throw error;
        albumId = data.id;
      }
      if (images.length) {
        await supabase.from('gallery_images').insert(images.map((img, i) => ({ image_url: img.image_url, caption: img.caption || '', display_order: i, album_id: albumId })));
      }
      toast.success(isEdit ? 'Updated!' : 'Album created!');
      navigate('/admin/gallery');
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  const label = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5';

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/admin/gallery')} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{isEdit ? 'Edit Album' : 'New Album'}</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card p-6 space-y-4">
            <div><label className={label}>Album Title *</label><input type="text" value={form.title} onChange={e => set('title', e.target.value)} className="input" required /></div>
            <div><label className={label}>Event Date</label><input type="date" value={form.event_date} onChange={e => set('event_date', e.target.value)} className="input" /></div>
            <div><label className={label}>Description</label><textarea value={form.description} onChange={e => set('description', e.target.value)} className="textarea" rows={3} /></div>
          </div>
          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">Cover Image</h2>
            {form.cover_image && <img src={form.cover_image} alt="Cover" className="w-full h-36 object-cover rounded-lg" />}
            <div><label className={label}>Cover Image URL</label><input type="url" value={form.cover_image} onChange={e => set('cover_image', e.target.value)} className="input text-sm" placeholder="https://..." /></div>
          </div>
        </div>

        {/* Upload Area */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 dark:text-white">Photos ({images.length})</h2>
            <button type="button" onClick={() => fileRef.current?.click()}
              className="btn-secondary text-sm flex items-center gap-2 py-2">
              <Plus className="w-4 h-4" /> {uploading ? `Uploading ${uploadProgress}%...` : 'Add Photos'}
            </button>
            <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleImagesUpload} className="hidden" disabled={uploading} />
          </div>

          {uploading && (
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-primary-600 h-2 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
            </div>
          )}

          {images.length === 0 ? (
            <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-primary-400 transition-colors"
              onClick={() => fileRef.current?.click()}>
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Click to upload multiple photos</span>
            </label>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {images.map((img, i) => (
                <div key={i} className="relative group aspect-square">
                  <img src={img.image_url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover rounded-lg" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors rounded-lg flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                    <button type="button" onClick={() => setCover(img.image_url)} title="Set as cover"
                      className="w-7 h-7 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs hover:bg-primary-700">★</button>
                    <button type="button" onClick={() => removeImage(i)}
                      className="w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  {form.cover_image === img.image_url && (
                    <div className="absolute top-1 left-1 bg-primary-600 text-white text-xs px-1.5 py-0.5 rounded">Cover</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 max-w-xs">
          <button type="button" onClick={() => navigate('/admin/gallery')} className="flex-1 btn-secondary">Cancel</button>
          <button type="submit" disabled={loading} className="flex-1 btn-primary flex items-center justify-center gap-2">
            {loading && <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}{isEdit ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GalleryForm;
