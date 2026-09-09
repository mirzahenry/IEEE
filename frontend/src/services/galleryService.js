import { supabase } from '../config/supabase';
import { generateSlug } from '../utils/helpers';

export const getAlbums = async () => {
  const { data, error } = await supabase
    .from('gallery_albums').select(`*, gallery_images(count)`)
    .order('event_date', { ascending: false });
  if (error) throw error;
  return data;
};

export const getAlbumBySlug = async (slug) => {
  const { data, error } = await supabase
    .from('gallery_albums').select(`*, gallery_images(*)`)
    .eq('slug', slug).single();
  if (error) throw error;
  return data;
};

export const createAlbum = async (albumData) => {
  const slug = generateSlug(albumData.title);
  const { data, error } = await supabase
    .from('gallery_albums').insert([{ ...albumData, slug }]).select().single();
  if (error) throw error;
  return data;
};

export const updateAlbum = async (id, albumData) => {
  const { data, error } = await supabase
    .from('gallery_albums').update(albumData).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

export const deleteAlbum = async (id) => {
  const { error } = await supabase.from('gallery_albums').delete().eq('id', id);
  if (error) throw error;
};

export const addImage = async (imageData) => {
  const { data, error } = await supabase
    .from('gallery_images').insert([imageData]).select().single();
  if (error) throw error;
  return data;
};

export const deleteImage = async (id) => {
  const { error } = await supabase.from('gallery_images').delete().eq('id', id);
  if (error) throw error;
};
