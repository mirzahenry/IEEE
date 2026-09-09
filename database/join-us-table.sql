-- =====================================================
-- JOIN US / MEMBERSHIP APPLICATIONS TABLE
-- Run in Supabase SQL Editor
-- =====================================================

CREATE TABLE IF NOT EXISTS membership_applications (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name       VARCHAR(150) NOT NULL,
  email           VARCHAR(150) NOT NULL,
  phone           VARCHAR(20),
  student_id      VARCHAR(50),
  department      VARCHAR(100),
  semester        VARCHAR(20),
  batch           VARCHAR(50),
  position_interest VARCHAR(150),
  skills          TEXT,
  why_join        TEXT,
  experience      TEXT,
  status          VARCHAR(50) DEFAULT 'pending'
                  CHECK (status IN ('pending','reviewing','accepted','rejected')),
  admin_notes     TEXT,
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_membership_status ON membership_applications(status);
CREATE INDEX idx_membership_email  ON membership_applications(email);

-- Public can apply
CREATE POLICY "Public can submit applications"
  ON membership_applications FOR INSERT
  WITH CHECK (true);

-- Admin can do everything
CREATE POLICY "Admins full access applications"
  ON membership_applications FOR ALL
  USING (auth.uid() IN (SELECT user_id FROM admin_roles));

-- Or if RLS is disabled, no policies needed

-- Trigger for updated_at
CREATE TRIGGER update_membership_updated_at
  BEFORE UPDATE ON membership_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

SELECT 'membership_applications table created!' AS status;
