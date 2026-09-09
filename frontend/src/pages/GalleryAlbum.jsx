import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Calendar, ArrowLeft, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { supabase } from '../config/supabase';
import { formatDate } from '../utils/helpers';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorState from '../components/common/ErrorState';

const GalleryAlbum = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [album, setAlbum] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    supabase.from('gallery_albums').select(`*, gallery_images(*)`).eq('slug', slug).single()
      .then(({ data, error }) => {
        if (error) navigate('/gallery');
        else {
          setAlbum(data);
          setImages(data.gallery_images?.sort((a, b) => a.display_order - b.display_order) || []);
        }
      }).finally(() => setLoading(false));
  }, [slug]);

  const prev = () => setLightboxIndex(i => (i - 1 + images.length) % images.length);
  const next = () => setLightboxIndex(i => (i + 1) % images.length);

  useEffect(() => {
    const handler = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape') setLightboxIndex(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxIndex, images.length]);

  if (loading) return <div className="pt-20"><LoadingSpinner /></div>;
  if (!album) return <div className="pt-20"><ErrorState message="Album not found" onRetry={() => navigate('/gallery')} /></div>;

  return (
    <div className="min-h-screen pt-20">
      <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
        <div className="container-custom py-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Link to="/" className="hover:text-primary-600">Home</Link>
          <span>/</span>
          <Link to="/gallery" className="hover:text-primary-600">Gallery</Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white">{album.title}</span>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="mb-8">
          <h1 className="heading-lg text-gray-900 dark:text-white mb-2">{album.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            {album.event_date && (
              <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{formatDate(album.event_date)}</div>
            )}
            <div className="flex items-center gap-1.5"><Image className="w-4 h-4" />{images.length} photos</div>
          </div>
          {album.description && <p className="text-gray-600 dark:text-gray-300 mt-3 max-w-2xl">{album.description}</p>}
        </div>

        {/* Masonry Grid */}
        {images.length === 0
          ? <div className="text-center py-16 text-gray-500 dark:text-gray-400"><Image className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>No images in this album yet.</p></div>
          : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
            {images.map((img, i) => (
              <motion.div key={img.id}
                initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.03 }}
                className="break-inside-avoid cursor-pointer group relative overflow-hidden rounded-lg shadow-md"
                onClick={() => setLightboxIndex(i)}>
                <img src={img.image_url} alt={img.caption || `Photo ${i + 1}`}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <Link to="/gallery" className="inline-flex items-center gap-2 mt-8 text-gray-600 dark:text-gray-400 hover:text-primary-600 text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Gallery
        </Link>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setLightboxIndex(null)}>
            <button onClick={() => setLightboxIndex(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10">
              <X className="w-8 h-8" />
            </button>
            <button onClick={e => { e.stopPropagation(); prev(); }}
              className="absolute left-4 text-white hover:text-gray-300 transition-colors z-10">
              <ChevronLeft className="w-10 h-10" />
            </button>
            <motion.img
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              src={images[lightboxIndex]?.image_url}
              alt={images[lightboxIndex]?.caption}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              onClick={e => e.stopPropagation()} />
            <button onClick={e => { e.stopPropagation(); next(); }}
              className="absolute right-4 text-white hover:text-gray-300 transition-colors z-10">
              <ChevronRight className="w-10 h-10" />
            </button>
            <div className="absolute bottom-6 text-center text-white">
              <p className="text-sm opacity-70">{lightboxIndex + 1} / {images.length}</p>
              {images[lightboxIndex]?.caption && <p className="text-sm mt-1">{images[lightboxIndex].caption}</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryAlbum;
