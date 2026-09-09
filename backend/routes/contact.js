import express from 'express';
import { body, validationResult } from 'express-validator';
import { supabaseAdmin } from '../config/supabase.js';

const router = express.Router();

// POST /api/contact
router.post('/',
  body('name').notEmpty().trim(),
  body('email').isEmail().normalizeEmail(),
  body('message').notEmpty().trim(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { data, error } = await supabaseAdmin
        .from('contact_messages')
        .insert([{
          name: req.body.name,
          email: req.body.email,
          subject: req.body.subject || '',
          message: req.body.message,
        }])
        .select()
        .single();

      if (error) throw error;
      res.status(201).json({ success: true, message: 'Message sent successfully' });
    } catch (err) {
      console.error('Contact error:', err);
      res.status(500).json({ error: 'Failed to send message' });
    }
  }
);

// GET /api/contact – admin: view messages
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// PATCH /api/contact/:id/read
router.patch('/:id/read', async (req, res) => {
  try {
    const { error } = await supabaseAdmin
      .from('contact_messages')
      .update({ is_read: true })
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update message' });
  }
});

export default router;
