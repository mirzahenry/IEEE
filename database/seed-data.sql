-- =====================================================
-- GRSS SEED DATA
-- Geosciences and Remote Sensing Society
-- Realistic demo content — run AFTER schema.sql
-- =====================================================

-- =====================================================
-- SITE SETTINGS (update defaults)
-- =====================================================
UPDATE site_settings SET value = 'Geosciences and Remote Sensing Society' WHERE key = 'society_name';
UPDATE site_settings SET value = 'GRSS' WHERE key = 'society_short_name';
UPDATE site_settings SET value = 'Exploring Earth. Advancing Technology. Inspiring the Next Generation.' WHERE key = 'tagline';
UPDATE site_settings SET value = 'University of Science and Technology' WHERE key = 'university_name';
UPDATE site_settings SET value = 'Department of Earth and Environmental Sciences' WHERE key = 'department';
UPDATE site_settings SET value = 'grss@university.edu' WHERE key = 'email';
UPDATE site_settings SET value = '+1 (555) 234-5678' WHERE key = 'phone';
UPDATE site_settings SET value = 'Earth Sciences Building, Room 204, University Campus' WHERE key = 'address';
UPDATE site_settings SET value = 'The Geosciences and Remote Sensing Society (GRSS) is a dynamic student-led organization dedicated to advancing knowledge in earth sciences, remote sensing, GIS, and geospatial technologies. We bring together students passionate about understanding our planet through cutting-edge technology and research.' WHERE key = 'about_text';
UPDATE site_settings SET value = 'To foster innovation and excellence in geosciences and remote sensing research among students, equipping them with skills to address real-world environmental and geospatial challenges.' WHERE key = 'mission';
UPDATE site_settings SET value = 'To become the premier student society in earth observation and geospatial sciences, recognized nationally for research contributions, technological innovation, and nurturing the next generation of earth scientists.' WHERE key = 'vision';

-- =====================================================
-- EXCOM POSITIONS (already seeded in schema, verify)
-- =====================================================
-- Positions are created in schema.sql; just ensure they exist
INSERT INTO excom_positions (title, display_order) VALUES
  ('Webmaster', 10),
  ('Graphics & Design Lead', 11),
  ('Field Operations Lead', 12)
ON CONFLICT DO NOTHING;

-- =====================================================
-- EXCOM MEMBERS
-- =====================================================
DO $$
DECLARE
  pos_president UUID;
  pos_vp UUID;
  pos_sec UUID;
  pos_jsec UUID;
  pos_treas UUID;
  pos_event UUID;
  pos_media UUID;
  pos_tech UUID;
  pos_member UUID;
