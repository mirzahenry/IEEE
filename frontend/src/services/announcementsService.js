import { supabase } from '../config/supabase';
import { generateSlug } from '../utils/helpers';

export const getAnnouncements = async ({ page = 1, limit = 6 } = {}) => {
  try {
    const { data, error, count } = await supabase
      .from('announcements')
      .select('*', { count: 'exact' })
      .eq('is_published', true)
      .lte('publish_date', new Date().toISOString())
      .order('publish_date', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);
    if (error) throw error;
    return { data: data || [], count: count || 0 };
  } catch (err) {
    console.error('getAnnouncements:', err.message);
    return { data: [], count: 0 };
  }
};

export const getLatestAnnouncements = async (limit = 3) => {
  try {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('is_published', true)
      .order('publish_date', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('getLatestAnnouncements:', err.message);
    return [];
  }
};

export const getAnnouncementBySlug = async (slug) => {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('slug', slug)
    .single();
  if (error) throw error;
  return data;
};

export const createAnnouncement = async (payload) => {
  const slug = generateSlug(payload.title) + '-' + Date.now();
  const { data, error } = await supabase
    .from('announcements')
    .insert([{ ...payload, slug }])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateAnnouncement = async (id, payload) => {
  const { data, error } = await supabase
    .from('announcements')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteAnnouncement = async (id) => {
  const { error } = await supabase.from('announcements').delete().eq('id', id);
  if (error) throw error;
};
