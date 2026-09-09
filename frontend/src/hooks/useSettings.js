import { useState, useEffect } from 'react';
import { getSettings } from '../services/settingsService';

/**
 * Returns site settings from Supabase with loading + error state.
 * Results are cached in the settingsService for 5 minutes.
 *
 * Usage:
 *   const { settings, loading } = useSettings();
 *   settings.society_name  // "Geosciences and Remote Sensing Society"
 */
const useSettings = () => {
  const [settings, setSettings] = useState({});
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    let cancelled = false;

    getSettings()
      .then(data => { if (!cancelled) setSettings(data); })
      .catch(err  => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, []);

  return { settings, loading, error };
};

export default useSettings;
