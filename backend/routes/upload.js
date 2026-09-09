import express from 'express';
import multer from 'multer';
import path from 'path';
import { supabaseAdmin } from '../config/supabase.js';

const router = express.Router();

// Memory storage – files go straight to Supabase
const storage = multer.memoryStorage();

const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const allowedFileTypes  = [
  ...allowedImageTypes,
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/zip',
];

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB max
  fileFilter: (req, file, cb) => {
    if (allowedFileTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} is not allowed`), false);
    }
  },
});

// POST /api/upload/:bucket
router.post('/:bucket', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file provided' });

    const validBuckets = ['excom', 'events', 'gallery', 'achievements', 'projects', 'resources', 'announcements'];
    if (!validBuckets.includes(req.params.bucket)) {
      return res.status(400).json({ error: 'Invalid storage bucket' });
    }

    const ext = path.extname(req.file.originalname).toLowerCase();
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    const folder = req.body.folder || '';
    const filePath = folder ? `${folder}/${filename}` : filename;

    const { error } = await supabaseAdmin.storage
      .from(req.params.bucket)
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from(req.params.bucket)
      .getPublicUrl(filePath);

    res.json({ publicUrl, filePath, bucket: req.params.bucket });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message || 'Upload failed' });
  }
});

// DELETE /api/upload/:bucket  – delete file
router.delete('/:bucket', async (req, res) => {
  try {
    const { filePath } = req.body;
    if (!filePath) return res.status(400).json({ error: 'filePath required' });

    const { error } = await supabaseAdmin.storage
      .from(req.params.bucket)
      .remove([filePath]);

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

export default router;
