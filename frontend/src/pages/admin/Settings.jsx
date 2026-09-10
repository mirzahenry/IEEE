import { useState, useEffect } from 'react';
import { Save, Settings as SettingsIcon, RefreshCw } from 'lucide-react';
import { getSettings, updateMultipleSettings } from '../../services/settingsService';
import toast from 'react-hot-toast';

const DEFAULT_SETTINGS = {
  society_name:       'IEEE Geosciences and Remote Sensing Society',
  society_short_name: 'IEEE GRSS',
  tagline:            'Exploring Earth. Advancing Technology. Inspiring the Next Generation.',
  university_name:    'FAST National University of Computer & Emerging Sciences - Chiniot-Faisalabad Campus',
  department:         'IEEE Student Branch',
  about_text:         'A student-driven IEEE chapter dedicated to exploring Earth through remote sensing, GIS, and geospatial innovation — building research, projects, and community around understanding our planet.',
  mission:            'To foster innovation and excellence in geosciences and remote sensing research among students, equipping them with skills to address real-world environmental and geospatial challenges.',
  vision:             'To become the premier student society in earth observation and geospatial sciences, recognized nationally for research contributions and technological innovation.',
  email:              'info.cfd@nu.edu.pk',
  phone:              '(041) 111 128 128',
  address:            'FAST-NU, FAST Square, 9 Km from Faisalabad Motorway Interchange towards Chiniot',
};

const Settings = () => {
  const [settings, setSettings] = useState({});
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);

  useEffect(() => { loadSettings(); }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await getSettings();
      // Merge with defaults so fields are never empty on first load
      setSettings({ ...DEFAULT_SETTINGS, ...data });
    } catch (err) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const set = (key, value) => setSettings(s => ({ ...s, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateMultipleSettings(settings);
      toast.success('Settings saved successfully!');
      await loadSettings();
    } catch (err) {
      toast.error('Failed to save: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDefaults = async () => {
    setSaving(true);
    try {
      const merged = { ...DEFAULT_SETTINGS, ...settings };
      setSettings(merged);
      await updateMultipleSettings(merged);
      toast.success('Default values applied and saved!');
    } catch (err) {
      toast.error('Failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const lbl = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <SettingsIcon className="w-7 h-7 text-primary-600 dark:text-primary-400" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Site Settings</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Changes are reflected on the public website</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={handleSaveDefaults} disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium transition-colors">
            <RefreshCw className="w-4 h-4" /> Load Defaults
          </button>
          <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
            {saving
              ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
              : <><Save className="w-5 h-5" /> Save Changes</>}
          </button>
        </div>
      </div>

      <div className="space-y-6">

        {/* ── Society Info ── */}
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 dark:text-white text-lg border-b border-gray-100 dark:border-gray-700 pb-2">
            Society Information
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Society Name</label>
              <input type="text" value={settings.society_name || ''}
                onChange={e => set('society_name', e.target.value)}
                className="input" placeholder="IEEE Geosciences and Remote Sensing Society" />
            </div>
            <div>
              <label className={lbl}>Short Name</label>
              <input type="text" value={settings.society_short_name || ''}
                onChange={e => set('society_short_name', e.target.value)}
                className="input" placeholder="IEEE GRSS" />
            </div>
            <div className="sm:col-span-2">
              <label className={lbl}>Tagline</label>
              <input type="text" value={settings.tagline || ''}
                onChange={e => set('tagline', e.target.value)}
                className="input" placeholder="Exploring Earth. Advancing Technology..." />
            </div>
            <div className="sm:col-span-2">
              <label className={lbl}>University Name</label>
              <input type="text" value={settings.university_name || ''}
                onChange={e => set('university_name', e.target.value)}
                className="input" placeholder="FAST National University..." />
            </div>
            <div>
              <label className={lbl}>Department / Branch</label>
              <input type="text" value={settings.department || ''}
                onChange={e => set('department', e.target.value)}
                className="input" placeholder="IEEE Student Branch" />
            </div>
          </div>
          <div>
            <label className={lbl}>About Text</label>
            <textarea value={settings.about_text || ''}
              onChange={e => set('about_text', e.target.value)}
              className="textarea" rows={3}
              placeholder="Short description of the society..." />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Mission</label>
              <textarea value={settings.mission || ''}
                onChange={e => set('mission', e.target.value)}
                className="textarea" rows={3}
                placeholder="Society mission statement..." />
            </div>
            <div>
              <label className={lbl}>Vision</label>
              <textarea value={settings.vision || ''}
                onChange={e => set('vision', e.target.value)}
                className="textarea" rows={3}
                placeholder="Society vision statement..." />
            </div>
          </div>
        </div>

        {/* ── Contact Info ── */}
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 dark:text-white text-lg border-b border-gray-100 dark:border-gray-700 pb-2">
            Contact Information
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Email</label>
              <input type="email" value={settings.email || ''}
                onChange={e => set('email', e.target.value)}
                className="input" placeholder="info.cfd@nu.edu.pk" />
            </div>
            <div>
              <label className={lbl}>Phone</label>
              <input type="text" value={settings.phone || ''}
                onChange={e => set('phone', e.target.value)}
                className="input" placeholder="(041) 111 128 128" />
            </div>
            <div className="sm:col-span-2">
              <label className={lbl}>Address</label>
              <textarea value={settings.address || ''}
                onChange={e => set('address', e.target.value)}
                className="textarea" rows={2}
                placeholder="FAST-NU, FAST Square, 9 Km from Faisalabad..." />
            </div>
          </div>
        </div>

        {/* ── Social Links ── */}
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 dark:text-white text-lg border-b border-gray-100 dark:border-gray-700 pb-2">
            Social Media Links
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { key: 'instagram_url', label: '📸 Instagram URL' },
              { key: 'linkedin_url',  label: '💼 LinkedIn URL'  },
              { key: 'facebook_url',  label: '📘 Facebook URL'  },
              { key: 'youtube_url',   label: '▶️  YouTube URL'  },
              { key: 'twitter_url',   label: '🐦 X / Twitter URL' },
            ].map(({ key, label: lbl2 }) => (
              <div key={key}>
                <label className={lbl}>{lbl2}</label>
                <input type="url" value={settings[key] || ''}
                  onChange={e => set(key, e.target.value)}
                  className="input" placeholder="https://..." />
              </div>
            ))}
          </div>
        </div>

        {/* ── Save bottom ── */}
        <div className="flex justify-end pb-6">
          <button onClick={handleSave} disabled={saving}
            className="btn-primary flex items-center gap-2 px-8">
            {saving
              ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
              : <><Save className="w-5 h-5" /> Save All Changes</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
