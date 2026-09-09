import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft, Share2, Tag } from 'lucide-react';
import { getAnnouncementBySlug } from '../services/announcementsService';
import { formatDate } from '../utils/helpers';
import Badge from '../components/common/Badge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorState from '../components/common/ErrorState';
import toast from 'react-hot-toast';

const AnnouncementDetail = () => {
  const { slug } = useParams();
  const navigate  = useNavigate();
  const [item, setItem]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    getAnnouncementBySlug(slug)
      .then(setItem)
      .catch(() => setError('Announcement not found'))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: item.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied!');
    }
  };

  if (loading) return <div className="pt-20"><LoadingSpinner /></div>;
  if (error)   return <div className="pt-20"><ErrorState message={error} onRetry={() => navigate('/announcements')} /></div>;

  return (
    <div className="min-h-screen pt-20">
      {/* Breadcrumb */}
      <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
        <div className="container-custom py-3 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/announcements" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Announcements</Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white line-clamp-1">{item.title}</span>
        </div>
      </div>

      <div className="container-custom py-12 max-w-4xl">
        <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

          {/* Cover image */}
          {item.featured_image && (
            <div className="rounded-2xl overflow-hidden mb-8 shadow-lg">
              <img src={item.featured_image} alt={item.title}
                className="w-full max-h-80 object-cover" />
            </div>
          )}

          {/* Badge + meta */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge variant="primary">Announcement</Badge>
            {item.is_featured && <Badge variant="warning">Featured</Badge>}
          </div>

          <h1 className="heading-lg text-gray-900 dark:text-white mb-6 leading-tight">
            {item.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-5 text-sm text-gray-500 dark:text-gray-400 mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary-500" />
              {formatDate(item.publish_date)}
            </div>
            {item.author && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-primary-500" />
                {item.author}
              </div>
            )}
            <button onClick={handleShare}
              className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-xs">
              <Share2 className="w-3.5 h-3.5" /> Share
            </button>
          </div>

          {/* Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
              {item.content}
            </div>
          </div>

          {/* Back */}
          <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Link to="/announcements"
              className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-medium hover:gap-3 transition-all">
              <ArrowLeft className="w-4 h-4" /> Back to Announcements
            </Link>
          </div>
        </motion.article>
      </div>
    </div>
  );
};

export default AnnouncementDetail;
