# GRSS Website - Deployment Guide

## 🌐 Deployment Options

This guide covers deploying the GRSS website to production environments.

---

## Option 1: Vercel (Frontend) + Render (Backend) [Recommended]

### Frontend Deployment (Vercel)

1. **Prepare for Deployment**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Vercel**
   - Install Vercel CLI: `npm i -g vercel`
   - Run: `vercel`
   - Follow prompts
   - Set environment variables in Vercel dashboard:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

3. **Alternative: Deploy via Vercel Dashboard**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set root directory to `frontend`
   - Add environment variables
   - Deploy

### Backend Deployment (Render)

1. **Create `render.yaml`** (already configured if provided)

2. **Deploy to Render**
   - Go to [render.com](https://render.com)
   - Create new Web Service
   - Connect your GitHub repository
   - Set:
     - **Root Directory:** `backend`
     - **Build Command:** `npm install`
     - **Start Command:** `npm start`

3. **Add Environment Variables** in Render dashboard:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   PORT=5000
   NODE_ENV=production
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```

4. **Update CORS**
   - Update `FRONTEND_URL` to match your Vercel deployment URL

---

## Option 2: Netlify (Frontend) + Railway (Backend)

### Frontend Deployment (Netlify)

1. **Build the Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `dist` folder
   - Or connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Add environment variables

### Backend Deployment (Railway)

1. **Deploy to Railway**
   - Go to [railway.app](https://railway.app)
   - Create new project from GitHub
   - Select `backend` directory as root
   - Add environment variables
   - Railway will auto-detect Node.js and deploy

---

## Option 3: VPS (Self-Hosted)

### Requirements
- Ubuntu 20.04+ or similar
- Node.js 18+
- nginx
- PM2 process manager
- Domain name (optional but recommended)

### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install nginx
sudo apt install nginx -y
```

### 2. Deploy Application

```bash
# Clone repository
git clone <your-repo-url> /var/www/grss
cd /var/www/grss

# Install dependencies
npm install

# Build frontend
cd frontend
npm run build
cd ..
```

### 3. Configure PM2

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'grss-backend',
    cwd: './backend',
    script: 'server.js',
    env: {
      NODE_ENV: 'production',
      PORT: 5000,
      // Add other environment variables
    }
  }]
};
```

Start with PM2:

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 4. Configure Nginx

Create `/etc/nginx/sites-available/grss`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/grss/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/grss /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5. SSL Certificate (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

---

## Environment Variables Reference

### Frontend (Public)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Backend (Private - Keep Secure!)
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.com
```

---

## Post-Deployment Checklist

- [ ] Frontend is accessible
- [ ] Backend API is responding
- [ ] Database connection is working
- [ ] File uploads are working
- [ ] Admin login is functional
- [ ] All pages load correctly
- [ ] Dark mode toggle works
- [ ] Mobile responsive design works
- [ ] Forms submit successfully
- [ ] Images load properly
- [ ] Search functionality works
- [ ] 404 pages redirect correctly
- [ ] SSL certificate is active (HTTPS)
- [ ] CORS is properly configured
- [ ] Environment variables are set
- [ ] Performance is optimized

---

## Monitoring & Maintenance

### Logs

**PM2 Logs (VPS):**
```bash
pm2 logs grss-backend
```

**Vercel Logs:**
- Check in Vercel dashboard

**Render Logs:**
- Check in Render dashboard

### Updates

```bash
# Pull latest changes
git pull origin main

# Update dependencies
npm install

# Rebuild frontend
cd frontend
npm run build

# Restart backend (PM2)
pm2 restart grss-backend
```

---

## Backup Strategy

### 1. Database Backup (Supabase)
- Supabase automatically backs up your database
- You can also manually export:
  - Go to Supabase Dashboard > Database
  - Use pg_dump for manual backups

### 2. Code Backup
- Keep your code in Git repository
- Regular commits and pushes

### 3. Media Files Backup
- Supabase Storage has redundancy
- Consider periodic exports for critical files

---

## Troubleshooting

### Frontend Issues

**Issue:** Blank page after deployment
- Check browser console for errors
- Verify environment variables are set
- Check if API URL is correct

**Issue:** Assets not loading
- Verify build was successful
- Check base URL in vite.config.js

### Backend Issues

**Issue:** API not responding
- Check if backend is running
- Verify PORT is correct
- Check firewall settings
- Review backend logs

**Issue:** Database connection error
- Verify Supabase URL and keys
- Check if IP is whitelisted (if applicable)
- Test connection locally first

---

## Performance Optimization

### Frontend
- Enable Gzip compression in nginx
- Use CDN for static assets
- Optimize images before upload
- Enable browser caching

### Backend
- Enable rate limiting (already configured)
- Use connection pooling for database
- Implement caching where appropriate
- Monitor API response times

---

## Security Best Practices

- [ ] Use HTTPS everywhere
- [ ] Keep dependencies updated
- [ ] Regularly rotate API keys
- [ ] Monitor for suspicious activity
- [ ] Backup database regularly
- [ ] Use strong admin passwords
- [ ] Enable 2FA for Supabase
- [ ] Review RLS policies regularly
- [ ] Keep service role key secret
- [ ] Implement rate limiting
- [ ] Sanitize user inputs
- [ ] Use environment variables for secrets

---

## Support

For deployment help:
- Check logs first
- Review documentation
- Contact your hosting provider support
- Check Supabase status page

---

**Good luck with your deployment! 🚀**
