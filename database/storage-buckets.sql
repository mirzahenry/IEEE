-- =====================================================
-- SUPABASE STORAGE BUCKETS CONFIGURATION
-- =====================================================
-- NOTE: Run this file AFTER creating buckets manually in 
-- Supabase Dashboard → Storage → New Bucket
--
-- Buckets to create manually (all set to PUBLIC):
--   1. excom
--   2. events
--   3. gallery
--   4. achievements
--   5. projects
--   6. resources
--   7. announcements
--
-- After creating all 7 buckets, run the POLICIES section below.
-- =====================================================

-- Safe bucket creation (won't error if already exists)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('excom',         'excom',         true, 5242880,  ARRAY['image/jpeg','image/png','image/webp','image/gif']),
  ('events',        'events',        true, 10485760, ARRAY['image/jpeg','image/png','image/webp','image/gif']),
  ('gallery',       'gallery',       true, 10485760, ARRAY['image/jpeg','image/png','image/webp','image/gif']),
  ('achievements',  'achievements',  true, 10485760, ARRAY['image/jpeg','image/png','image/webp','image/pdf']),
  ('projects',      'projects',      true, 20971520, ARRAY['image/jpeg','image/png','image/webp','application/pdf']),
  ('resources',     'resources',     true, 52428800, ARRAY['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.ms-powerpoint','application/vnd.openxmlformats-officedocument.presentationml.presentation','application/zip','image/jpeg','image/png']),
  ('announcements', 'announcements', true, 5242880,  ARRAY['image/jpeg','image/png','image/webp'])
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- STORAGE POLICIES
-- =====================================================

-- Public read access for all buckets
CREATE POLICY "Public can view excom photos" ON storage.objects FOR SELECT USING (bucket_id = 'excom');
CREATE POLICY "Public can view event images" ON storage.objects FOR SELECT USING (bucket_id = 'events');
CREATE POLICY "Public can view gallery images" ON storage.objects FOR SELECT USING (bucket_id = 'gallery');
CREATE POLICY "Public can view achievement images" ON storage.objects FOR SELECT USING (bucket_id = 'achievements');
CREATE POLICY "Public can view project images" ON storage.objects FOR SELECT USING (bucket_id = 'projects');
CREATE POLICY "Public can view resource files" ON storage.objects FOR SELECT USING (bucket_id = 'resources');
CREATE POLICY "Public can view announcement images" ON storage.objects FOR SELECT USING (bucket_id = 'announcements');

-- Admin upload access
CREATE POLICY "Admins can upload excom photos" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'excom' AND 
  auth.uid() IN (SELECT user_id FROM admin_roles WHERE role IN ('super_admin', 'admin', 'editor'))
);

CREATE POLICY "Admins can upload event images" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'events' AND 
  auth.uid() IN (SELECT user_id FROM admin_roles WHERE role IN ('super_admin', 'admin', 'editor'))
);

CREATE POLICY "Admins can upload gallery images" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'gallery' AND 
  auth.uid() IN (SELECT user_id FROM admin_roles WHERE role IN ('super_admin', 'admin', 'editor'))
);

CREATE POLICY "Admins can upload achievement images" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'achievements' AND 
  auth.uid() IN (SELECT user_id FROM admin_roles WHERE role IN ('super_admin', 'admin', 'editor'))
);

CREATE POLICY "Admins can upload project images" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'projects' AND 
  auth.uid() IN (SELECT user_id FROM admin_roles WHERE role IN ('super_admin', 'admin', 'editor'))
);

CREATE POLICY "Admins can upload resources" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'resources' AND 
  auth.uid() IN (SELECT user_id FROM admin_roles WHERE role IN ('super_admin', 'admin', 'editor'))
);

CREATE POLICY "Admins can upload announcement images" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'announcements' AND 
  auth.uid() IN (SELECT user_id FROM admin_roles WHERE role IN ('super_admin', 'admin', 'editor'))
);

-- Admin update/delete access
CREATE POLICY "Admins can update excom photos" ON storage.objects FOR UPDATE USING (
  bucket_id = 'excom' AND 
  auth.uid() IN (SELECT user_id FROM admin_roles WHERE role IN ('super_admin', 'admin', 'editor'))
);

CREATE POLICY "Admins can delete excom photos" ON storage.objects FOR DELETE USING (
  bucket_id = 'excom' AND 
  auth.uid() IN (SELECT user_id FROM admin_roles WHERE role IN ('super_admin', 'admin', 'editor'))
);

CREATE POLICY "Admins can update event images" ON storage.objects FOR UPDATE USING (
  bucket_id = 'events' AND 
  auth.uid() IN (SELECT user_id FROM admin_roles WHERE role IN ('super_admin', 'admin', 'editor'))
);

CREATE POLICY "Admins can delete event images" ON storage.objects FOR DELETE USING (
  bucket_id = 'events' AND 
  auth.uid() IN (SELECT user_id FROM admin_roles WHERE role IN ('super_admin', 'admin', 'editor'))
);

CREATE POLICY "Admins can update gallery images" ON storage.objects FOR UPDATE USING (
  bucket_id = 'gallery' AND 
  auth.uid() IN (SELECT user_id FROM admin_roles WHERE role IN ('super_admin', 'admin', 'editor'))
);

CREATE POLICY "Admins can delete gallery images" ON storage.objects FOR DELETE USING (
  bucket_id = 'gallery' AND 
  auth.uid() IN (SELECT user_id FROM admin_roles WHERE role IN ('super_admin', 'admin', 'editor'))
);

CREATE POLICY "Admins can update achievement images" ON storage.objects FOR UPDATE USING (
  bucket_id = 'achievements' AND 
  auth.uid() IN (SELECT user_id FROM admin_roles WHERE role IN ('super_admin', 'admin', 'editor'))
);

CREATE POLICY "Admins can delete achievement images" ON storage.objects FOR DELETE USING (
  bucket_id = 'achievements' AND 
  auth.uid() IN (SELECT user_id FROM admin_roles WHERE role IN ('super_admin', 'admin', 'editor'))
);

CREATE POLICY "Admins can update project images" ON storage.objects FOR UPDATE USING (
  bucket_id = 'projects' AND 
  auth.uid() IN (SELECT user_id FROM admin_roles WHERE role IN ('super_admin', 'admin', 'editor'))
);

CREATE POLICY "Admins can delete project images" ON storage.objects FOR DELETE USING (
  bucket_id = 'projects' AND 
  auth.uid() IN (SELECT user_id FROM admin_roles WHERE role IN ('super_admin', 'admin', 'editor'))
);

CREATE POLICY "Admins can update resources" ON storage.objects FOR UPDATE USING (
  bucket_id = 'resources' AND 
  auth.uid() IN (SELECT user_id FROM admin_roles WHERE role IN ('super_admin', 'admin', 'editor'))
);

CREATE POLICY "Admins can delete resources" ON storage.objects FOR DELETE USING (
  bucket_id = 'resources' AND 
  auth.uid() IN (SELECT user_id FROM admin_roles WHERE role IN ('super_admin', 'admin', 'editor'))
);

CREATE POLICY "Admins can update announcement images" ON storage.objects FOR UPDATE USING (
  bucket_id = 'announcements' AND 
  auth.uid() IN (SELECT user_id FROM admin_roles WHERE role IN ('super_admin', 'admin', 'editor'))
);

CREATE POLICY "Admins can delete announcement images" ON storage.objects FOR DELETE USING (
  bucket_id = 'announcements' AND 
  auth.uid() IN (SELECT user_id FROM admin_roles WHERE role IN ('super_admin', 'admin', 'editor'))
);
