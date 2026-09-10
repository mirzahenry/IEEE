-- =====================================================
-- GRSS Database Schema
-- Geosciences and Remote Sensing Society
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PROFILES & ADMIN ROLES
-- =====================================================

-- Admin Roles Table
CREATE TABLE admin_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL CHECK (role IN ('super_admin', 'admin', 'editor')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX idx_admin_roles_user_id ON admin_roles(user_id);
CREATE INDEX idx_admin_roles_role ON admin_roles(role);

-- =====================================================
-- SITE SETTINGS
-- =====================================================

CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  type VARCHAR(50) DEFAULT 'text',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO site_settings (key, value, type) VALUES
  ('society_name', 'IEEE Geosciences and Remote Sensing Society', 'text'),
  ('society_short_name', 'IEEE GRSS', 'text'),
  ('tagline', 'Exploring Earth. Advancing Technology. Inspiring the Next Generation.', 'text'),
  ('university_name', 'FAST National University of Computer & Emerging Sciences - Chiniot-Faisalabad Campus', 'text'),
  ('department', 'IEEE Student Branch', 'text'),
  ('email', 'info.cfd@nu.edu.pk', 'text'),
  ('phone', '(041) 111 128 128', 'text'),
  ('address', 'FAST-NU, FAST Square, 9 Km from Faisalabad Motorway Interchange towards Chiniot', 'text'),
  ('about_text', 'The Geosciences and Remote Sensing Society is a student-driven organization dedicated to advancing knowledge in earth sciences, remote sensing, GIS, and geospatial technologies.', 'textarea'),
  ('mission', 'To foster innovation and research in geosciences and remote sensing technologies among students.', 'textarea'),
  ('vision', 'To be a leading student society in earth observation and geospatial sciences.', 'textarea'),
  ('instagram_url', '', 'text'),
  ('linkedin_url', '', 'text'),
  ('facebook_url', '', 'text'),
  ('youtube_url', '', 'text'),
  ('twitter_url', '', 'text');

-- =====================================================
-- EXCOM (Executive Committee)
-- =====================================================

-- ExCom Positions
CREATE TABLE excom_positions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(100) NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_excom_positions_order ON excom_positions(display_order);

-- Insert default positions
INSERT INTO excom_positions (title, display_order) VALUES
  ('President', 1),
  ('Vice President', 2),
  ('General Secretary', 3),
  ('Joint Secretary', 4),
  ('Treasurer', 5),
  ('Event Coordinator', 6),
  ('Media & Communication Lead', 7),
  ('Research & Technical Lead', 8),
  ('Membership Coordinator', 9);

-- ExCom Members
CREATE TABLE excom_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  position_id UUID REFERENCES excom_positions(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  photo_url TEXT,
  bio TEXT,
  department VARCHAR(100),
  batch VARCHAR(50),
  email VARCHAR(150),
  linkedin_url TEXT,
  instagram_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_excom_members_position ON excom_members(position_id);
CREATE INDEX idx_excom_members_order ON excom_members(display_order);
CREATE INDEX idx_excom_members_active ON excom_members(is_active);

-- =====================================================
-- EVENTS
-- =====================================================

CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(250) UNIQUE NOT NULL,
  description TEXT,
  short_description VARCHAR(300),
  event_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  venue VARCHAR(200),
  event_type VARCHAR(50) CHECK (event_type IN ('workshop', 'seminar', 'webinar', 'competition', 'field_visit', 'training', 'research_talk', 'awareness', 'conference', 'other')),
  speaker VARCHAR(150),
  speaker_designation VARCHAR(150),
  registration_deadline TIMESTAMP WITH TIME ZONE,
  registration_link TEXT,
  poster_url TEXT,
  status VARCHAR(50) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  is_featured BOOLEAN DEFAULT false,
  registration_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_date ON events(event_date DESC);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_featured ON events(is_featured);
CREATE INDEX idx_events_type ON events(event_type);

-- Event Registrations
CREATE TABLE event_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(20),
  student_id VARCHAR(50),
  department VARCHAR(100),
  semester VARCHAR(20),
  batch VARCHAR(50),
  participation_type VARCHAR(50),
  message TEXT,
  status VARCHAR(50) DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, email)
);

CREATE INDEX idx_registrations_event ON event_registrations(event_id);
CREATE INDEX idx_registrations_email ON event_registrations(email);
CREATE INDEX idx_registrations_student ON event_registrations(student_id);
CREATE INDEX idx_registrations_status ON event_registrations(status);

-- =====================================================
-- ANNOUNCEMENTS
-- =====================================================

CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(250) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  featured_image TEXT,
  author VARCHAR(100),
  publish_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_announcements_slug ON announcements(slug);
CREATE INDEX idx_announcements_published ON announcements(is_published);
CREATE INDEX idx_announcements_featured ON announcements(is_featured);
CREATE INDEX idx_announcements_publish_date ON announcements(publish_date DESC);

-- =====================================================
-- ACHIEVEMENTS
-- =====================================================

CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  achievement_date DATE,
  category VARCHAR(100),
  team_members TEXT,
  award_position VARCHAR(100),
  image_url TEXT,
  certificate_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_achievements_date ON achievements(achievement_date DESC);
CREATE INDEX idx_achievements_category ON achievements(category);
CREATE INDEX idx_achievements_featured ON achievements(is_featured);

-- =====================================================
-- PROJECTS
-- =====================================================

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(250) UNIQUE NOT NULL,
  description TEXT,
  category VARCHAR(100),
  technologies TEXT,
  supervisor VARCHAR(150),
  start_date DATE,
  end_date DATE,
  status VARCHAR(50) DEFAULT 'ongoing' CHECK (status IN ('planning', 'ongoing', 'completed', 'paused')),
  image_url TEXT,
  github_url TEXT,
  demo_url TEXT,
  research_paper_url TEXT,
  report_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_featured ON projects(is_featured);

