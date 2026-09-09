import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, User, ExternalLink, ArrowLeft, Share2, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../config/supabase';
import { formatDate, formatTime, isValidEmail, isValidPhone } from '../utils/helpers';
import Badge from '../components/common/Badge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorState from '../components/common/ErrorState';
import toast from 'react-hot-toast';

const STATUS_COLORS = { upcoming: 'primary', ongoing: 'success', completed: 'warning', cancelled: 'danger' };

const EventDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRegForm, setShowRegForm] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', student_id: '', department: '', semester: '', batch: '', participation_type: 'Individual', message: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchEvent();
  }, [slug]);

  const fetchEvent = async () => {
    try {
      const { data, error } = await supabase.from('events').select('*').eq('slug', slug).single();
      if (error) throw error;
      setEvent(data);
    } catch (err) {
      setError('Event not found');
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.full_name.trim()) errs.full_name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!isValidEmail(form.email)) errs.email = 'Invalid email';
    if (form.phone && !isValidPhone(form.phone)) errs.phone = 'Invalid phone number';
    return errs;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setRegLoading(true);
    try {
      const { error } = await supabase.from('event_registrations')
        .insert([{ ...form, event_id: event.id }]);
      if (error) {
        if (error.code === '23505') throw new Error('You have already registered for this event.');
        throw error;
      }
      setRegSuccess(true);
      toast.success('Registration successful!');
    } catch (err) {
      toast.error(err.message || 'Registration failed. Please try again.');
    } finally {
      setRegLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: event.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied!');
    }
  };

  if (loading) return <div className="pt-20"><LoadingSpinner /></div>;
  if (error) return <div className="pt-20"><ErrorState message={error} onRetry={() => navigate('/events')} /></div>;

  const isPast = event.status === 'completed' || event.status === 'cancelled';

  return (
    <div className="min-h-screen pt-20">
      {/* Breadcrumb */}
      <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
        <div className="container-custom py-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400">Home</Link>
          <span>/</span>
          <Link to="/events" className="hover:text-primary-600 dark:hover:text-primary-400">Events</Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white line-clamp-1">{event.title}</span>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              {/* Poster */}
              {event.poster_url && (
                <div className="rounded-2xl overflow-hidden mb-8 shadow-lg">
                  <img src={event.poster_url} alt={event.title} className="w-full max-h-96 object-cover" />
                </div>
              )}

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant={STATUS_COLORS[event.status]} size="lg">{event.status}</Badge>
                {event.event_type && <Badge variant="gray" size="lg">{event.event_type.replace('_', ' ')}</Badge>}
                {event.is_featured && <Badge variant="warning" size="lg">Featured</Badge>}
              </div>

              <h1 className="heading-lg text-gray-900 dark:text-white mb-6">{event.title}</h1>

              {/* Details Grid */}
              <div className="grid sm:grid-cols-2 gap-4 mb-8 p-6 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</p>
                    <p className="font-medium text-gray-900 dark:text-white">{formatDate(event.event_date)}</p>
                  </div>
                </div>
                {event.start_time && (
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Time</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatTime(event.start_time)}{event.end_time && ` – ${formatTime(event.end_time)}`}
                      </p>
                    </div>
                  </div>
                )}
                {event.venue && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Venue</p>
                      <p className="font-medium text-gray-900 dark:text-white">{event.venue}</p>
                    </div>
                  </div>
                )}
                {event.speaker && (
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Speaker</p>
                      <p className="font-medium text-gray-900 dark:text-white">{event.speaker}</p>
                      {event.speaker_designation && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">{event.speaker_designation}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              {event.description && (
                <div className="prose dark:prose-invert max-w-none">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">About This Event</h2>
                  <div className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {event.description}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <div className="card p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-4">Registration</h3>

              {event.registration_deadline && (
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <AlertCircle className="w-4 h-4 text-yellow-500" />
                  Deadline: {formatDate(event.registration_deadline, 'short')}
                </div>
              )}

              {regSuccess ? (
                <div className="text-center py-4">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                  <p className="font-semibold text-gray-900 dark:text-white">Successfully Registered!</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">We'll see you at the event.</p>
                </div>
              ) : isPast ? (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                  <p className="text-sm">This event has ended.</p>
                </div>
              ) : !event.registration_enabled ? (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                  <p className="text-sm">Registration is not available for this event.</p>
                </div>
              ) : (
                <>
                  {!showRegForm ? (
                    <div className="space-y-3">
                      <button onClick={() => setShowRegForm(true)} className="w-full btn-primary">
                        Register Now
                      </button>
                      {event.registration_link && (
                        <a href={event.registration_link} target="_blank" rel="noopener noreferrer"
                          className="w-full btn-secondary flex items-center justify-center gap-2">
                          <ExternalLink className="w-4 h-4" /> External Form
                        </a>
                      )}
                    </div>
                  ) : (
                    <form onSubmit={handleRegister} className="space-y-3">
                      {[
                        { field: 'full_name', label: 'Full Name *', type: 'text', placeholder: 'Your name' },
                        { field: 'email', label: 'Email *', type: 'email', placeholder: 'your@email.com' },
                        { field: 'phone', label: 'Phone', type: 'tel', placeholder: '+1 234 567 8900' },
                        { field: 'student_id', label: 'Student ID', type: 'text', placeholder: 'Your student ID' },
                        { field: 'department', label: 'Department', type: 'text', placeholder: 'Your department' },
                        { field: 'semester', label: 'Semester', type: 'text', placeholder: 'e.g. 6th' },
                        { field: 'batch', label: 'Batch', type: 'text', placeholder: 'e.g. 2022' },
                      ].map(({ field, label, type, placeholder }) => (
                        <div key={field}>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
                          <input type={type} value={form[field]} placeholder={placeholder}
                            onChange={e => { setForm({ ...form, [field]: e.target.value }); setErrors({ ...errors, [field]: '' }); }}
                            className={`input py-2 text-sm ${errors[field] ? 'border-red-500' : ''}`} />
                          {errors[field] && <p className="text-red-500 text-xs mt-0.5">{errors[field]}</p>}
                        </div>
                      ))}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Participation Type</label>
                        <select value={form.participation_type}
                          onChange={e => setForm({ ...form, participation_type: e.target.value })}
                          className="select py-2 text-sm">
                          <option>Individual</option>
                          <option>Team</option>
                          <option>Observer</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Message (optional)</label>
                        <textarea value={form.message} rows={2}
                          onChange={e => setForm({ ...form, message: e.target.value })}
                          className="textarea text-sm" placeholder="Any questions or notes?" />
                      </div>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => setShowRegForm(false)}
                          className="flex-1 btn-secondary text-sm py-2">Cancel</button>
                        <button type="submit" disabled={regLoading}
                          className="flex-1 btn-primary text-sm py-2 flex items-center justify-center gap-1">
                          {regLoading
                            ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            : 'Submit'}
                        </button>
                      </div>
                    </form>
                  )}
                </>
              )}

              {/* Share */}
              <button onClick={handleShare}
                className="w-full flex items-center justify-center gap-2 mt-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm transition-colors">
                <Share2 className="w-4 h-4" /> Share Event
              </button>
            </div>

            {/* Back Button */}
            <Link to="/events" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Events
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
