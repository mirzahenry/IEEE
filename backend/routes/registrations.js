import express from 'express';
import { body, validationResult } from 'express-validator';
import { supabaseAdmin } from '../config/supabase.js';

const router = express.Router();

// POST /api/registrations  – public registration
router.post('/',
  body('full_name').notEmpty().trim(),
  body('email').isEmail().normalizeEmail(),
  body('event_id').isUUID(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      // Check duplicate
      const { data: existing } = await supabaseAdmin
        .from('event_registrations')
        .select('id')
        .eq('event_id', req.body.event_id)
        .eq('email', req.body.email)
        .single();

      if (existing) {
        return res.status(409).json({ error: 'You have already registered for this event.' });
      }

      const { data, error } = await supabaseAdmin
        .from('event_registrations')
        .insert([req.body])
        .select()
        .single();

      if (error) throw error;
      res.status(201).json({ success: true, data });
    } catch (err) {
      console.error('POST /registrations error:', err);
      res.status(500).json({ error: 'Registration failed. Please try again.' });
    }
  }
);

// GET /api/registrations  – admin: list registrations
router.get('/', async (req, res) => {
  try {
    const { event_id, status, search, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let q = supabaseAdmin
      .from('event_registrations')
      .select('*, events(title)', { count: 'exact' });

    if (event_id) q = q.eq('event_id', event_id);
    if (status)   q = q.eq('status', status);
    if (search)   q = q.or(
      `full_name.ilike.%${search}%,email.ilike.%${search}%,student_id.ilike.%${search}%`
    );

    q = q.order('created_at', { ascending: false })
         .range(offset, offset + parseInt(limit) - 1);

    const { data, error, count } = await q;
    if (error) throw error;
    res.json({ data, count });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
});

// PATCH /api/registrations/:id  – update status
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['registered', 'attended', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const { data, error } = await supabaseAdmin
      .from('event_registrations')
      .update({ status })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// GET /api/registrations/export/:event_id  – CSV export
router.get('/export/:event_id', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('event_registrations')
      .select('*, events(title)')
      .eq('event_id', req.params.event_id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const headers = [
      'Name', 'Email', 'Phone', 'Student ID',
      'Department', 'Semester', 'Batch',
      'Participation Type', 'Event', 'Registered At', 'Status'
    ];

    const rows = (data || []).map(r => [
      r.full_name,
      r.email,
      r.phone || '',
      r.student_id || '',
      r.department || '',
      r.semester || '',
      r.batch || '',
      r.participation_type || '',
      r.events?.title || '',
      new Date(r.created_at).toLocaleString(),
      r.status,
    ]);

    const csv = [headers, ...rows]
      .map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="registrations-${req.params.event_id}.csv"`);
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: 'Export failed' });
  }
});

export default router;