BEGIN
  SELECT id INTO pos_president FROM excom_positions WHERE title = 'President' LIMIT 1;
  SELECT id INTO pos_vp        FROM excom_positions WHERE title = 'Vice President' LIMIT 1;
  SELECT id INTO pos_sec       FROM excom_positions WHERE title = 'General Secretary' LIMIT 1;
  SELECT id INTO pos_jsec      FROM excom_positions WHERE title = 'Joint Secretary' LIMIT 1;
  SELECT id INTO pos_treas     FROM excom_positions WHERE title = 'Treasurer' LIMIT 1;
  SELECT id INTO pos_event     FROM excom_positions WHERE title = 'Event Coordinator' LIMIT 1;
  SELECT id INTO pos_media     FROM excom_positions WHERE title = 'Media & Communication Lead' LIMIT 1;
  SELECT id INTO pos_tech      FROM excom_positions WHERE title = 'Research & Technical Lead' LIMIT 1;
  SELECT id INTO pos_member    FROM excom_positions WHERE title = 'Membership Coordinator' LIMIT 1;

  INSERT INTO excom_members (position_id, name, department, batch, bio, email, display_order, is_active) VALUES
    (pos_president, 'Dr. Sarah Ahmed',    'Remote Sensing',       '2021', 'Leading GRSS with a passion for satellite-based environmental monitoring and geospatial AI. PhD candidate focusing on urban heat island mapping.', 'sarah.ahmed@university.edu',  1, true),
    (pos_vp,        'James Okonkwo',      'GIS & Cartography',    '2022', 'Vice President and GIS specialist. Working on flood risk mapping using multi-temporal satellite data.', 'james.ok@university.edu',     2, true),
    (pos_sec,       'Priya Sharma',       'Earth Sciences',       '2022', 'Coordinates society operations and research activities. Passionate about climate change monitoring using remote sensing.', 'priya.s@university.edu',      3, true),
    (pos_jsec,      'Carlos Mendez',      'Environmental Science','2023', 'Manages day-to-day activities and member communications. Interested in land use change detection.', 'carlos.m@university.edu',     4, true),
    (pos_treas,     'Aisha Nkosi',        'Geosciences',          '2022', 'Handles financial planning and budgeting for society events and research activities.', 'aisha.n@university.edu',      5, true),
    (pos_event,     'Li Wei',             'Remote Sensing',       '2023', 'Plans and executes workshops, seminars, and field visits. Expert in organizing large-scale geospatial events.', 'li.wei@university.edu',       6, true),
    (pos_media,     'Fatima Hassan',      'Earth Sciences',       '2023', 'Manages social media, website content, and visual communications for the society.', 'fatima.h@university.edu',     7, true),
    (pos_tech,      'Rahul Gupta',        'GIS & Remote Sensing', '2022', 'Leads technical research projects and workshops. Specializes in machine learning applications for earth observation.', 'rahul.g@university.edu',      8, true),
    (pos_member,    'Amara Diallo',       'Geosciences',          '2023', 'Coordinates membership drives and manages relations with new and existing members.', 'amara.d@university.edu',      9, true)
  ON CONFLICT DO NOTHING;
END $$;

