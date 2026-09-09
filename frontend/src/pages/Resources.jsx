import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Download, User, Filter, ChevronRight } from 'lucide-react';
import { supabase } from '../config/supabase';
import { formatDate, truncateText } from '../utils/helpers';
import Badge from '../components/common/Badge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import Pagination from '../components/common/Pagination';

const CATEGORIES = ['All', 'GIS', 'Remote Sensing', 'Machine Learning', 'Research Paper', 'Tutorial', 'Workshop Material', 'Resources', 'Blog'];
const FILE_TYPE_COLORS = { pdf: 'danger', ppt: 'warning', doc: 'primary', zip: 'gray' };

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const PER_PAGE = 9;

  useEffect(() => { fetchResources(); }, [category, page]);

  const fetchResources = async () => {
    setLoading(true);
    try {
      let q = supabase.from('resources').select('*', { count: 'exact' }).eq('is_published', true);
      if (category !== 'All') q = q.eq('category', category);
      q = q.order('created_at', { ascending: false }).range((page - 1) * PER_PAGE, page * PER_PAGE - 1);
      const { data, error, count } = await q;
      if (error) throw error;
      setResources(data || []);
      setTotal(count || 0);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen pt-20">
      <section className="py-16 bg-gradient-to-br from-primary-900 to-gray-900 text-white">
        <div className="container-custom text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <FileText className="w-14 h-14 mx-auto mb-4 text-primary-300" />
            <h1 className="heading-xl mb-4">Resources</h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">Research papers, tutorials, study material, and more.</p>
          </motion.div>
        </div>
      </section>

      <section className="section bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="flex items-center gap-2 mb-8 flex-wrap">
            <Filter className="w-4 h-4 text-gray-500" />
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => { setCategory(cat); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  category === cat ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}>{cat}</button>
            ))}
          </div>

          {loading ? <LoadingSpinner /> : resources.length === 0
            ? <EmptyState icon={FileText} title="No resources found" />
            : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {resources.map((res, i) => (
                  <motion.div key={res.id}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                    className="card card-hover p-6 group">
                    <div className="flex items-start gap-4 mb-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-primary-50 dark:bg-primary-900/20`}>
                        <FileText className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex gap-2 flex-wrap mb-1">
                          {res.category && <Badge variant="primary" size="sm">{res.category}</Badge>}
                          {res.file_type && <Badge variant={FILE_TYPE_COLORS[res.file_type?.toLowerCase()] || 'gray'} size="sm">{res.file_type?.toUpperCase()}</Badge>}
                        </div>
                      </div>
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {res.title}
                    </h3>
                    {res.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{truncateText(res.description, 100)}</p>
                    )}
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                      {res.author && <div className="flex items-center gap-1"><User className="w-3 h-3" />{res.author}</div>}
                      <div className="flex items-center gap-1"><Download className="w-3 h-3" />{res.download_count || 0} downloads</div>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/resources/${res.slug}`}
                        className="flex-1 text-center py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        Details
                      </Link>
                      {res.file_url && (
                        <a href={res.file_url} target="_blank" rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm transition-colors">
                          <Download className="w-4 h-4" /> Download
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
              {total > PER_PAGE && (
                <Pagination currentPage={page} totalPages={Math.ceil(total / PER_PAGE)}
                  onPageChange={setPage} itemsPerPage={PER_PAGE} totalItems={total} />
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Resources;
