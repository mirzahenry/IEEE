import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Instagram, Linkedin, Facebook, Youtube, CheckCircle } from 'lucide-react';
import { supabase } from '../config/supabase';
import useSettings from '../hooks/useSettings';
import { isValidEmail } from '../utils/helpers';
import toast from 'react-hot-toast';
import SectionHeader from '../components/common/SectionHeader';

const Contact = () => {
  const { settings } = useSettings();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!isValidEmail(form.email)) errs.email = 'Invalid email address';
    if (!form.message.trim()) errs.message = 'Message is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const { error } = await supabase.from('contact_messages').insert([form]);
      if (error) throw error;
      setSubmitted(true);
      setForm({ name: '', email: '', subject: '', message: '' });
      toast.success('Message sent successfully!');
    } catch (err) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const socialLinks = [
    { icon: Instagram, url: settings.instagram_url, label: 'Instagram', color: 'hover:bg-pink-600' },
    { icon: Linkedin, url: settings.linkedin_url, label: 'LinkedIn', color: 'hover:bg-blue-600' },
    { icon: Facebook, url: settings.facebook_url, label: 'Facebook', color: 'hover:bg-blue-800' },
    { icon: Youtube, url: settings.youtube_url, label: 'YouTube', color: 'hover:bg-red-600' },
  ].filter(s => s.url);

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-primary-900 to-gray-900 text-white">
        <div className="container-custom text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Mail className="w-16 h-16 mx-auto mb-4 text-primary-300" />
            <h1 className="heading-xl mb-4">Contact Us</h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Have questions or want to get involved? We'd love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="grid lg:grid-cols-5 gap-12">

            {/* Contact Info */}
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {settings.society_name || 'Geosciences & Remote Sensing Society'}
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  {settings.university_name || 'University'}
                  {settings.department && <> — {settings.department}</>}
                </p>
              </div>

              {[
                { icon: Mail, label: 'Email', value: settings.email, href: `mailto:${settings.email}` },
                { icon: Phone, label: 'Phone', value: settings.phone, href: `tel:${settings.phone}` },
                { icon: MapPin, label: 'Address', value: settings.address },
              ].map(({ icon: Icon, label, value, href }) => value && (
                <div key={label} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
                    {href
                      ? <a href={href} className="text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">{value}</a>
                      : <p className="text-gray-900 dark:text-white font-medium">{value}</p>
                    }
                  </div>
                </div>
              ))}

              {/* Social Links */}
              {socialLinks.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Follow Us</p>
                  <div className="flex gap-3">
                    {socialLinks.map(({ icon: Icon, url, label, color }) => (
                      <a key={label} href={url} target="_blank" rel="noopener noreferrer"
                        className={`w-10 h-10 bg-gray-200 dark:bg-gray-700 ${color} rounded-lg flex items-center justify-center transition-colors group`}
                        title={label}>
                        <Icon className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-white transition-colors" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Contact Form */}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} className="lg:col-span-3">
              {submitted ? (
                <div className="text-center py-16">
                  <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Message Sent!</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Thank you for reaching out. We'll get back to you soon.
                  </p>
                  <button onClick={() => setSubmitted(false)} className="btn-primary">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <div className="card p-8">
                  <SectionHeader title="Send a Message" />
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          Full Name *
                        </label>
                        <input type="text" value={form.name}
                          onChange={e => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: '' }); }}
                          className={`input ${errors.name ? 'border-red-500' : ''}`}
                          placeholder="Your full name" />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          Email Address *
                        </label>
                        <input type="email" value={form.email}
                          onChange={e => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: '' }); }}
                          className={`input ${errors.email ? 'border-red-500' : ''}`}
                          placeholder="your@email.com" />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Subject</label>
                      <input type="text" value={form.subject}
                        onChange={e => setForm({ ...form, subject: e.target.value })}
                        className="input" placeholder="What is this about?" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Message *
                      </label>
                      <textarea value={form.message} rows={5}
                        onChange={e => { setForm({ ...form, message: e.target.value }); setErrors({ ...errors, message: '' }); }}
                        className={`textarea ${errors.message ? 'border-red-500' : ''}`}
                        placeholder="Write your message here..." />
                      {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                    </div>
                    <button type="submit" disabled={loading}
                      className="w-full btn-primary flex items-center justify-center gap-2">
                      {loading
                        ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
                        : <><Send className="w-5 h-5" /> Send Message</>
                      }
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
