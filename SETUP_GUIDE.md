# GRSS Website - Quick Setup Guide

## 🚀 5-Minute Setup

### Step 1: Install Dependencies (2 minutes)

```bash
npm install
```

### Step 2: Create Supabase Project (2 minutes)

1. Visit [https://supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in:
   - Project name: `grss-website`
   - Database password: (choose a strong password)
   - Region: (closest to you)
4. Click "Create new project" and wait

### Step 3: Setup Database (1 minute)

While in your Supabase dashboard:

1. Go to **SQL Editor** (left sidebar)
2. Click **+ New Query**
3. Copy everything from `database/schema.sql`
4. Paste and click **Run**
5. Create another new query
6. Copy everything from `database/storage-buckets.sql`
7. Paste and click **Run**

### Step 4: Create Admin User (30 seconds)

1. Go to **Authentication** > **Users**
2. Click **Add User**
3. Enter:
   - Email: `admin@grss.edu` (or your email)
   - Password: (your password)
4. Click **Create User**
5. **Copy the User ID** that appears
6. Go back to **SQL Editor**
7. Run this query (replace `YOUR_USER_ID`):

```sql
INSERT INTO admin_roles (user_id, role)
VALUES ('YOUR_USER_ID', 'super_admin');
```

### Step 5: Get Your API Keys (30 seconds)

1. Go to **Settings** > **API** (gear icon in sidebar)
2. You'll see:
   - **Project URL**
   - **Project API keys**
     - `anon` `public` key
     - `service_role` key

### Step 6: Create Environment Files (1 minute)

Create `.env` file in the root directory:

```env
VITE_SUPABASE_URL=<paste your Project URL>
VITE_SUPABASE_ANON_KEY=<paste your anon public key>
```

Create `backend/.env` file:

```env
SUPABASE_URL=<paste your Project URL>
SUPABASE_SERVICE_ROLE_KEY=<paste your service_role key>
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Step 7: Start the Application (10 seconds)

```bash
npm run dev
```

## ✅ You're Done!

Open your browser:
- **Frontend:** http://localhost:5173
- **Admin Login:** http://localhost:5173/admin/login

Use the email and password you created in Step 4 to log in.

---

## 📝 What's Next?

### Customize Your Website

1. **Update Site Settings:**
   - Go to Admin Panel > Settings
   - Update society name, contact info, social links

2. **Add ExCom Members:**
   - Go to Admin Panel > ExCom
   - Add executive committee members with photos

3. **Create Events:**
   - Go to Admin Panel > Events
   - Add upcoming and past events

4. **Upload Photos:**
   - Go to Admin Panel > Gallery
   - Create albums and upload photos

5. **Add Projects:**
   - Go to Admin Panel > Projects
   - Showcase your research and technical projects

6. **Post Announcements:**
   - Go to Admin Panel > Announcements
   - Share news and updates

---

## 🐛 Common Issues

### Issue: "Missing Supabase environment variables"
**Solution:** Make sure you created the `.env` file with the correct keys.

### Issue: "Invalid login credentials"
**Solution:** Double-check that you:
1. Created the user in Supabase Authentication
2. Added the user to `admin_roles` table with the correct User ID

### Issue: Database error when trying to view content
**Solution:** Make sure you ran both SQL files:
- `database/schema.sql`
- `database/storage-buckets.sql`

### Issue: Cannot upload images
**Solution:** Make sure you ran `database/storage-buckets.sql` to create storage buckets.

### Issue: Port 5173 or 5000 already in use
**Solution:** 
- Close other applications using those ports
- Or edit the port numbers in `.env` and `vite.config.js`

---

## 🆘 Need Help?

- Check `README.md` for detailed documentation
- Review database schema in `database/schema.sql`
- Check browser console for errors (F12)
- Check terminal logs for backend errors

---

## 🎉 Success Checklist

- [ ] Dependencies installed
- [ ] Supabase project created
- [ ] Database schema executed
- [ ] Storage buckets created
- [ ] Admin user created
- [ ] Admin role assigned
- [ ] `.env` file created with correct keys
- [ ] `backend/.env` file created
- [ ] Application running on http://localhost:5173
- [ ] Successfully logged into admin panel

If all items are checked, you're ready to go! 🚀
