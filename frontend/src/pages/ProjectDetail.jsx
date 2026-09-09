import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Rocket, Github, ExternalLink, FileText, Calendar, Users, ArrowLeft } from 'lucide-react';
import { supabase } from '../config/supabase';
import { formatDate } from '../utils/helpers';
import Badge from '../components/common/Badge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorState from '../components/common/ErrorState';

const STATUS_COLORS = { planning: 'primary', ongoing: 'success', completed: 'warning', paused: 'danger' };

const ProjectDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    supabase.from('projects').select(`*, project_members(*)`).eq('slug', slug).single()
      .then(({ data, error }) => {
        if (error) { setError('Project not found'); }
        else setProject(data);
      }).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="pt-20"><LoadingSpinner /></div>;
  if (error) return <div className="pt-20"><ErrorState message={error} onRetry={() => navigate('/projects')} /></div>;

  return (
    <div className="min-h-screen pt-20">
      <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
        <div className="container-custom py-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Link to="/" className="hover:text-primary-600">Home</Link>
          <span>/</span>
          <Link to="/projects" className="hover:text-primary-600">Projects</Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white line-clamp-1">{project.title}</span>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              {project.image_url && (
                <div className="rounded-2xl overflow-hidden mb-8 shadow-lg">
                  <img src={project.image_url} alt={project.title} className="w-full max-h-80 object-cover" />
                </div>
              )}
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant={STATUS_COLORS[project.status]}>{project.status}</Badge>
                <Badge variant="gray">{project.category}</Badge>
                {project.is_featured && <Badge variant="warning">Featured</Badge>}
              </div>
              <h1 className="heading-lg text-gray-900 dark:text-white mb-6">{project.title}</h1>

              {project.description && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Description</h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{project.description}</p>
                </div>
              )}

              {project.project_members?.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5" /> Team Members
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {project.project_members.map(m => (
                      <div key={m.id} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <div className="w-7 h-7 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold">
                          {m.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{m.name}</p>
                          {m.role && <p className="text-xs text-gray-500 dark:text-gray-400">{m.role}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {project.technologies && (
                <div className="mt-8">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Technologies</h2>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.split(',').map(tech => (
                      <span key={tech} className="px-3 py-1.5 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-lg text-sm font-medium">
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          <div className="space-y-4">
            <div className="card p-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Project Info</h3>
              <div className="space-y-3">
                {project.supervisor && (
                  <div><p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Supervisor</p>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">{project.supervisor}</p></div>
                )}
                {project.start_date && (
                  <div><p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Start Date</p>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">{formatDate(project.start_date)}</p></div>
                )}
                {project.end_date && (
                  <div><p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">End Date</p>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">{formatDate(project.end_date)}</p></div>
                )}
              </div>

              <div className="space-y-2 mt-6">
                {project.github_url && (
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 w-full btn-secondary text-sm py-2.5">
                    <Github className="w-4 h-4" /> View on GitHub
                  </a>
                )}
                {project.demo_url && (
                  <a href={project.demo_url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 w-full btn-primary text-sm py-2.5">
                    <ExternalLink className="w-4 h-4" /> Live Demo
                  </a>
                )}
                {project.report_url && (
                  <a href={project.report_url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 w-full btn-secondary text-sm py-2.5">
                    <FileText className="w-4 h-4" /> View Report
                  </a>
                )}
              </div>
            </div>
            <Link to="/projects" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 text-sm transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Projects
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
