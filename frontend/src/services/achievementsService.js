import { supabase } from '../config/supabase';

export const getAchievements = async ({ category, featured, page = 1, limit = 9 } = {}) => {
  let query = supabase.from('achievements').select('*', { count: 'exact' });
  if (category) query = query.eq('category', category);
  if (featured) query = query.eq('is_featured', true);
  query = query.order('achievement_date', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);
  const { data, error, count } = await query;
  if (error) throw error;
  return { data, count };
};

export const createAchievement = async (achievementData) => {
  const { data, error } = await supabase
    .from('achievements').insert([achievementData]).select().single();
  if (error) throw error;
  return data;
};

export const updateAchievement = async (id, achievementData) => {
  const { data, error } = await supabase
    .from('achievements').update(achievementData).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

export const deleteAchievement = async (id) => {
  const { error } = await supabase.from('achievements').delete().eq('id', id);
  if (error) throw error;
};
