import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Megaphone, Calendar, User, ChevronRight, Star } from 'lucide-react';
import { getAnnouncements } from '../services/announcementsService';
import { formatDate, truncateText } from '../utils/helpers';
import SectionHeader from '../components/common/SectionHeader';
import Badge from '../components/common/Badge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import Pagination from '../components/common/Pagination';

const Announcements = () => {
  const [items, setItems]   = useState([]);
  const [total, setTotal]   = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage]     = useState(1);
  const PER_PAGE = 9;

  useEffect(() => { load(); }, [page]);

  const load = async () => {
    setLoading(true);
    const { data, count } = await getAnnouncements({ page, limit: PER_PAGE });
    setItems(data);
    setTotal(count);
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-primary-900 to-gray-900 text-white">
        <div className="container-custom text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Megaphone className="w-14 h-14 mx-auto mb-4 text-primary-300" />
            <h1 className="heading-xl mb-4">Announcements</h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Stay up-to-date with the latest news, updates, and announcements from GRSS.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section bg-white dark:bg-gray-900">
        <div className="container-custom">
          {loading ? <LoadingSpinner /> : items.length === 0 ? (
            <EmptyState icon={Megaphone} title="No announcements yet"
              description="Check back soon for the latest news from GRSS." />
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {items.map((item, i) => (
                  <motion.article key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="card card-hover overflow-hidden group flex flex-col">

                    {/* Cover image */}
                    {item.featured_image && (
                      <div className="h-44 overflow-hidden bg-gray-100 dark:bg-gray-700">
                        <img src={item.featured_image} alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy" />
                      </div>
                    )}

                    <div className="p-6 flex flex-col flex-1">
                      {/* Badges */}
                      <div className="flex items-center gap-2 mb-3">
                        {item.is_featured && (
                          <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400 text-xs font-semibold">
                            <Star className="w-3 h-3 fill-current" /> Featured
                          </span>
                        )}
                        <Badge variant="primary" size="sm">Announcement</Badge>
                      </div>

                      <h2 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {item.title}
                      </h2>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-1 line-clamp-3">
                        {truncateText(item.content, 130)}
                      </p>

                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(item.publish_date, 'short')}
                          </div>
                          {item.author && (
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {item.author}
                            </div>
                          )}
                        </div>
                        <Link to={`/announcements/${item.slug}`}
                          className="flex items-center gap-1 text-primary-600 dark:text-primary-400 text-xs font-semibold hover:gap-2 transition-all">
                          Read <ChevronRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>

              {total > PER_PAGE && (
                <Pagination
                  currentPage={page}
                  totalPages={Math.ceil(total / PER_PAGE)}
                  onPageChange={p => { setPage(p); window.scrollTo(0, 0); }}
                  itemsPerPage={PER_PAGE}
                  totalItems={total}
                />
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Announcements;
