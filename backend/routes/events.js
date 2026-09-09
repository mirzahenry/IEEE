import express from 'express';
import { body, query, validationResult } from 'express-validator';
import { supabaseAdmin } from '../config/supabase.js';

const router = express.Router();

// GET /api/events  – list with filters
router.get('/', async (req, res) => {
  try {
    const { status, type, featured, page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let q = supabaseAdmin
      .from('events')
      .select('*', { count: 'exact' });

    if (status)   q = q.eq('status', status);
    if (type)     q = q.eq('event_type', type);
    if (featured) q = q.eq('is_featured', true);

    q = q.order('event_date', { ascending: false })
         .range(offset, offset + parseInt(limit) - 1);

    const { data, error, count } = await q;
    if (error) throw error;

    res.json({ data, count, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    console.error('GET /events error:', err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// GET /api/events/:slug
router.get('/:slug', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('events')
      .select('*')
      .eq('slug', req.params.slug)
      .single();

    if (error) return res.status(404).json({ error: 'Event not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// POST /api/events  – create event (admin)
router.post('/',
  body('title').notEmpty().trim(),
  body('event_date').isDate(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const slug = req.body.title
        .toLowerCase().trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '');

      const { data, error } = await supabaseAdmin
        .from('events')
        .insert([{ ...req.body, slug }])
        .select()
        .single();

      if (error) throw error;
      res.status(201).json(data);
    } catch (err) {
      console.error('POST /events error:', err);
      res.status(500).json({ error: err.message || 'Failed to create event' });
    }
  }
);

// PUT /api/events/:id
router.put('/:id', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('events')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// DELETE /api/events/:id
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabaseAdmin
      .from('events')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

export default router;
