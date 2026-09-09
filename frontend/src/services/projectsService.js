import { supabase } from '../config/supabase';
import { generateSlug } from '../utils/helpers';

export const getProjects = async ({ category, status, featured, page = 1, limit = 9 } = {}) => {
  let query = supabase.from('projects').select('*', { count: 'exact' });
  if (category) query = query.eq('category', category);
  if (status) query = query.eq('status', status);
  if (featured) query = query.eq('is_featured', true);
  query = query.order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);
  const { data, error, count } = await query;
  if (error) throw error;
  return { data, count };
};

export const getProjectBySlug = async (slug) => {
  const { data, error } = await supabase
    .from('projects').select(`*, project_members(*)`).eq('slug', slug).single();
  if (error) throw error;
  return data;
};

export const createProject = async (projectData) => {
  const slug = generateSlug(projectData.title);
  const { data, error } = await supabase
    .from('projects').insert([{ ...projectData, slug }]).select().single();
  if (error) throw error;
  return data;
};

export const updateProject = async (id, projectData) => {
  const { data, error } = await supabase
    .from('projects').update(projectData).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

export const deleteProject = async (id) => {
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw error;
};

export const addProjectMember = async (memberData) => {
  const { data, error } = await supabase
    .from('project_members').insert([memberData]).select().single();
  if (error) throw error;
  return data;
};

export const deleteProjectMember = async (id) => {
  const { error } = await supabase.from('project_members').delete().eq('id', id);
  if (error) throw error;
};