-- =====================================================
-- EVENTS
-- =====================================================
INSERT INTO events (
  title, slug, description, short_description,
  event_date, start_time, end_time, venue, event_type,
  speaker, speaker_designation,
  registration_deadline, status, is_featured, registration_enabled
) VALUES
(
  'Introduction to Remote Sensing & GIS',
  'intro-remote-sensing-gis-2026',
  'Join us for a comprehensive introductory workshop on Remote Sensing and Geographic Information Systems. This hands-on session covers the fundamentals of satellite imagery interpretation, raster data processing, and basic GIS operations using QGIS.

Topics covered:
- Types of satellite sensors (optical, radar, thermal)
- Image interpretation techniques  
- Introduction to QGIS software
- Coordinate systems and map projections
- Basic spatial analysis

Participants will work with real Landsat-8 imagery and create their first thematic maps. No prior experience required — just bring your laptop with QGIS installed!',
  'A hands-on workshop covering satellite imagery interpretation and basic GIS operations using QGIS.',
  '2026-10-15', '14:00:00', '17:00:00',
  'Geosciences Lab, Room 301 — Earth Sciences Building',
  'workshop',
  'Dr. Sarah Ahmed', 'President, GRSS — PhD Candidate in Remote Sensing',
  '2026-10-12 23:59:00+00',
  'upcoming', true, true
),
(
  'Satellite Image Analysis Seminar',
  'satellite-image-analysis-seminar-2026',
  'An in-depth seminar exploring modern techniques in satellite image analysis. We will cover multi-spectral analysis, change detection algorithms, and applications in agriculture, urban planning, and disaster response.

Guest speaker Dr. Elena Vasquez from the National Remote Sensing Centre will present case studies from real-world satellite missions including Sentinel-2 and MODIS.

Key topics:
- Multi-spectral and hyperspectral analysis
- NDVI and vegetation health monitoring  
- Urban expansion mapping
- Disaster damage assessment
- Introduction to Google Earth Engine',
  'Explore modern satellite image analysis techniques with industry expert Dr. Elena Vasquez.',
  '2026-10-22', '15:30:00', '17:30:00',
  'Conference Hall A — Main Academic Block',
  'seminar',
  'Dr. Elena Vasquez', 'Senior Scientist, National Remote Sensing Centre',
  '2026-10-20 23:59:00+00',
  'upcoming', true, true
),
(
  'Geospatial AI & Machine Learning Bootcamp',
  'geospatial-ai-ml-bootcamp-2026',
  'A 2-day intensive bootcamp combining artificial intelligence with geospatial data analysis. Participants will learn to apply deep learning models for land cover classification, object detection in satellite imagery, and predictive environmental modelling.

Day 1: Python for Geospatial Analysis
- Setting up the environment (GDAL, Rasterio, GeoPandas)
- Working with satellite data APIs
- Classical ML for land cover classification

Day 2: Deep Learning for Earth Observation  
- CNNs for satellite image classification
- Semantic segmentation of aerial imagery
- Transfer learning with pre-trained models

Prerequisites: Basic Python knowledge. Bring a laptop with Python 3.9+ installed.',
  'A 2-day intensive bootcamp on applying AI and machine learning to satellite imagery and geospatial data.',
  '2026-11-08', '09:00:00', '17:00:00',
  'Computer Lab 2 — Technology Building',
  'training',
  'Prof. Rahul Gupta', 'Research & Technical Lead, GRSS',
  '2026-11-05 23:59:00+00',
  'upcoming', false, true
),
(
  'Earth Observation Webinar Series: Climate Change',
  'eo-webinar-climate-change-2026',
  'The first session of our Earth Observation Webinar Series focuses on how satellite data is transforming our understanding of climate change. This online session is open to all students regardless of technical background.

Topics:
- How satellites monitor global temperature changes
- Arctic ice extent monitoring with SAR data
- Sea level rise detection using altimetry
- Deforestation tracking in tropical regions
- Real-time wildfire monitoring systems

The webinar will be recorded and made available to registered participants.',
  'Discover how satellite technology monitors climate change impacts from orbit.',
  '2026-11-19', '18:00:00', '19:30:00',
  'Online (Zoom) — Link sent to registered participants',
  'webinar',
  'Dr. Marco Bianchi', 'Climate Remote Sensing Specialist, ESA',
  '2026-11-18 23:59:00+00',
  'upcoming', false, true
),
(
  'Inter-University GIS Mapping Competition',
  'gis-mapping-competition-2026',
  'GRSS proudly presents the 3rd Annual Inter-University GIS Mapping Competition! Teams of 2-3 students will compete to create the best thematic map on this year''s theme: "Urban Resilience and Climate Adaptation."

Competition format:
- 4-hour timed competition
- Teams provided with standardized datasets
- Judged on accuracy, visual design, storytelling, and methodology
- Real-time help available from GRSS mentors

Awards:
🥇 First Place: Certificate + ₹10,000 prize
🥈 Second Place: Certificate + ₹6,000 prize  
🥉 Third Place: Certificate + ₹3,000 prize
Best Visualization: Special award

Open to all university students. Team registration required.',
  'Annual inter-university GIS mapping competition. This year''s theme: Urban Resilience and Climate Adaptation.',
  '2026-12-05', '10:00:00', '17:00:00',
  'Geosciences Building — Main Auditorium',
  'competition',
  NULL, NULL,
  '2026-11-30 23:59:00+00',
  'upcoming', true, true
),
(
  'Field Visit: Remote Sensing Observatory',
  'field-visit-rs-observatory-2026',
  'An exclusive field visit to the Regional Remote Sensing Observatory. Students will get a behind-the-scenes look at how satellite data is received, processed, and distributed.

The visit includes:
- Tour of the ground receiving station
- Live satellite data acquisition demonstration
- Ground-truth validation exercise in the field
- Interaction with professional remote sensing scientists
- Overview of career paths in the remote sensing industry

Limited seats — priority given to senior students. Transport arranged from the university main gate.',
  'Exclusive visit to the Regional Remote Sensing Observatory — see how satellite data is captured and processed.',
  '2026-09-20', '08:00:00', '17:00:00',
  'Regional Remote Sensing Observatory (40 km from campus)',
  'field_visit',
  'Dr. Priya Sharma', 'General Secretary, GRSS',
  '2026-09-15 23:59:00+00',
  'completed', false, false
),
(
  'GIS & Remote Sensing Career Talk',
  'career-talk-gis-rs-2026',
  'A panel discussion featuring professionals from government agencies, research institutions, and private companies working in geospatial technology.

Panel members:
- Ms. Anika Johansson — GIS Analyst, Urban Development Authority
- Mr. Rajiv Kumar — Remote Sensing Scientist, ISRO
- Dr. Lucia Fernandez — Geospatial Data Scientist, Google Maps
- Mr. Khalid Al-Rashid — Environmental Consultant

Topics: Career paths, required skills, industry trends, internship opportunities, and Q&A.',
  'Panel discussion with professionals from government agencies, research institutions, and private GIS companies.',
  '2026-09-10', '16:00:00', '18:00:00',
  'Seminar Hall B — Earth Sciences Building',
  'seminar',
  'Multiple Panelists', 'GIS & Remote Sensing Industry Professionals',
  '2026-09-08 23:59:00+00',
  'completed', false, false
)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- SAMPLE REGISTRATIONS
-- =====================================================
INSERT INTO event_registrations (
  event_id, full_name, email, phone, student_id,
  department, semester, batch, participation_type, status
)
SELECT
  e.id,
  unnest(ARRAY['Ahmed Khan','Sara Malik','John Smith','Priya Patel','Liu Yang']),
  unnest(ARRAY['ahmed.k@uni.edu','sara.m@uni.edu','john.s@uni.edu','priya.p@uni.edu','liu.y@uni.edu']),
  unnest(ARRAY['+1555001',''+1555002','+1555003','+1555004','+1555005']),
  unnest(ARRAY['2022-001','2022-002','2021-145','2023-078','2022-334']),
  unnest(ARRAY['Remote Sensing','GIS','Earth Sciences','Geosciences','Environmental Science']),
  unnest(ARRAY['6th','6th','8th','4th','6th']),
  unnest(ARRAY['2022','2022','2021','2023','2022']),
  'Individual',
  unnest(ARRAY['attended','attended','registered','registered','registered']::varchar[])
FROM events e
WHERE e.slug = 'intro-remote-sensing-gis-2026'
ON CONFLICT DO NOTHING;

-- =====================================================
-- ANNOUNCEMENTS
-- =====================================================
INSERT INTO announcements (title, slug, content, author, is_published, is_featured, publish_date) VALUES
(
  'Welcome to GRSS Academic Year 2026–27!',
  'welcome-grss-2026-27',
  'Dear GRSS Members and Supporters,

We are thrilled to welcome you to the new academic year! The Geosciences and Remote Sensing Society is back with an exciting lineup of workshops, seminars, research projects, and competitions.

This year, we are focusing on three major themes:
🌍 Climate Change Monitoring using Earth Observation
🗺️ Urban Mapping and Smart City Analytics  
🤖 AI-Powered Geospatial Analysis

What''s coming up:
• October: Introduction to Remote Sensing & GIS Workshop
• October: Satellite Image Analysis Seminar
• November: Geospatial AI Bootcamp
• December: Inter-University GIS Competition

We encourage all students passionate about earth sciences and geospatial technology to join us. Membership is free for university students!

Stay tuned for more announcements and follow us on our social media channels.

— The GRSS Executive Committee',
  'GRSS Executive Committee', true, true,
  NOW() - INTERVAL '5 days'
),
(
  'GRSS Research Grant 2026 — Applications Open',
  'research-grant-2026',
  'The Geosciences and Remote Sensing Society is pleased to announce the GRSS Student Research Grant 2026!

Grant Details:
• Amount: Up to $500 per project
• Duration: 3–6 months
• Open to: All enrolled students

Eligible Research Areas:
- Remote sensing applications
- GIS-based spatial analysis
- Earth observation and climate studies
- Geospatial AI and machine learning
- Environmental monitoring

Application Requirements:
1. Project proposal (max 2 pages)
2. Budget breakdown
3. Faculty supervisor confirmation
4. Expected outcomes and deliverables

Deadline: October 31, 2026

Submit applications to research@grss.edu or visit the Resources section for the application form.

All selected projects will be presented at our Annual GRSS Symposium in February 2027.',
  'Research Committee, GRSS', true, true,
  NOW() - INTERVAL '2 days'
),
(
  'New Resource Library Launched!',
  'resource-library-launched-2026',
  'We are excited to announce the launch of the GRSS Resource Library!

The library now contains:
📚 50+ research papers on remote sensing and GIS
🎥 Tutorial videos on QGIS, ArcGIS, and Google Earth Engine
📊 Workshop presentation slides from past events
📁 Sample datasets for practice projects
📝 Career guides for geospatial professionals

Access the library from the Resources section of this website. All resources are free for GRSS members.

We will continue adding new materials regularly. If you have resources you''d like to share with the community, please email us!',
  'Media Team, GRSS', true, false,
  NOW() - INTERVAL '1 day'
),
(
  'Congratulations to GIS Competition Winners!',
  'gis-competition-winners-2025',
  'We are proud to announce the winners of the GRSS GIS Mapping Competition 2025!

🥇 First Place: Team GeoPixels (Ahmed Khan, Sara Malik, Carlos Rivera)
Project: "Flood Vulnerability Mapping of Coastal Districts"
— Outstanding use of multi-source satellite data and innovative visualization

🥈 Second Place: Team EarthAnalysts (Priya Patel, Liu Yang)
Project: "Urban Heat Island Mapping using Thermal Landsat Data"
— Excellent methodology and clear storytelling

🥉 Third Place: Team SpatialMinds (Fatima Hassan, Rahul Singh)
Project: "Agricultural Drought Monitoring with MODIS NDVI"
— Impressive technical depth and practical applications

🏆 Best Visualization Award: Team MapArtists
— Stunning cartographic design and user-friendly presentation

Congratulations to all participants! We had 18 teams from 6 universities compete this year. See the full gallery in our Gallery section.',
  'GRSS Executive Committee', true, false,
  NOW() - INTERVAL '30 days'
)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- ACHIEVEMENTS
-- =====================================================
INSERT INTO achievements (title, description, achievement_date, category, team_members, award_position, is_featured) VALUES
(
  '1st Place — National GIS Innovation Challenge',
  'GRSS team "GeoInnovators" secured first place at the National GIS Innovation Challenge 2025, competing against 42 teams from universities across the country. The team''s project on flood vulnerability mapping using multi-sensor satellite fusion was recognized for its innovative methodology and practical impact.',
  '2025-12-10',
  'Competition Award',
  'Ahmed Khan, Sara Malik, Dr. Sarah Ahmed',
  '1st Place',
  true
),
(
  'Best Paper Award — International Earth Observation Conference',
  'Research paper titled "Urban Heat Island Dynamics using Multi-Temporal Landsat-8 Thermal Data" won the Best Student Paper Award at the International Earth Observation Conference 2025 held in Vienna, Austria.',
  '2025-11-20',
  'Research Award',
  'Rahul Gupta, Priya Sharma',
  'Best Student Paper',
  true
),
(
  'Champions — Geo-Hack University Hackathon',
  'GRSS team won the 48-hour Geo-Hack Hackathon organized by the National Institute of Technology, developing an AI-powered land cover change detection tool that processes 10-meter resolution satellite imagery in near-real-time.',
  '2025-10-05',
  'Hackathon',
  'Li Wei, Carlos Mendez, Fatima Hassan',
  '1st Place',
  true
),
(
  'Runner-Up — Remote Sensing Data Science Competition',
  'GRSS team placed second in the national Remote Sensing Data Science Competition, developing a deep learning model for automatic cloud detection in Sentinel-2 imagery with 96.4% accuracy.',
  '2025-09-15',
  'Competition Award',
  'Rahul Gupta, Amara Diallo, James Okonkwo',
  '2nd Place',
  false
),
(
  'University Excellence Award in Research',
  'GRSS received the University Excellence Award for Outstanding Student Research Contribution 2025, recognizing the society''s impactful projects in environmental monitoring and geospatial technology.',
  '2025-06-20',
  'University Award',
  'GRSS Executive Committee',
  'Excellence Award',
  true
),
(
  'Selected for International Remote Sensing Summer School',
  'Five GRSS members were selected for the prestigious ESA-ISRO Joint Remote Sensing Summer School 2025, one of only 12 universities worldwide to receive multiple nominations.',
  '2025-07-10',
  'Recognition',
  'Ahmed Khan, Sara Malik, Priya Sharma, Li Wei, Rahul Gupta',
  'Selection Award',
  false
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- PROJECTS
-- =====================================================
INSERT INTO projects (title, slug, description, category, technologies, supervisor, start_date, end_date, status, is_featured) VALUES
(
  'Urban Change Detection Using Multi-Temporal Satellite Imagery',
  'urban-change-detection-2025',
  'A comprehensive study analyzing urban expansion patterns in metropolitan areas using Landsat-8 and Sentinel-2 time-series data from 2015–2025. The project employs change detection algorithms including image differencing, principal component analysis, and supervised classification to identify and quantify urban growth patterns.

Key findings demonstrate a 34% increase in impervious surfaces over the study period, with significant encroachment on agricultural land and green spaces. Results have been validated using ground truth data collected during field surveys.

The project has been submitted for publication in the International Journal of Remote Sensing.',
  'Remote Sensing',
  'Python, GDAL, Rasterio, Scikit-learn, QGIS, Landsat-8, Sentinel-2',
  'Dr. Michael Chen, Department of Earth Sciences',
  '2024-09-01',
  '2025-06-30',
  'completed',
  true
),
(
  'GIS-Based Flood Risk Mapping System',
  'flood-risk-mapping-system',
  'Development of a comprehensive GIS-based flood risk assessment system for a river basin covering 2,400 km². The system integrates digital elevation models (DEM), soil classification, land cover maps, historical rainfall data, and drainage network analysis to generate flood hazard maps at multiple return periods (10, 25, 50, 100 years).

The system uses Python-based geospatial processing with open-source tools and outputs interactive web maps accessible to local government authorities for disaster preparedness planning.',
  'GIS',
  'ArcGIS Pro, Python, ArcPy, HEC-HMS, HEC-RAS, PostgreSQL/PostGIS',
  'Prof. Elena Rodriguez, Environmental Engineering',
  '2025-01-15',
  NULL,
  'ongoing',
  true
),
(
  'Agricultural Crop Health Monitoring Dashboard',
  'crop-health-monitoring-dashboard',
  'A real-time agricultural monitoring platform that uses Sentinel-2 imagery (10m resolution, 5-day revisit) to track crop health across 50,000 hectares of farmland. The system computes multiple vegetation indices (NDVI, EVI, SAVI, NDWI) and generates automated alerts when anomalies are detected.

The dashboard is accessible via a web browser and mobile app, providing farmers and agricultural extension officers with timely information for irrigation scheduling, pest/disease detection, and yield forecasting.',
  'Earth Observation',
  'Google Earth Engine, JavaScript, React, Node.js, PostgreSQL, Sentinel-2',
  'Dr. Anita Kumar, Agricultural Sciences',
  '2025-03-01',
  NULL,
  'ongoing',
  true
),
(
  'Machine Learning for Land Cover Classification',
  'ml-land-cover-classification',
  'Applying state-of-the-art deep learning models for automated land cover classification using multi-spectral satellite imagery. This project compares traditional machine learning approaches (Random Forest, SVM) with deep learning architectures (U-Net, DeepLab v3+) for semantic segmentation of Sentinel-2 imagery.

The final model achieves 93.7% overall accuracy across 12 land cover classes and has been deployed as a cloud-based API service that processes satellite tiles on demand.',
  'Machine Learning',
  'PyTorch, TensorFlow, Python, GDAL, Rasterio, Docker, FastAPI, Sentinel-2',
  'Prof. Rahul Gupta, Computer Science & Remote Sensing',
  '2024-11-01',
  '2025-08-31',
  'completed',
  false
),
(
  'Climate Change Impact on Himalayan Glaciers',
  'himalayan-glaciers-climate-study',
  'Multi-decadal analysis of glacier retreat and mass balance changes in the Himalayan range using SAR (Synthetic Aperture Radar), optical satellite imagery, and digital elevation models. The study covers 127 glaciers over a 30-year period (1990–2020) using Landsat TM, ETM+, OLI, and Sentinel-1 SAR data.

Results show an average retreat rate of 15.2 meters per year and significant seasonal mass balance variations correlated with regional temperature anomalies.',
  'Climate',
  'Python, SNAP, QGIS, Landsat Archive, Sentinel-1 SAR, DEM Analysis',
  'Dr. Priya Sharma, Glaciology and Remote Sensing',
  '2025-06-01',
  NULL,
  'ongoing',
  false
),
(
  'Smart Campus GIS Mapping',
  'smart-campus-gis-mapping',
  'Development of a comprehensive indoor and outdoor GIS map of the university campus incorporating building layouts, infrastructure networks, accessibility routes, and points of interest. The project creates a publicly accessible web GIS application for students and visitors.

Features include real-time room booking status integration, accessibility routing for mobility-impaired users, emergency evacuation route planning, and integration with the university management system.',
  'GIS',
  'QGIS, PostGIS, Leaflet.js, React, Node.js, OpenStreetMap',
  'Li Wei, Event Coordinator (Self-guided project)',
  '2025-09-01',
  NULL,
  'planning',
  false
)
ON CONFLICT (slug) DO NOTHING;

-- Add project members
DO $$
DECLARE
  p1 UUID; p2 UUID; p3 UUID; p4 UUID; p5 UUID; p6 UUID;
BEGIN
  SELECT id INTO p1 FROM projects WHERE slug = 'urban-change-detection-2025' LIMIT 1;
  SELECT id INTO p2 FROM projects WHERE slug = 'flood-risk-mapping-system' LIMIT 1;
  SELECT id INTO p3 FROM projects WHERE slug = 'crop-health-monitoring-dashboard' LIMIT 1;
  SELECT id INTO p4 FROM projects WHERE slug = 'ml-land-cover-classification' LIMIT 1;
  SELECT id INTO p5 FROM projects WHERE slug = 'himalayan-glaciers-climate-study' LIMIT 1;
  SELECT id INTO p6 FROM projects WHERE slug = 'smart-campus-gis-mapping' LIMIT 1;

  IF p1 IS NOT NULL THEN
    INSERT INTO project_members (project_id, name, role) VALUES
      (p1, 'Ahmed Khan',    'Lead Developer'), (p1, 'Sara Malik', 'GIS Analyst'),
      (p1, 'Rahul Gupta',   'ML Engineer')
    ON CONFLICT DO NOTHING;
  END IF;

  IF p2 IS NOT NULL THEN
    INSERT INTO project_members (project_id, name, role) VALUES
      (p2, 'James Okonkwo', 'GIS Lead'),    (p2, 'Aisha Nkosi',  'Data Analyst'),
      (p2, 'Carlos Mendez', 'Field Survey')
    ON CONFLICT DO NOTHING;
  END IF;

  IF p3 IS NOT NULL THEN
    INSERT INTO project_members (project_id, name, role) VALUES
      (p3, 'Li Wei',         'Full Stack Dev'), (p3, 'Fatima Hassan', 'UI/UX Design'),
      (p3, 'Amara Diallo',   'Remote Sensing')
    ON CONFLICT DO NOTHING;
  END IF;

  IF p4 IS NOT NULL THEN
    INSERT INTO project_members (project_id, name, role) VALUES
      (p4, 'Rahul Gupta',   'ML Lead'),       (p4, 'Priya Sharma', 'Data Processing')
    ON CONFLICT DO NOTHING;
  END IF;

  IF p5 IS NOT NULL THEN
    INSERT INTO project_members (project_id, name, role) VALUES
      (p5, 'Priya Sharma',  'Research Lead'), (p5, 'Carlos Mendez','SAR Analysis'),
      (p5, 'Ahmed Khan',    'DEM Processing')
    ON CONFLICT DO NOTHING;
  END IF;

  IF p6 IS NOT NULL THEN
    INSERT INTO project_members (project_id, name, role) VALUES
      (p6, 'Li Wei',         'Project Lead'),  (p6, 'Fatima Hassan','Web Development')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- =====================================================
-- GALLERY ALBUMS
-- =====================================================
INSERT INTO gallery_albums (title, slug, description, event_date) VALUES
  ('Remote Sensing Workshop 2025',  'remote-sensing-workshop-2025', 'Hands-on workshop where students worked with real satellite imagery and GIS software.', '2025-10-18'),
  ('Field Visit: RS Observatory',   'field-visit-rs-observatory',   'Behind-the-scenes visit to the Regional Remote Sensing Observatory ground station.',  '2025-09-20'),
  ('GIS Competition 2025',          'gis-competition-2025',         'Annual inter-university GIS mapping competition attracting teams from 6 universities.',  '2025-12-05'),
  ('Annual GRSS Symposium 2025',    'annual-grss-symposium-2025',   'Flagship annual symposium bringing together students, researchers, and industry experts.', '2025-02-15'),
  ('Campus Mapping Field Exercise', 'campus-mapping-field-exercise','Students conducted GPS surveys and field data collection for the Smart Campus GIS project.', '2025-11-10')
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- RESOURCES
-- =====================================================
INSERT INTO resources (title, slug, description, category, author, file_type, is_published, download_count) VALUES
(
  'QGIS Beginner''s Guide 2025',
  'qgis-beginners-guide-2025',
  'A comprehensive step-by-step guide to getting started with QGIS, the leading open-source GIS software. Covers installation, interface overview, loading data, basic styling, and your first spatial analysis. Includes practice datasets and exercise files.',
  'GIS',
  'GRSS Technical Team',
  'PDF',
  true,
  127
),
(
  'Introduction to Google Earth Engine',
  'intro-google-earth-engine',
  'Learn how to harness the power of Google Earth Engine for large-scale geospatial analysis. This tutorial covers the JavaScript API, image collections, filtering satellite data, computing indices, and exporting results.',
  'Remote Sensing',
  'Rahul Gupta',
  'PDF',
  true,
  89
),
(
  'Remote Sensing Data Sources Handbook',
  'remote-sensing-data-sources-handbook',
  'Curated guide to free and open satellite data sources including Landsat (USGS), Sentinel (ESA Copernicus), MODIS (NASA), SRTM DEM, and more. Includes download instructions, data formats, and typical use cases for each dataset.',
  'Resources',
  'GRSS Research Team',
  'PDF',
  true,
  203
),
(
  'Python for Geospatial Analysis — Workshop Slides',
  'python-geospatial-workshop-slides',
  'Presentation slides from the GRSS Python for Geospatial Analysis workshop. Covers GDAL, Rasterio, GeoPandas, Shapely, and Matplotlib for geospatial visualization. Includes worked examples and code snippets.',
  'Workshop Material',
  'Li Wei',
  'PDF',
  true,
  156
),
(
  'Machine Learning for Earth Observation — Course Notes',
  'ml-earth-observation-notes',
  'Comprehensive course notes covering the application of machine learning to remote sensing data. Topics include feature extraction, Random Forest for land cover classification, neural networks for image segmentation, and model evaluation strategies.',
  'Machine Learning',
  'Rahul Gupta',
  'PDF',
  true,
  94
),
(
  'Fundamentals of SAR Remote Sensing',
  'fundamentals-sar-remote-sensing',
  'Educational material explaining Synthetic Aperture Radar (SAR) principles, data characteristics, and applications. Covers backscatter interpretation, InSAR for deformation mapping, and practical examples using Sentinel-1 data.',
  'Remote Sensing',
  'GRSS Research Team',
  'PDF',
  true,
  67
),
(
  'GIS Career Guide for Geoscience Students',
  'gis-career-guide-geoscience',
  'Practical career guide for students interested in GIS and remote sensing careers. Covers job roles, required skills, recommended certifications, building a portfolio, internship tips, and insights from industry professionals.',
  'Resources',
  'Fatima Hassan',
  'PDF',
  true,
  178
)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- VERIFY SEED DATA
-- =====================================================
SELECT 'Seed data summary:' AS info;
SELECT
  'excom_members'   AS tbl, COUNT(*) AS rows FROM excom_members
UNION ALL SELECT 'events',        COUNT(*) FROM events
UNION ALL SELECT 'announcements', COUNT(*) FROM announcements
UNION ALL SELECT 'achievements',  COUNT(*) FROM achievements
UNION ALL SELECT 'projects',      COUNT(*) FROM projects
UNION ALL SELECT 'project_members', COUNT(*) FROM project_members
UNION ALL SELECT 'gallery_albums', COUNT(*) FROM gallery_albums
UNION ALL SELECT 'resources',     COUNT(*) FROM resources
ORDER BY tbl;
