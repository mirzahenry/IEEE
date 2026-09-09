# 🚀 GRSS Website — Vercel Deployment Guide

Complete step-by-step guide to deploy your GRSS website on Vercel for free.

---

## ✅ Pre-Deployment Checklist

Before deploying, verify:

```
✅ Supabase project created (qffsemkkzfnqnvwavgjp.supabase.co)
✅ Database schema deployed (schema.sql)
✅ Storage buckets created (storage-buckets.sql)
✅ RLS disabled on all tables
✅ Admin user created (admin@gmail.com)
✅ Admin role assigned in admin_roles table
✅ membership_applications table created (join-us-table.sql)
✅ Frontend builds without errors (npm run build)
✅ Settings saved correctly
```

---

## 📋 Step 1: Prepare GitHub Repository

### 1.1 Initialize Git (if not already done)

```bash
cd C:\Users\DELL\Desktop\iee
git init
git add .
git commit -m "Initial commit - GRSS Website"
```

### 1.2 Create GitHub Repository

1. Go to [github.com](https://github.com)
2. Click **New Repository**
3. Name: `grss-website`
4. Keep it **Private** or **Public** (your choice)
5. **DO NOT** initialize with README
6. Click **Create repository**

### 1.3 Push Code to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/grss-website.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

---

## 🌐 Step 2: Deploy to Vercel

### 2.1 Sign Up / Login

1. Go to [vercel.com](https://vercel.com)
2. Click **Sign up** → Choose **Continue with GitHub**
3. Authorize Vercel to access your repositories

### 2.2 Import Project

1. From Vercel Dashboard → Click **Add New** → **Project**
2. Find `grss-website` in the list
3. Click **Import**

### 2.3 Configure Build Settings

**CRITICAL:** Set these EXACTLY:

```
Framework Preset:    Vite
Root Directory:      frontend       ← MUST SET THIS!
Build Command:       npm run build  (auto-detected)
Output Directory:    dist           (auto-detected)
Install Command:     npm install    (auto-detected)
```

**How to set Root Directory:**
- Click **Edit** next to "Root Directory"
- Type: `frontend`
- Click outside to save

### 2.4 Environment Variables

Click **Add** for each:

| Name | Value |
|---|---|
| `VITE_SUPABASE_URL` | `https://qffsemkkzfnqnvwavgjp.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Your anon key from Supabase Dashboard → Settings → API |

**Where to find VITE_SUPABASE_ANON_KEY:**
```
Supabase Dashboard
→ Settings (gear icon)
→ API
→ Project API keys
→ "anon" "public" key (starts with eyJhbGciOiJI...)
```

Copy the ENTIRE key (it's very long).

### 2.5 Deploy!

1. Click **Deploy**
2. Wait 2–3 minutes
3. ✅ You'll get a URL like: `grss-website.vercel.app`

---

## 🔧 Step 3: Configure Supabase for Vercel

### 3.1 Update Site URL

```
Supabase Dashboard
→ Authentication
→ URL Configuration
→ Site URL: https://grss-website.vercel.app
→ Save
```

### 3.2 Add Redirect URLs

```
Supabase Dashboard
→ Authentication
→ URL Configuration
→ Redirect URLs → Add URL:

https://grss-website.vercel.app/**
https://grss-website-*.vercel.app/**

→ Save
```

The `**` allows all paths. The `*` allows preview deployments.

---

## 🧪 Step 4: Test Your Live Website

### Test Checklist

```
□ Visit https://grss-website.vercel.app
□ Homepage loads with correct society name
□ Navbar shows all pages
□ Dark mode toggle works
□ Click "Join Us" → form works
□ Submit test application
□ Go to /admin/login
□ Login with admin@gmail.com / admin123
□ Check Admin Dashboard
□ Check Join Applications in admin
□ Test Settings → save changes
□ Verify changes appear on public site
```

---

## 🎨 Step 5: Custom Domain (Optional)

### If you have a domain (e.g., grss.edu.pk):

```
Vercel Dashboard
→ Your project
→ Settings
→ Domains
→ Add Domain
→ Enter: grss.edu.pk
→ Follow DNS instructions
```

You'll need to add DNS records:
- Type: `A` → Points to Vercel IP
- Type: `CNAME` → Points to `cname.vercel-dns.com`

Vercel will guide you through this.

---

## 🐛 Troubleshooting

### "Failed to load" errors on admin panel

**Cause:** RLS not disabled  
**Fix:** Run this in Supabase SQL Editor:

```sql
ALTER TABLE events DISABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations DISABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE announcements DISABLE ROW LEVEL SECURITY;
ALTER TABLE achievements DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE project_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE excom_positions DISABLE ROW LEVEL SECURITY;
ALTER TABLE excom_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_albums DISABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images DISABLE ROW LEVEL SECURITY;
ALTER TABLE resources DISABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE membership_applications DISABLE ROW LEVEL SECURITY;
```

---

### Settings not saving

**Cause:** Caching issue  
**Fix:** 
1. Hard refresh: `Ctrl+Shift+R`
2. Check Supabase → site_settings table has rows
3. Re-deploy on Vercel

---

### Build fails on Vercel

**Cause:** Root directory not set  
**Fix:**
```
Vercel Dashboard
→ Project Settings
→ General
→ Root Directory: frontend
→ Save
→ Redeploy
```

---

### Images not uploading

**Cause:** Storage bucket policies  
**Fix:** Run `storage-buckets.sql` again in Supabase

---

## 📊 Post-Deployment

### Add Content via Admin Panel

```
1. Settings → Update society name, contact info, social links
2. ExCom → Add team members with photos
3. Events → Create upcoming events
4. Projects → Add research projects
5. Announcements → Post news
6. Gallery → Upload photo albums
7. Resources → Add study materials
8. Achievements → Add awards
```

### Seed Demo Data (Optional)

If you want sample content:

```sql
-- Run in Supabase SQL Editor
-- Copy entire database/seed-data.sql
```

---

## 🔐 Security Notes

### Current Setup (Development-Friendly)

```
✅ RLS Disabled → Easy admin access
✅ Admin role check on frontend
⚠️ No rate limiting
⚠️ Public Supabase anon key (normal for frontend)
```

### Production Hardening (Later)

When you're ready for full security:

1. **Enable RLS** with proper policies
2. **Add rate limiting** via Supabase
3. **Enable email verification** for admin users
4. **Add 2FA** for admin accounts
5. **Monitor logs** regularly

---

## 📱 Vercel Features You Get Free

```
✅ SSL Certificate (HTTPS)
✅ CDN (Fast worldwide)
✅ Auto-deploy on git push
✅ Preview deployments (for branches)
✅ Analytics
✅ 100GB bandwidth/month
✅ Unlimited projects
```

---

## 🎯 Next Steps After Deployment

1. Share the link with team
2. Test all features
3. Add real content
4. Share with members
5. Monitor Join Us applications
6. Respond to contact messages

---

## 📞 Support

If deployment fails:

1. Check Vercel build logs
2. Verify environment variables
3. Test `npm run build` locally first
4. Check Supabase connection

---

## 🎉 Success!

Your website is live! 🚀

**Public URL:** `https://grss-website.vercel.app`  
**Admin Panel:** `https://grss-website.vercel.app/admin/login`

---

**Built with:**
- React + Vite
- Tailwind CSS
- Supabase
- Vercel

**Last Updated:** 2026-09-09
