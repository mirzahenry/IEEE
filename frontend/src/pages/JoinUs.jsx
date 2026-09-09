import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, CheckCircle, Send, Star, Rocket, Globe, BookOpen } from 'lucide-react';
import { supabase } from '../config/supabase';
import { isValidEmail } from '../utils/helpers';
import toast from 'react-hot-toast';

const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } }),
};

const POSITIONS = [
  'General Member',
  'Event Volunteer',
  'Research Team',
  'Media & Design Team',
  'Technical / IT Team',
  'Field Operations Team',
  'Any Available Position',
];

const BENEFITS = [
  { icon: BookOpen, title: 'Learn & Grow',    desc: 'Workshops, seminars & hands-on training in GIS and Remote Sensing' },
  { icon: Users,    title: 'Network',         desc: 'Connect with students, researchers, and industry professionals' },
  { icon: Rocket,   title: 'Research',        desc: 'Work on real-world geoscience and satellite data projects' },
  { icon: Globe,    title: 'Impact',          desc: 'Contribute to environmental monitoring and geospatial innovation' },
  { icon: Star,     title: 'Recognition',     desc: 'Win competitions, earn certificates, and build your portfolio' },
];

const JoinUs = () => {
  const [positions, setPositions] = useState(POSITIONS);
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [errors,    setErrors]    = useState({});

  const [form, setForm] = useState({
    full_name:         '',
    email:             '',
    phone:             '',
    student_id:        '',
    department:        '',
    semester:          '',
    batch:             '',
    position_interest: '',
    skills:            '',
    why_join:          '',
    experience:        '',
  });

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.full_name.trim())         errs.full_name   = 'Name is required';
    if (!form.email.trim())             errs.email       = 'Email is required';
    else if (!isValidEmail(form.email)) errs.email       = 'Invalid email';
    if (!form.department.trim())        errs.department  = 'Department is required';
    if (!form.position_interest)        errs.position_interest = 'Please select a position';
    if (!form.why_join.trim())          errs.why_join    = 'Please tell us why you want to join';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('membership_applications')
        .insert([form]);

      if (error) throw error;
      setSubmitted(true);
      toast.success('Application submitted successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-white dark:bg-gray-900 px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md">
          <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Application Submitted! 🎉
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            Thank you, <strong>{form.full_name}</strong>!
          </p>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            We've received your application. Our team will review it and contact you at{' '}
            <strong>{form.email}</strong> within 3–5 business days.
          </p>
          <button onClick={() => { setSubmitted(false); setForm({ full_name:'',email:'',phone:'',student_id:'',department:'',semester:'',batch:'',position_interest:'',skills:'',why_join:'',experience:'' }); }}
            className="btn-outline">
            Submit Another Application
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">

      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-primary-900 to-gray-900 text-white">
        <div className="container-custom text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Users className="w-14 h-14 mx-auto mb-4 text-primary-300" />
            <h1 className="heading-xl mb-4">Join IEEE</h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Become a part of the IEEE Geosciences & Remote Sensing Society. Explore, Learn, and Innovate with us!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800/50">
        <div className="container-custom">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Why Join Us?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {BENEFITS.map((b, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible"
                viewport={{ once: true }} custom={i}
                className="card p-5 text-center">
                <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <b.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{b.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="section bg-white dark:bg-gray-900">
        <div className="container-custom max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="heading-md text-gray-900 dark:text-white mb-3">Membership Application</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Fill in the form below and we'll get back to you soon!
            </p>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <form onSubmit={handleSubmit} className="card p-8 space-y-6">

              {/* Personal Info */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-7 h-7 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                  Personal Information
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name *</label>
                    <input type="text" value={form.full_name} onChange={e => set('full_name', e.target.value)}
                      className={`input ${errors.full_name ? 'border-red-500' : ''}`} placeholder="Your full name" />
                    {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address *</label>
                    <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                      className={`input ${errors.email ? 'border-red-500' : ''}`} placeholder="your@email.com" />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone Number</label>
                    <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
                      className="input" placeholder="+92 300 1234567" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Student ID</label>
                    <input type="text" value={form.student_id} onChange={e => set('student_id', e.target.value)}
                      className="input" placeholder="e.g. 2022-CS-001" />
                  </div>
                </div>
              </div>

              {/* Academic Info */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-7 h-7 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  Academic Information
                </h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Department *</label>
                    <input type="text" value={form.department} onChange={e => set('department', e.target.value)}
                      className={`input ${errors.department ? 'border-red-500' : ''}`} placeholder="e.g. Remote Sensing" />
                    {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Semester</label>
                    <input type="text" value={form.semester} onChange={e => set('semester', e.target.value)}
                      className="input" placeholder="e.g. 4th" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Batch / Year</label>
                    <input type="text" value={form.batch} onChange={e => set('batch', e.target.value)}
                      className="input" placeholder="e.g. 2022" />
                  </div>
                </div>
              </div>

              {/* Position & Skills */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-7 h-7 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                  Position & Skills
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Position of Interest *
                    </label>
                    <select value={form.position_interest} onChange={e => set('position_interest', e.target.value)}
                      className={`select ${errors.position_interest ? 'border-red-500' : ''}`}>
                      <option value="">-- Select a position --</option>
                      {positions.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    {errors.position_interest && <p className="text-red-500 text-xs mt-1">{errors.position_interest}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Skills & Expertise
                    </label>
                    <input type="text" value={form.skills} onChange={e => set('skills', e.target.value)}
                      className="input" placeholder="e.g. Python, QGIS, Remote Sensing, Photography, Video Editing..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Previous Experience
                    </label>
                    <textarea value={form.experience} onChange={e => set('experience', e.target.value)}
                      className="textarea" rows={3}
                      placeholder="Any relevant experience, projects, clubs, or activities..." />
                  </div>
                </div>
              </div>

              {/* Motivation */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-7 h-7 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                  Motivation
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Why do you want to join IEEE? *
                  </label>
                  <textarea value={form.why_join} onChange={e => set('why_join', e.target.value)}
                    className={`textarea ${errors.why_join ? 'border-red-500' : ''}`} rows={4}
                    placeholder="Tell us about your interest in geosciences, remote sensing, or GIS, and what you hope to contribute and learn..." />
                  {errors.why_join && <p className="text-red-500 text-xs mt-1">{errors.why_join}</p>}
                </div>
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading}
                className="w-full btn-primary py-4 flex items-center justify-center gap-2 text-lg">
                {loading
                  ? <><div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</>
                  : <><Send className="w-5 h-5" /> Submit Application</>
                }
              </button>

              <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                By submitting, you agree to be contacted by IEEE regarding your membership application.
              </p>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default JoinUs;
