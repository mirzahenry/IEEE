import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Star, Filter } from 'lucide-react';
import { supabase } from '../config/supabase';
import { formatDate } from '../utils/helpers';
import SectionHeader from '../components/common/SectionHeader';
import Badge from '../components/common/Badge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import Pagination from '../components/common/Pagination';

const CATEGORIES = ['All', 'Competition Award', 'Research Award', 'University Award', 'Hackathon', 'Conference', 'National', 'International', 'Other'];

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const PER_PAGE = 9;

  useEffect(() => { fetchAchievements(); }, [category, page]);

  const fetchAchievements = async () => {
    setLoading(true);
    try {
      let q = supabase.from('achievements').select('*', { count: 'exact' });
      if (category !== 'All') q = q.eq('category', category);
      q = q.order('achievement_date', { ascending: false }).range((page - 1) * PER_PAGE, page * PER_PAGE - 1);
      const { data, error, count } = await q;
      if (error) throw error;
      setAchievements(data || []);
      setTotal(count || 0);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen pt-20">
      <section className="py-16 bg-gradient-to-br from-primary-900 to-gray-900 text-white">
        <div className="container-custom text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Award className="w-14 h-14 mx-auto mb-4 text-yellow-400" />
            <h1 className="heading-xl mb-4">Achievements</h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Celebrating the accomplishments of our society members.
            </p>
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

          {loading ? <LoadingSpinner /> : achievements.length === 0
            ? <EmptyState icon={Award} title="No achievements found" />
            : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {achievements.map((ach, i) => (
                  <motion.div key={ach.id}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                    className={`card card-hover overflow-hidden ${ach.is_featured ? 'ring-2 ring-yellow-400 dark:ring-yellow-500' : ''}`}>
                    {ach.image_url && (
                      <div className="h-44 overflow-hidden">
                        <img src={ach.image_url} alt={ach.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}
                    <div className={`p-6 ${!ach.image_url ? 'pt-8 text-center' : ''}`}>
                      {!ach.image_url && (
                        <div className="w-14 h-14 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Award className="w-7 h-7 text-yellow-600 dark:text-yellow-400" />
                        </div>
                      )}
                      {ach.is_featured && (
                        <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400 text-xs font-medium mb-2">
                          <Star className="w-3 h-3 fill-current" /> Featured
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2 mb-2">
                        {ach.category && <Badge variant="warning" size="sm">{ach.category}</Badge>}
                        {ach.award_position && <Badge variant="success" size="sm">{ach.award_position}</Badge>}
                      </div>
                      <h3 className="font-bold text-gray-900 dark:text-white mb-2">{ach.title}</h3>
                      {ach.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-3">{ach.description}</p>
                      )}
                      {ach.team_members && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                          <span className="font-medium">Team:</span> {ach.team_members}
                        </p>
                      )}
                      {ach.achievement_date && (
                        <p className="text-xs text-gray-400">{formatDate(ach.achievement_date, 'short')}</p>
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

export default Achievements;
