# GRSS — Geosciences & Remote Sensing Society

> **Exploring Earth. Advancing Technology. Inspiring the Next Generation.**

Official website for the **Geosciences and Remote Sensing Society** — a university student organization dedicated to advancing knowledge in earth sciences, remote sensing, GIS, and geospatial technologies.

---

## ✨ Features

### Public Website
| Feature | Description |
|---|---|
| 🏠 **Homepage** | Hero, animated stats counter, announcements ticker, featured events/projects/achievements, ExCom preview |
| 📅 **Events** | Upcoming/past events, category filters, event detail pages, online registration form |
| 👥 **ExCom** | Executive committee grouped by position, hover social links, featured president section |
| 🏆 **Achievements** | Category-filtered achievement cards with featured highlights |
| 🚀 **Projects** | Portfolio with technology tags, GitHub/demo links, team members |
| 📸 **Gallery** | Album-based gallery with masonry layout, keyboard-navigable lightbox |
| 📚 **Resources** | Downloadable files (PDF/PPT/DOCX), download counter, category filters |
| 📢 **Announcements** | News listing with animated ticker on homepage, detail pages |
| 🔍 **Search** | Global debounced search across events, projects, achievements, resources, members |
| 📞 **Contact** | Form → saved to database, social media links, dynamic settings |
| 🌙 **Dark Mode** | Full light/dark theme with `localStorage` persistence |
| 📱 **Responsive** | Mobile-first, tested at 320 px → 1536 px |
| 🎯 **404 Page** | Animated globe, back/home/search buttons |

### Admin Panel (`/admin`)
| Section | Capabilities |
|---|---|
| 📊 **Dashboard** | Stats cards, recent registrations, recent events, quick-action grid |
| 📅 **Events** | CRUD, status toggle, featured toggle, poster upload |
| 📝 **Registrations** | Search/filter/sort, status update (registered → attended → cancelled), **CSV export** |
| 👥 **ExCom** | Members + positions tabs, photo upload, active toggle |
| 📢 **Announcements** | CRUD, publish/unpublish toggle |
| 🏆 **Achievements** | CRUD, featured toggle, image upload |
| 🚀 **Projects** | CRUD, team members management, image upload |
| 📸 **Gallery** | Album CRUD, multi-image upload with progress bar, cover image picker |
| 📚 **Resources** | CRUD, file upload (PDF/PPT/DOCX/ZIP), publish toggle |
| ✉️ **Messages** | View contact form submissions, mark read, reply via email, delete |
| ⚙️ **Settings** | Edit all site settings (name, tagline, contact, social links, mission, vision) |

---

## 🛠️ Tech Stack

```
Frontend          Backend           Database & Storage
─────────         ────────          ──────────────────
React 18          Node.js 18        Supabase PostgreSQL
Vite 5            Express 4         Supabase Storage
Tailwind CSS 3    Multer            Supabase Auth
Framer Motion     Helmet / CORS     Row Level Security
React Router 6    Rate Limiting
Lucide React      Express Validator
React Hot Toast
```

---

## 📋 Prerequisites

