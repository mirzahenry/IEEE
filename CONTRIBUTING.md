# Contributing to GRSS Website

Thank you for your interest in contributing to the Geosciences and Remote Sensing Society website! This document will help you get started.

---

## 🚀 Quick Start for Developers

### Prerequisites
- Node.js 18+ installed
- Git installed
- Code editor (VS Code recommended)
- Basic knowledge of React, Node.js, and SQL

### Setup (First Time)
1. Clone the repository
2. Run `npm install`
3. Follow `SETUP_GUIDE.md` to configure Supabase
4. Copy `.env.example` to `.env` and add your credentials
5. Run `npm run dev`

---

## 📂 Project Structure Overview

```
frontend/src/
├── components/     # Reusable UI components
├── pages/         # Page-level components
├── context/       # React Context providers
├── utils/         # Helper functions
├── config/        # Configuration files
└── App.jsx        # Main app with routing

backend/
├── config/        # Server configuration
├── routes/        # API route handlers
└── server.js      # Express server entry point

database/
├── schema.sql           # Database tables and policies
├── storage-buckets.sql  # File storage configuration
└── seed-data.sql        # Sample data
```

---

## 🎨 Code Style Guide

### React Components

**File naming:** PascalCase for components (e.g., `EventCard.jsx`)

**Component structure:**
```jsx
import { useState } from 'react';

const ComponentName = ({ prop1, prop2 }) => {
  const [state, setState] = useState();

  // Event handlers
  const handleClick = () => {
    // logic
  };

  // Early returns for loading/error states
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState />;

  return (
    <div className="container">
      {/* JSX */}
    </div>
  );
};

export default ComponentName;
```

### Styling with Tailwind

**Use utility classes:**
```jsx
<div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg">
```

**Custom classes in index.css:**
```css
.btn-primary {
  @apply bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg;
}
```

### Database Queries

**Use Supabase client:**
```javascript
const { data, error } = await supabase
  .from('events')
  .select('*')
  .eq('status', 'upcoming')
  .order('event_date', { ascending: true });
```

**Always handle errors:**
```javascript
try {
  const { data, error } = await supabase.from('table').select();
  if (error) throw error;
  return data;
} catch (error) {
  console.error('Error:', error);
  toast.error('Failed to fetch data');
}
```

---

## 🔧 Development Workflow

### 1. Create a Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

### 2. Make Changes
- Write clean, readable code
- Follow the existing code style
- Add comments for complex logic
- Test your changes thoroughly

### 3. Test Locally
```bash
npm run dev
```

Test:
- ✅ Functionality works as expected
- ✅ No console errors
- ✅ Responsive on mobile
- ✅ Dark mode looks good
- ✅ Forms validate properly
- ✅ Images load correctly

### 4. Commit Changes
```bash
git add .
git commit -m "feat: add event registration form"
# or
git commit -m "fix: resolve navbar mobile menu issue"
```

**Commit message format:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

### 5. Push and Create PR
```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

---

## 📝 Adding New Features

### Adding a New Page

1. **Create page component:**
```jsx
// frontend/src/pages/NewPage.jsx
const NewPage = () => {
  return (
    <div className="min-h-screen pt-20">
      <div className="container-custom section">
        <h1 className="heading-lg mb-6">Page Title</h1>
        {/* Content */}
      </div>
    </div>
  );
};

export default NewPage;
```

2. **Add route in App.jsx:**
```jsx
<Route path="/new-page" element={<NewPage />} />
```

3. **Add to navigation (if needed):**
```jsx
// In Navbar.jsx
const navLinks = [
  // ... existing links
  { path: '/new-page', label: 'New Page' },
];
```

### Adding a New Database Table

1. **Create migration SQL:**
```sql
-- database/migrations/add_new_table.sql
CREATE TABLE new_table (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE new_table ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON new_table FOR SELECT USING (true);
```

2. **Run in Supabase SQL Editor**

3. **Create service functions:**
```javascript
// frontend/src/services/newTableService.js
export const fetchItems = async () => {
  const { data, error } = await supabase
    .from('new_table')
    .select('*');
  
  if (error) throw error;
  return data;
};
```

### Adding a New API Endpoint

1. **Create route file:**
```javascript
// backend/routes/newroute.js
import express from 'express';
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Logic here
    res.json({ success: true, data: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

2. **Add to server.js:**
```javascript
import newRoute from './routes/newroute.js';
app.use('/api/newroute', newRoute);
```

---

## 🧪 Testing Checklist

Before submitting your PR:

### Functional Testing
- [ ] Feature works as expected
- [ ] All buttons and links work
- [ ] Forms submit successfully
- [ ] Data saves to database
- [ ] Error handling works

### UI/UX Testing
- [ ] Layout looks good on desktop
- [ ] Layout looks good on tablet
- [ ] Layout looks good on mobile
- [ ] Dark mode works correctly
- [ ] Colors are consistent
- [ ] Typography is readable
- [ ] Spacing is consistent

### Performance
- [ ] No console errors
- [ ] No console warnings
- [ ] Images are optimized
- [ ] Page loads quickly
- [ ] Animations are smooth

### Accessibility
- [ ] Keyboard navigation works
- [ ] Focus states are visible
- [ ] Alt text on images
- [ ] Color contrast is sufficient
- [ ] Screen reader friendly

---

## 🐛 Bug Reports

When reporting bugs, include:

1. **Description:** What happened?
2. **Expected behavior:** What should happen?
3. **Steps to reproduce:**
   - Step 1
   - Step 2
   - Step 3
4. **Screenshots:** If applicable
5. **Environment:**
   - Browser: Chrome 120
   - OS: Windows 11
   - Screen size: 1920x1080

---

## 💡 Feature Requests

When suggesting features:

1. **Problem:** What problem does this solve?
2. **Solution:** How should it work?
3. **Alternatives:** Other ways to solve it?
4. **Additional context:** Mockups, examples, etc.

---

## 🔐 Security

If you discover a security vulnerability:

1. **DO NOT** open a public issue
2. Email the team lead directly
3. Describe the vulnerability
4. Wait for response before disclosure

---

## 📚 Resources

### Learn More
- [React Documentation](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Supabase Docs](https://supabase.com/docs)
- [Express.js Guide](https://expressjs.com)

### Tools We Use
- **VS Code** - Code editor
- **Chrome DevTools** - Debugging
- **Postman** - API testing
- **Figma** - Design (if applicable)

### VS Code Extensions (Recommended)
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Prettier - Code formatter
- ESLint

---

## 🎯 Current Priorities

Check `PROJECT_STATUS.md` for:
- Current progress
- Next tasks
- Priority features

---

## 🤝 Code Review Process

1. **Submit PR** with clear description
2. **Wait for review** from maintainers
3. **Address feedback** if requested
4. **PR approved** and merged
5. **Celebrate!** 🎉

---

## 📞 Communication

- **GitHub Issues:** For bugs and features
- **Pull Requests:** For code contributions
- **Email:** For security issues
- **Team Meetings:** Weekly updates

---

## 🙏 Thank You!

Every contribution, no matter how small, helps make this project better. We appreciate your time and effort!

---

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Happy Coding! 🚀**