-- Project Members
CREATE TABLE project_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  role VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_project_members_project ON project_members(project_id);

-- =====================================================
-- GALLERY
-- =====================================================

-- Gallery Albums
CREATE TABLE gallery_albums (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(250) UNIQUE NOT NULL,
  description TEXT,
  event_date DATE,
  cover_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_gallery_albums_slug ON gallery_albums(slug);
CREATE INDEX idx_gallery_albums_date ON gallery_albums(event_date DESC);

-- Gallery Images
CREATE TABLE gallery_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  album_id UUID NOT NULL REFERENCES gallery_albums(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_gallery_images_album ON gallery_images(album_id);
CREATE INDEX idx_gallery_images_order ON gallery_images(display_order);

-- =====================================================
-- RESOURCES
-- =====================================================

CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(250) UNIQUE NOT NULL,
  description TEXT,
  category VARCHAR(100),
  author VARCHAR(100),
  file_url TEXT,
  file_type VARCHAR(50),
  thumbnail_url TEXT,
  download_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_resources_slug ON resources(slug);
CREATE INDEX idx_resources_category ON resources(category);
CREATE INDEX idx_resources_published ON resources(is_published);
CREATE INDEX idx_resources_created ON resources(created_at DESC);

-- =====================================================
-- CONTACT MESSAGES
-- =====================================================

CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  subject VARCHAR(200),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_contact_messages_read ON contact_messages(is_read);
CREATE INDEX idx_contact_messages_created ON contact_messages(created_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE excom_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE excom_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Public can view site settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public can view active excom positions" ON excom_positions FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active excom members" ON excom_members FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view published events" ON events FOR SELECT USING (true);
CREATE POLICY "Public can view published announcements" ON announcements FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view achievements" ON achievements FOR SELECT USING (true);
CREATE POLICY "Public can view projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public can view project members" ON project_members FOR SELECT USING (true);
CREATE POLICY "Public can view gallery albums" ON gallery_albums FOR SELECT USING (true);
CREATE POLICY "Public can view gallery images" ON gallery_images FOR SELECT USING (true);
CREATE POLICY "Public can view published resources" ON resources FOR SELECT USING (is_published = true);

-- Public can register for events
CREATE POLICY "Public can register for events" ON event_registrations FOR INSERT WITH CHECK (true);

-- Public can send contact messages
CREATE POLICY "Public can send contact messages" ON contact_messages FOR INSERT WITH CHECK (true);

-- Admin policies (full access)
CREATE POLICY "Admins have full access to admin_roles" ON admin_roles FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM admin_roles WHERE role IN ('super_admin', 'admin'))
);

CREATE POLICY "Admins have full access to site_settings" ON site_settings FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM admin_roles WHERE role IN ('super_admin', 'admin', 'editor'))
);

CREATE POLICY "Admins have full access to excom_positions" ON excom_positions FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM admin_roles WHERE role IN ('super_admin', 'admin', 'editor'))
);

CREATE POLICY "Admins have full access to excom_members" ON excom_members FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM admin_roles WHERE role IN ('super_admin', 'admin', 'editor'))
);

CREATE POLICY "Admins have full access to events" ON events FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM admin_roles WHERE role IN ('super_admin', 'admin', 'editor'))
);

CREATE POLICY "Admins can view all registrations" ON event_registrations FOR SELECT USING (
  auth.uid() IN (SELECT user_id FROM admin_roles WHERE role IN ('super_admin', 'admin', 'editor'))
);

CREATE POLICY "Admins can update registrations" ON event_registrations FOR UPDATE USING (
  auth.uid() IN (SELECT user_id FROM admin_roles WHERE role IN ('super_admin', 'admin', 'editor'))
);

CREATE POLICY "Admins have full access to announcements" ON announcements FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM admin_roles WHERE role IN ('super_admin', 'admin', 'editor'))
);

CREATE POLICY "Admins have full access to achievements" ON achievements FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM admin_roles WHERE role IN ('super_admin', 'admin', 'editor'))
);

CREATE POLICY "Admins have full access to projects" ON projects FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM admin_roles WHERE role IN ('super_admin', 'admin', 'editor'))
);

CREATE POLICY "Admins have full access to project_members" ON project_members FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM admin_roles WHERE role IN ('super_admin', 'admin', 'editor'))
);

CREATE POLICY "Admins have full access to gallery_albums" ON gallery_albums FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM admin_roles WHERE role IN ('super_admin', 'admin', 'editor'))
);

CREATE POLICY "Admins have full access to gallery_images" ON gallery_images FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM admin_roles WHERE role IN ('super_admin', 'admin', 'editor'))
);

CREATE POLICY "Admins have full access to resources" ON resources FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM admin_roles WHERE role IN ('super_admin', 'admin', 'editor'))
);

CREATE POLICY "Admins can view contact messages" ON contact_messages FOR SELECT USING (
  auth.uid() IN (SELECT user_id FROM admin_roles WHERE role IN ('super_admin', 'admin', 'editor'))
);

CREATE POLICY "Admins can update contact messages" ON contact_messages FOR UPDATE USING (
  auth.uid() IN (SELECT user_id FROM admin_roles WHERE role IN ('super_admin', 'admin', 'editor'))
);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to tables with updated_at
CREATE TRIGGER update_admin_roles_updated_at BEFORE UPDATE ON admin_roles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_excom_positions_updated_at BEFORE UPDATE ON excom_positions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_excom_members_updated_at BEFORE UPDATE ON excom_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_achievements_updated_at BEFORE UPDATE ON achievements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_gallery_albums_updated_at BEFORE UPDATE ON gallery_albums FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON resources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