- **Node.js** v18 or higher — [nodejs.org](https://nodejs.org)
- **npm** v9 or higher
- A free **Supabase** account — [supabase.com](https://supabase.com)

---

## 🚀 Quick Start (5 minutes)

### Step 1 — Install dependencies

```bash
cd frontend && npm install
cd ../backend && npm install
```

Or use the helper script:
```bash
# Windows
npm run install:all
```

---

### Step 2 — Create Supabase project

1. Go to [supabase.com](https://supabase.com) → **New project**
2. Choose a name (e.g. `grss-website`) and a strong database password
3. Select the region closest to your users
4. Wait ~2 minutes for provisioning

---

### Step 3 — Run the database schema

1. In your Supabase dashboard, click **SQL Editor** in the left sidebar
2. Click **+ New query**
3. Copy the entire content of `database/schema.sql` and paste it in
4. Click **Run** — you should see "Success"

---

### Step 4 — Create storage buckets

1. Still in **SQL Editor**, open another new query
2. Paste the content of `database/storage-buckets.sql`
3. Click **Run**

This creates 7 public buckets: `excom`, `events`, `gallery`, `achievements`, `projects`, `resources`, `announcements`.

---

### Step 5 — Create your admin user

1. In Supabase dashboard → **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Enter your email and a strong password → **Create user**
4. **Copy the User ID** shown in the users list

5. Back in **SQL Editor**, run this query (replace the placeholder):

```sql
INSERT INTO admin_roles (user_id, role)
VALUES ('PASTE-YOUR-USER-ID-HERE', 'super_admin');
```

---

### Step 6 — Get your API keys

1. Go to **Settings** → **API** (gear icon in sidebar)
2. Note down:
   - **Project URL** — looks like `https://abcdefgh.supabase.co`
   - **anon / public** key — the long JWT under "Project API keys"
   - **service_role** key — ⚠️ keep this secret, never put it in frontend code

---

### Step 7 — Configure environment variables

Create `frontend/.env`:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

Create `backend/.env`:
```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

---

### Step 8 — (Optional) Load demo data

In Supabase **SQL Editor**, run `database/seed-data.sql` to populate the site with realistic demo content:
- 9 ExCom members
- 7 events (5 upcoming, 2 completed)
- 4 announcements
- 6 achievements
- 6 research projects
- 5 gallery albums
- 7 resources

---

### Step 9 — Start the application

**Windows (recommended):**
```bash
# Double-click, or run in PowerShell:
./start-dev.ps1

# Frontend only:
./start-dev.ps1 -FrontendOnly

# Backend only:
./start-dev.ps1 -BackendOnly
```

**Or start manually:**
```bash
# Terminal 1 — Frontend
cd frontend && npm run dev

# Terminal 2 — Backend
cd backend  && npm run dev
```

**Access the app:**
| URL | Description |
|---|---|
| `http://localhost:5173` | Public website |
| `http://localhost:5173/admin/login` | Admin login |
| `http://localhost:5000/health` | Backend health check |

---

## 📁 Project Structure

```
iee/
├── frontend/
│   ├── public/
│   │   ├── favicon.svg          # Globe + satellite icon
│   │   └── og-image.svg         # Social sharing image
│   └── src/
│       ├── components/
│       │   ├── admin/
│       │   │   └── AdminLayout.jsx   # Sidebar, topbar, unread badge
│       │   ├── auth/
│       │   │   └── ProtectedRoute.jsx
│       │   ├── common/               # Badge, Modal, Pagination, etc.
│       │   └── layout/
│       │       ├── Navbar.jsx        # Sticky, blur, mobile menu
│       │       └── Footer.jsx        # Dynamic settings from DB
│       ├── context/
│       │   ├── AuthContext.jsx       # Supabase auth + roles
│       │   └── ThemeContext.jsx      # Dark/light with localStorage
│       ├── hooks/
│       │   └── useSettings.js        # Cached site settings hook
│       ├── pages/
│       │   ├── Home.jsx              # Full homepage with all sections
│       │   ├── About.jsx
│       │   ├── Contact.jsx
│       │   ├── Events.jsx / EventDetail.jsx
│       │   ├── ExCom.jsx
│       │   ├── Projects.jsx / ProjectDetail.jsx
│       │   ├── Achievements.jsx
│       │   ├── Gallery.jsx / GalleryAlbum.jsx  # Lightbox included
│       │   ├── Resources.jsx / ResourceDetail.jsx
│       │   ├── Announcements.jsx / AnnouncementDetail.jsx
│       │   ├── Search.jsx
│       │   ├── NotFound.jsx          # 404 page
│       │   ├── auth/
│       │   │   └── AdminLogin.jsx
│       │   └── admin/
│       │       ├── Dashboard.jsx
│       │       ├── Events.jsx / EventForm.jsx
│       │       ├── Registrations.jsx  # CSV export
│       │       ├── ExCom.jsx / ExComForm.jsx
│       │       ├── Announcements.jsx / AnnouncementForm.jsx
│       │       ├── Achievements.jsx / AchievementForm.jsx
│       │       ├── Projects.jsx / ProjectForm.jsx
│       │       ├── Gallery.jsx / GalleryForm.jsx
│       │       ├── Resources.jsx / ResourceForm.jsx
│       │       ├── ContactMessages.jsx
│       │       └── Settings.jsx
│       ├── services/                  # All Supabase queries
│       ├── utils/
│       │   ├── helpers.js             # formatDate, generateSlug, etc.
│       │   └── uploadHelpers.js       # Supabase Storage upload
│       ├── App.jsx                    # All routes (lazy loaded)
│       └── index.css                  # Tailwind + custom CSS classes
│
├── backend/
│   ├── config/
│   │   └── supabase.js               # Admin client (service role)
│   ├── routes/
│   │   ├── events.js                 # CRUD events API
│   │   ├── registrations.js          # Registrations + CSV export
│   │   ├── upload.js                 # Multer → Supabase Storage
│   │   └── contact.js                # Contact messages API
│   └── server.js                     # Express + rate limiting + CORS
│
├── database/
│   ├── schema.sql                    # All tables, indexes, RLS policies
│   ├── storage-buckets.sql           # 7 storage buckets + policies
│   └── seed-data.sql                 # Realistic demo content
│
├── start-dev.ps1                     # Windows PowerShell startup script
├── start-dev.bat                     # Windows batch startup script
├── .env.example                      # Environment variable template
├── package.json
└── README.md
```

---

## 🗄️ Database Tables

| Table | Purpose |
|---|---|
| `admin_roles` | Admin user roles (super_admin / admin / editor) |
| `site_settings` | All configurable site text (name, tagline, contact, social) |
| `excom_positions` | Position titles with display order |
| `excom_members` | Member profiles linked to positions |
| `events` | Events with all metadata and poster |
| `event_registrations` | Registration form submissions |
| `announcements` | News/announcements with publish scheduling |
| `achievements` | Awards, competitions, recognitions |
| `projects` | Research and technical projects |
| `project_members` | Team members linked to projects |
| `gallery_albums` | Photo albums with cover image |
| `gallery_images` | Images linked to albums |
| `resources` | Downloadable files and documents |
| `contact_messages` | Contact form submissions |

---

## 🔐 Security

- **Row Level Security (RLS)** on every table
- **Role-based access**: super_admin / admin / editor
- **Protected routes**: unauthenticated users redirected to login
- **Rate limiting**: 200 req/15 min general, 20 req/hour for forms
- **Helmet.js**: security headers on all API responses
- **Input validation**: express-validator on all POST/PATCH routes
- **File validation**: type + size checked before Supabase upload
- **Service role key**: only on backend, never in frontend code
- **Environment variables**: all secrets in `.env`, never committed

---

## 🎨 Design System

### Colors
```
Primary Blue  #0052cc  — buttons, links, active states
Earth Green   #2da065  — accent, success states, earth topics
Dark Navy     #000a1a  — hero backgrounds
```

### Custom CSS classes (in `index.css`)
```css
.btn-primary     /* blue filled button */
.btn-secondary   /* white/gray outlined button */
.btn-outline     /* transparent with blue border */
.card            /* white/dark-800 rounded card */
.card-hover      /* card with lift on hover */
.input           /* styled text input */
.textarea        /* styled textarea */
.select          /* styled select dropdown */
.section         /* vertical section padding */
.container-custom /* max-w-7xl centered container */
.heading-xl/lg/md /* responsive heading sizes */
.gradient-text   /* primary→earth gradient text */
```

---

## 📦 Build for Production

```bash
cd frontend
npm run build
# Output: frontend/dist/
```

The build is automatically code-split into ~55 lazy chunks. Total gzipped size ≈ 195 KB initial load.

---

## 🌐 Deployment

### Frontend → Vercel (recommended)
1. Push to GitHub
2. Import repo on [vercel.com](https://vercel.com)
3. Set **Root Directory** to `frontend`
4. Add environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
5. Deploy

### Backend → Render
1. Create **Web Service** on [render.com](https://render.com)
2. Set **Root Directory** to `backend`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables
6. Update `FRONTEND_URL` to your Vercel URL

### Full deployment guide → `DEPLOYMENT.md`

---

## 🔧 Common Issues

**"Missing Supabase environment variables"**
→ Check `frontend/.env` exists and has both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

**"Invalid login credentials" on admin login**
→ Verify you added the user to `admin_roles` table with their exact Supabase User ID

**Images not uploading**
→ Run `database/storage-buckets.sql` in Supabase SQL Editor to create buckets

**"Table doesn't exist" errors**
→ Run `database/schema.sql` first, then `database/storage-buckets.sql`

**Port 5173 already in use**
→ Vite will automatically try 5174, 5175, etc. — check the terminal output for the actual URL

---

## 🤝 Admin Roles

| Role | Permissions |
|---|---|
| `super_admin` | Full access to everything |
| `admin` | Manage all content and view registrations |
| `editor` | Manage events, announcements, gallery, resources |

To change a user's role:
```sql
UPDATE admin_roles
SET role = 'editor'  -- or 'admin' or 'super_admin'
WHERE user_id = 'the-user-uuid';
```

---

## 📄 Environment Variables Reference

### `frontend/.env`
| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Public anon key (safe for frontend) |

### `backend/.env`
| Variable | Description |
|---|---|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key — **keep secret** |
| `PORT` | Backend port (default: 5000) |
| `NODE_ENV` | `development` or `production` |
| `FRONTEND_URL` | Frontend URL for CORS whitelist |

---

## 🏗️ Future Expansion

The database schema is designed to support these features without restructuring:

- Student membership portal + login
- QR code event attendance
- Certificate generation + verification
- Email notifications (event reminders, registration confirmations)
- Event feedback forms
- Publication / research paper management
- Volunteer management system
- Interactive event calendar

---

## 📝 License

MIT License — free to use, modify, and distribute.

---

## 🙏 Built With

- [React](https://react.dev) — UI framework
- [Vite](https://vitejs.dev) — Build tool
- [Tailwind CSS](https://tailwindcss.com) — Styling
- [Framer Motion](https://www.framer.com/motion/) — Animations
- [Supabase](https://supabase.com) — Database, Auth, Storage
- [Lucide React](https://lucide.dev) — Icons
- [Express.js](https://expressjs.com) — Backend API

---

<div align="center">

**Made with ❤️ by the GRSS Development Team**

*Exploring Earth · Advancing Technology · Inspiring the Next Generation*

</div>
