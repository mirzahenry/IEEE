-- =====================================================
-- UPDATE GRSS → IEEE IN DATABASE
-- Run in Supabase SQL Editor after deployment
-- =====================================================

UPDATE site_settings 
SET value = 'IEEE Geosciences and Remote Sensing Society' 
WHERE key = 'society_name';

UPDATE site_settings 
SET value = 'IEEE' 
WHERE key = 'society_short_name';

UPDATE site_settings 
SET value = 'contact@ieee.edu' 
WHERE key = 'email';

-- Verify changes
SELECT key, value FROM site_settings 
WHERE key IN ('society_name', 'society_short_name', 'email')
ORDER BY key;
