import { supabase } from '../config/supabase';

export const getExcomMembers = async () => {
  const { data, error } = await supabase
    .from('excom_members')
    .select(`*, excom_positions(title, display_order)`)
    .eq('is_active', true)
    .order('display_order', { ascending: true });
  if (error) throw error;
  return data;
};

export const getExcomPositions = async () => {
  const { data, error } = await supabase
    .from('excom_positions').select('*').eq('is_active', true)
    .order('display_order', { ascending: true });
  if (error) throw error;
  return data;
};

export const createMember = async (memberData) => {
  const { data, error } = await supabase
    .from('excom_members').insert([memberData]).select().single();
  if (error) throw error;
  return data;
};

export const updateMember = async (id, memberData) => {
  const { data, error } = await supabase
    .from('excom_members').update(memberData).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

export const deleteMember = async (id) => {
  const { error } = await supabase.from('excom_members').delete().eq('id', id);
  if (error) throw error;
};

export const createPosition = async (positionData) => {
  const { data, error } = await supabase
    .from('excom_positions').insert([positionData]).select().single();
  if (error) throw error;
  return data;
};

export const updatePosition = async (id, positionData) => {
  const { data, error } = await supabase
    .from('excom_positions').update(positionData).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

export const deletePosition = async (id) => {
  const { error } = await supabase.from('excom_positions').delete().eq('id', id);
  if (error) throw error;
};
