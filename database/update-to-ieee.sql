-- =====================================================
-- UPDATE SITE SETTINGS — FAST-NU IEEE CHAPTER
-- Run in Supabase SQL Editor
-- =====================================================

UPDATE site_settings SET value = 'IEEE Geosciences and Remote Sensing Society' WHERE key = 'society_name';
UPDATE site_settings SET value = 'IEEE GRSS'                                    WHERE key = 'society_short_name';
UPDATE site_settings SET value = 'FAST National University of Computer & Emerging Sciences - Chiniot-Faisalabad Campus' WHERE key = 'university_name';
UPDATE site_settings SET value = 'IEEE Student Branch'                          WHERE key = 'department';
UPDATE site_settings SET value = 'info.cfd@nu.edu.pk'                           WHERE key = 'email';
UPDATE site_settings SET value = '(041) 111 128 128'                            WHERE key = 'phone';
UPDATE site_settings SET value = 'FAST-NU, FAST Square, 9 Km from Faisalabad Motorway Interchange towards Chiniot' WHERE key = 'address';
UPDATE site_settings SET value = 'A student-driven IEEE chapter dedicated to exploring Earth through remote sensing, GIS, and geospatial innovation — building research, projects, and community around understanding our planet.' WHERE key = 'about_text';

-- Verify
SELECT key, value FROM site_settings
WHERE key IN ('society_name','society_short_name','university_name','department','email','phone','address')
ORDER BY key;
