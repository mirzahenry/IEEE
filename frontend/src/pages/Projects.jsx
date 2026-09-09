import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Rocket, Github, ExternalLink, ChevronRight, Filter } from 'lucide-react';
import { supabase } from '../config/supabase';
import { truncateText } from '../utils/helpers';
import SectionHeader from '../components/common/SectionHeader';
import Badge from '../components/common/Badge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import Pagination from '../components/common/Pagination';

const CATEGORIES = ['All', 'GIS', 'Remote Sensing', 'Machine Learning', 'Earth Observation', 'Environmental Monitoring', 'Geospatial AI', 'Climate', 'Urban Planning', 'Agriculture', 'Disaster Management', 'Other'];
const STATUS_COLORS = { planning: 'primary', ongoing: 'success', completed: 'warning', paused: 'danger' };

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const PER_PAGE = 9;

  useEffect(() => { fetchProjects(); }, [category, page]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      let q = supabase.from('projects').select('*', { count: 'exact' });
      if (category !== 'All') q = q.eq('category', category);
      q = q.order('created_at', { ascending: false }).range((page - 1) * PER_PAGE, page * PER_PAGE - 1);
      const { data, error, count } = await q;
      if (error) throw error;
      setProjects(data || []);
      setTotal(count || 0);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen pt-20">
      <section className="py-16 bg-gradient-to-br from-primary-900 to-gray-900 text-white">
        <div className="container-custom text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Rocket className="w-14 h-14 mx-auto mb-4 text-primary-300" />
            <h1 className="heading-xl mb-4">Projects</h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">Innovative research and technology projects from our society.</p>
          </motion.div>
        </div>
      </section>

      <section className="section bg-white dark:bg-gray-900">
        <div className="container-custom">
          {/* Filters */}
          <div className="flex items-center gap-2 mb-8 flex-wrap">
            <Filter className="w-4 h-4 text-gray-500" />
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => { setCategory(cat); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  category === cat ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}>{cat}</button>
            ))}
          </div>

          {loading ? <LoadingSpinner /> : projects.length === 0
            ? <EmptyState icon={Rocket} title="No projects found" description="Projects will appear here once added." />
            : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {projects.map((project, i) => (
                  <motion.div key={project.id}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                    className="card card-hover overflow-hidden group">
                    <div className="h-44 bg-gradient-to-br from-primary-800 to-earth-800 relative overflow-hidden">
                      {project.image_url
                        ? <img src={project.image_url} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        : <div className="w-full h-full flex items-center justify-center"><Rocket className="w-16 h-16 text-white/20" /></div>
                      }
                      <div className="absolute top-3 left-3 flex gap-2">
                        <Badge variant={STATUS_COLORS[project.status] || 'gray'}>{project.status}</Badge>
                      </div>
                    </div>
                    <div className="p-5">
                      <Badge variant="gray" size="sm">{project.category}</Badge>
                      <h3 className="font-bold text-gray-900 dark:text-white my-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{truncateText(project.description, 100)}</p>
                      {project.technologies && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {project.technologies.split(',').slice(0, 3).map(tech => (
                            <span key={tech} className="px-2 py-0.5 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded text-xs">{tech.trim()}</span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <Link to={`/projects/${project.slug}`}
                          className="inline-flex items-center gap-1 text-primary-600 dark:text-primary-400 text-sm font-medium hover:gap-2 transition-all">
                          View Details <ChevronRight className="w-4 h-4" />
                        </Link>
                        <div className="flex gap-2">
                          {project.github_url && (
                            <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                              className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                              <Github className="w-4 h-4" />
                            </a>
                          )}
                          {project.demo_url && (
                            <a href={project.demo_url} target="_blank" rel="noopener noreferrer"
                              className="text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
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

export default Projects;
