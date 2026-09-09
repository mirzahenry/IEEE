import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Download, User, Calendar, ArrowLeft } from 'lucide-react';
import { supabase } from '../config/supabase';
import { formatDate } from '../utils/helpers';
import Badge from '../components/common/Badge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorState from '../components/common/ErrorState';

const ResourceDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('resources').select('*').eq('slug', slug).single()
      .then(({ data, error }) => {
        if (error) navigate('/resources');
        else setResource(data);
      }).finally(() => setLoading(false));
  }, [slug]);

  const handleDownload = async () => {
    if (!resource?.file_url) return;
    // Increment download count
    await supabase.from('resources').update({ download_count: (resource.download_count || 0) + 1 }).eq('id', resource.id);
    window.open(resource.file_url, '_blank');
  };

  if (loading) return <div className="pt-20"><LoadingSpinner /></div>;
  if (!resource) return <div className="pt-20"><ErrorState message="Resource not found" onRetry={() => navigate('/resources')} /></div>;

  return (
    <div className="min-h-screen pt-20">
      <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
        <div className="container-custom py-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Link to="/" className="hover:text-primary-600">Home</Link>
          <span>/</span>
          <Link to="/resources" className="hover:text-primary-600">Resources</Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white line-clamp-1">{resource.title}</span>
        </div>
      </div>

      <div className="container-custom py-12 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {resource.thumbnail_url && (
            <div className="rounded-2xl overflow-hidden mb-8 shadow-lg h-64">
              <img src={resource.thumbnail_url} alt={resource.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-4">
            {resource.category && <Badge variant="primary">{resource.category}</Badge>}
            {resource.file_type && <Badge variant="gray">{resource.file_type?.toUpperCase()}</Badge>}
          </div>

          <h1 className="heading-lg text-gray-900 dark:text-white mb-6">{resource.title}</h1>

          <div className="flex flex-wrap gap-6 text-sm text-gray-500 dark:text-gray-400 mb-8">
            {resource.author && (
              <div className="flex items-center gap-2"><User className="w-4 h-4" />{resource.author}</div>
            )}
            <div className="flex items-center gap-2"><Calendar className="w-4 h-4" />{formatDate(resource.created_at)}</div>
            <div className="flex items-center gap-2"><Download className="w-4 h-4" />{resource.download_count || 0} downloads</div>
          </div>

          {resource.description && (
            <div className="card p-8 mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Description</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{resource.description}</p>
            </div>
          )}

          {resource.file_url && (
            <div className="card p-6 flex flex-col sm:flex-row items-center gap-4">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <p className="font-semibold text-gray-900 dark:text-white">{resource.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{resource.file_type?.toUpperCase()} File</p>
              </div>
              <button onClick={handleDownload}
                className="btn-primary flex items-center gap-2">
                <Download className="w-5 h-5" /> Download
              </button>
            </div>
          )}

          <Link to="/resources" className="inline-flex items-center gap-2 mt-8 text-gray-600 dark:text-gray-400 hover:text-primary-600 text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Resources
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default ResourceDetail;
