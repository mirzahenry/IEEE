import { useState, useEffect } from 'react';
import { Save, Settings as SettingsIcon, CheckCircle } from 'lucide-react';
import { getSettings, updateMultipleSettings } from '../../services/settingsService';
import toast from 'react-hot-toast';

const Settings = () => {
  const [settings, setSettings] = useState({});
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);

  useEffect(() => { loadSettings(); }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await getSettings();
      setSettings(data);
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
      // Reload to confirm saved values
      await loadSettings();
    } catch (err) {
      console.error('Save error:', err);
      toast.error('Failed to save: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const label = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5';

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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <SettingsIcon className="w-7 h-7 text-primary-600 dark:text-primary-400" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Site Settings</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Changes are saved to database immediately</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary flex items-center gap-2"
        >
          {saving
            ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
            : <><Save className="w-5 h-5" /> Save Changes</>
          }
        </button>
      </div>

      <div className="space-y-6">

        {/* Society Info */}
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 dark:text-white text-lg border-b border-gray-100 dark:border-gray-700 pb-2">
            Society Information
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={label}>Society Name</label>
              <input type="text" value={settings.society_name || ''}
                onChange={e => set('society_name', e.target.value)}
                className="input" placeholder="Geosciences and Remote Sensing Society" />
            </div>
            <div>
              <label className={label}>Short Name</label>
              <input type="text" value={settings.society_short_name || ''}
                onChange={e => set('society_short_name', e.target.value)}
                className="input" placeholder="GRSS" />
            </div>
            <div className="sm:col-span-2">
              <label className={label}>Tagline</label>
              <input type="text" value={settings.tagline || ''}
                onChange={e => set('tagline', e.target.value)}
                className="input" placeholder="Exploring Earth. Advancing Technology..." />
            </div>
            <div>
              <label className={label}>University Name</label>
              <input type="text" value={settings.university_name || ''}
                onChange={e => set('university_name', e.target.value)}
                className="input" />
            </div>
            <div>
              <label className={label}>Department</label>
              <input type="text" value={settings.department || ''}
                onChange={e => set('department', e.target.value)}
                className="input" />
            </div>
          </div>
          <div>
            <label className={label}>About Text</label>
            <textarea value={settings.about_text || ''}
              onChange={e => set('about_text', e.target.value)}
              className="textarea" rows={3} />
          </div>
          <div>
            <label className={label}>Mission</label>
            <textarea value={settings.mission || ''}
              onChange={e => set('mission', e.target.value)}
              className="textarea" rows={2} />
          </div>
          <div>
            <label className={label}>Vision</label>
            <textarea value={settings.vision || ''}
              onChange={e => set('vision', e.target.value)}
              className="textarea" rows={2} />
          </div>
        </div>

        {/* Contact Info */}
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 dark:text-white text-lg border-b border-gray-100 dark:border-gray-700 pb-2">
            Contact Information
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={label}>Email</label>
              <input type="email" value={settings.email || ''}
                onChange={e => set('email', e.target.value)}
                className="input" placeholder="contact@grss.edu" />
            </div>
            <div>
              <label className={label}>Phone</label>
              <input type="text" value={settings.phone || ''}
                onChange={e => set('phone', e.target.value)}
                className="input" placeholder="+92 300 1234567" />
            </div>
            <div className="sm:col-span-2">
              <label className={label}>Address</label>
              <input type="text" value={settings.address || ''}
                onChange={e => set('address', e.target.value)}
                className="input" placeholder="University Campus, City, Country" />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 dark:text-white text-lg border-b border-gray-100 dark:border-gray-700 pb-2">
            Social Media Links
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { key: 'instagram_url', label: '📸 Instagram URL' },
              { key: 'linkedin_url',  label: '💼 LinkedIn URL'  },
              { key: 'facebook_url',  label: '📘 Facebook URL'  },
              { key: 'youtube_url',   label: '▶️ YouTube URL'   },
              { key: 'twitter_url',   label: '🐦 X / Twitter URL' },
            ].map(({ key, label: lbl }) => (
              <div key={key}>
                <label className={label}>{lbl}</label>
                <input type="url" value={settings[key] || ''}
                  onChange={e => set(key, e.target.value)}
                  className="input" placeholder="https://..." />
              </div>
            ))}
          </div>
        </div>

        {/* Save Button Bottom */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary flex items-center gap-2 px-8"
          >
            {saving
              ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
              : <><Save className="w-5 h-5" /> Save All Changes</>
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
