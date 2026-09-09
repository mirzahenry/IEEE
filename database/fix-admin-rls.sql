-- =====================================================
-- DISABLE RLS COMPLETELY — Quick Fix
-- Run in Supabase SQL Editor
-- =====================================================

ALTER TABLE events               DISABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations  DISABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages     DISABLE ROW LEVEL SECURITY;
ALTER TABLE announcements        DISABLE ROW LEVEL SECURITY;
ALTER TABLE achievements         DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects             DISABLE ROW LEVEL SECURITY;
ALTER TABLE project_members      DISABLE ROW LEVEL SECURITY;
ALTER TABLE excom_positions      DISABLE ROW LEVEL SECURITY;
ALTER TABLE excom_members        DISABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_albums       DISABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images       DISABLE ROW LEVEL SECURITY;
ALTER TABLE resources            DISABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings        DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_roles          DISABLE ROW LEVEL SECURITY;

SELECT 'RLS disabled on all tables' AS status;
