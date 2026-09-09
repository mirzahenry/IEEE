import { supabase } from '../config/supabase';
import { generateSlug } from '../utils/helpers';

// ── Public ────────────────────────────────────────────────

export const getEvents = async ({ status, type, page = 1, limit = 9 } = {}) => {
  try {
    let q = supabase.from('events').select('*', { count: 'exact' });
    if (status) q = q.eq('status', status);
    if (type)   q = q.eq('event_type', type);
    q = q.order('event_date', { ascending: false })
         .range((page - 1) * limit, page * limit - 1);
    const { data, error, count } = await q;
    if (error) throw error;
    return { data: data || [], count: count || 0 };
  } catch (err) {
    console.error('getEvents:', err.message);
    return { data: [], count: 0 };
  }
};

export const getUpcomingEvents = async (limit = 3) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .in('status', ['upcoming', 'ongoing'])
      .order('event_date', { ascending: true })
      .limit(limit);
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('getUpcomingEvents:', err.message);
    return [];
  }
};

export const getFeaturedEvents = async () => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('is_featured', true)
      .in('status', ['upcoming', 'ongoing'])
      .order('event_date', { ascending: true })
      .limit(3);
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('getFeaturedEvents:', err.message);
    return [];
  }
};

export const getEventBySlug = async (slug) => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .single();
  if (error) throw error;
  return data;
};

// ── Registrations ────────────────────────────────────────

export const registerForEvent = async (payload) => {
  const { data, error } = await supabase
    .from('event_registrations')
    .insert([payload])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const getEventRegistrations = async (eventId) => {
  let q = supabase
    .from('event_registrations')
    .select('*, events(title)');
  if (eventId) q = q.eq('event_id', eventId);
  q = q.order('created_at', { ascending: false });
  const { data, error } = await q;
  if (error) throw error;
  return data || [];
};

export const updateRegistrationStatus = async (id, status) => {
  const { error } = await supabase
    .from('event_registrations')
    .update({ status })
    .eq('id', id);
  if (error) throw error;
};

// ── Admin CRUD ────────────────────────────────────────────

export const createEvent = async (eventData) => {
  const slug = generateSlug(eventData.title) + '-' + Date.now();
  const { data, error } = await supabase
    .from('events')
    .insert([{ ...eventData, slug }])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateEvent = async (id, eventData) => {
  const { data, error } = await supabase
    .from('events')
    .update(eventData)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteEvent = async (id) => {
  const { error } = await supabase.from('events').delete().eq('id', id);
  if (error) throw error;
};
