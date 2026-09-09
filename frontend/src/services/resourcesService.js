import { supabase } from '../config/supabase';
import { generateSlug } from '../utils/helpers';

export const getResources = async ({ category, page = 1, limit = 9 } = {}) => {
  let query = supabase.from('resources').select('*', { count: 'exact' })
    .eq('is_published', true);
  if (category) query = query.eq('category', category);
  query = query.order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);
  const { data, error, count } = await query;
  if (error) throw error;
  return { data, count };
};

export const getResourceBySlug = async (slug) => {
  const { data, error } = await supabase
    .from('resources').select('*').eq('slug', slug).single();
  if (error) throw error;
  return data;
};

export const createResource = async (resourceData) => {
  const slug = generateSlug(resourceData.title);
  const { data, error } = await supabase
    .from('resources').insert([{ ...resourceData, slug }]).select().single();
  if (error) throw error;
  return data;
};

export const updateResource = async (id, resourceData) => {
  const { data, error } = await supabase
    .from('resources').update(resourceData).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

export const deleteResource = async (id) => {
  const { error } = await supabase.from('resources').delete().eq('id', id);
  if (error) throw error;
};

export const incrementDownload = async (id) => {
  const { error } = await supabase.rpc('increment_download_count', { resource_id: id });
  if (error) {
    // fallback manual increment
    const { data } = await supabase.from('resources').select('download_count').eq('id', id).single();
    await supabase.from('resources').update({ download_count: (data?.download_count || 0) + 1 }).eq('id', id);
  }
};
