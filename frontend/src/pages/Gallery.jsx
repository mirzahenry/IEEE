import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Image, Calendar, ChevronRight } from 'lucide-react';
import { supabase } from '../config/supabase';
import { formatDate } from '../utils/helpers';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';

const Gallery = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('gallery_albums')
      .select(`*, gallery_images(count)`)
      .order('event_date', { ascending: false })
      .then(({ data, error }) => {
        if (!error) setAlbums(data || []);
      }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen pt-20">
      <section className="py-16 bg-gradient-to-br from-primary-900 to-gray-900 text-white">
        <div className="container-custom text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Image className="w-14 h-14 mx-auto mb-4 text-primary-300" />
            <h1 className="heading-xl mb-4">Gallery</h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">Explore moments from our events and activities.</p>
          </motion.div>
        </div>
      </section>

      <section className="section bg-white dark:bg-gray-900">
        <div className="container-custom">
          {loading ? <LoadingSpinner /> : albums.length === 0
            ? <EmptyState icon={Image} title="No albums yet" description="Gallery albums will appear here once added." />
            : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {albums.map((album, i) => (
                <motion.div key={album.id}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  className="card card-hover overflow-hidden group">
                  <Link to={`/gallery/${album.slug}`}>
                    <div className="h-52 overflow-hidden bg-gradient-to-br from-primary-700 to-earth-700">
                      {album.cover_image
                        ? <img src={album.cover_image} alt={album.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        : <div className="w-full h-full flex items-center justify-center"><Image className="w-16 h-16 text-white/30" /></div>
                      }
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {album.title}
                      </h3>
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        {album.event_date && (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(album.event_date, 'short')}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-primary-600 dark:text-primary-400 font-medium">
                          View <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Gallery;
