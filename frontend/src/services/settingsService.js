import { supabase } from '../config/supabase';

// No in-memory cache — always fresh from DB
export const getSettings = async () => {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('key, value');
    if (error) throw error;
    const obj = {};
    (data || []).forEach(item => { obj[item.key] = item.value; });
    return obj;
  } catch (err) {
    console.error('getSettings:', err.message);
    return {};
  }
};

export const updateSetting = async (key, value) => {
  const { error } = await supabase
    .from('site_settings')
    .upsert({ key, value }, { onConflict: 'key' });
  if (error) throw error;
};

export const updateMultipleSettings = async (settingsObj) => {
  const rows = Object.entries(settingsObj).map(([key, value]) => ({ key, value: value || '' }));
  const { error } = await supabase
    .from('site_settings')
    .upsert(rows, { onConflict: 'key' });
  if (error) throw error;
};
