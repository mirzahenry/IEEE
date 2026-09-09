import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search as SearchIcon, Calendar, Rocket, Award, FileText, Users, X } from 'lucide-react';
import { supabase } from '../config/supabase';
import { debounce, formatDate, truncateText } from '../utils/helpers';
import Badge from '../components/common/Badge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';

const CATEGORY_ICONS = { event: Calendar, project: Rocket, achievement: Award, resource: FileText, member: Users };
const CATEGORY_COLORS = { event: 'primary', project: 'success', achievement: 'warning', resource: 'info', member: 'gray' };

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const doSearch = async (q) => {
    if (!q.trim() || q.trim().length < 2) { setResults([]); setSearched(false); return; }
    setLoading(true);
    setSearched(true);
    try {
      const term = `%${q}%`;
      const [eventsRes, projectsRes, achievementsRes, resourcesRes, membersRes] = await Promise.all([
        supabase.from('events').select('id,title,short_description,event_date,slug,status').or(`title.ilike.${term},short_description.ilike.${term}`).limit(5),
        supabase.from('projects').select('id,title,description,slug,status,category').or(`title.ilike.${term},description.ilike.${term}`).limit(5),
        supabase.from('achievements').select('id,title,description,achievement_date,category').or(`title.ilike.${term},description.ilike.${term}`).limit(5),
        supabase.from('resources').select('id,title,description,slug,category').eq('is_published', true).or(`title.ilike.${term},description.ilike.${term}`).limit(5),
        supabase.from('excom_members').select('id,name,bio,excom_positions(title)').or(`name.ilike.${term},bio.ilike.${term}`).eq('is_active', true).limit(5),
      ]);

      const allResults = [
        ...(eventsRes.data || []).map(e => ({ ...e, _type: 'event', _path: `/events/${e.slug}`, _desc: e.short_description })),
        ...(projectsRes.data || []).map(p => ({ ...p, _type: 'project', _path: `/projects/${p.slug}`, _desc: p.description })),
        ...(achievementsRes.data || []).map(a => ({ ...a, _type: 'achievement', _path: '/achievements', _desc: a.description })),
        ...(resourcesRes.data || []).map(r => ({ ...r, _type: 'resource', _path: `/resources/${r.slug}`, _desc: r.description })),
        ...(membersRes.data || []).map(m => ({ ...m, _type: 'member', _path: '/excom', _desc: m.bio, title: m.name, _subtitle: m.excom_positions?.title })),
      ];
      setResults(allResults);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const debouncedSearch = useCallback(debounce(doSearch, 400), []);

  useEffect(() => {
    const q = searchParams.get('q') || '';
    setQuery(q);
    if (q) doSearch(q);
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setSearchParams(val ? { q: val } : {});
    debouncedSearch(val);
  };

  return (
    <div className="min-h-screen pt-20">
      <section className="py-16 bg-gradient-to-br from-primary-900 to-gray-900 text-white">
        <div className="container-custom max-w-3xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="heading-xl mb-8">Search GRSS</h1>
            <div className="relative">
              <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input type="text" value={query} onChange={handleChange} autoFocus
                placeholder="Search events, projects, achievements, resources..."
                className="w-full pl-14 pr-12 py-5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 text-lg focus:outline-none focus:ring-2 focus:ring-white/30 transition-all" />
              {query && (
                <button onClick={() => { setQuery(''); setSearchParams({}); setResults([]); setSearched(false); }}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section bg-white dark:bg-gray-900">
        <div className="container-custom max-w-3xl">
          {loading ? <LoadingSpinner />
            : !searched ? (
              <EmptyState icon={SearchIcon} title="Start searching"
                description="Search across events, projects, achievements, resources, and ExCom members." />
            ) : results.length === 0 ? (
              <EmptyState icon={SearchIcon} title="No results found"
                description={`No results for "${query}". Try different keywords.`} />
            ) : (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Found <strong>{results.length}</strong> results for "<strong>{query}</strong>"
              </p>
              <div className="space-y-3">
                {results.map((result, i) => {
                  const Icon = CATEGORY_ICONS[result._type] || FileText;
                  return (
                    <motion.div key={`${result._type}-${result.id}`}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}>
                      <Link to={result._path}
                        className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all group">
                        <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/40 transition-colors">
                          <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <Badge variant={CATEGORY_COLORS[result._type]} size="sm">{result._type}</Badge>
                            {result._subtitle && <span className="text-xs text-gray-500 dark:text-gray-400">{result._subtitle}</span>}
                          </div>
                          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                            {result.title}
                          </h3>
                          {result._desc && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-1">
                              {truncateText(result._desc, 120)}
                            </p>
                          )}
                          {(result.event_date || result.achievement_date) && (
                            <p className="text-xs text-gray-400 mt-1">
                              {formatDate(result.event_date || result.achievement_date, 'short')}
                            </p>
                          )}
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Search;
