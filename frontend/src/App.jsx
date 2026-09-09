import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';

// ── Public pages (lazy) ────────────────────────────────────
const Home               = lazy(() => import('./pages/Home'));
const About              = lazy(() => import('./pages/About'));
const Contact            = lazy(() => import('./pages/Contact'));
const ExCom              = lazy(() => import('./pages/ExCom'));
const Events             = lazy(() => import('./pages/Events'));
const EventDetail        = lazy(() => import('./pages/EventDetail'));
const Achievements       = lazy(() => import('./pages/Achievements'));
const Projects           = lazy(() => import('./pages/Projects'));
const ProjectDetail      = lazy(() => import('./pages/ProjectDetail'));
const Gallery            = lazy(() => import('./pages/Gallery'));
const GalleryAlbum       = lazy(() => import('./pages/GalleryAlbum'));
const Resources          = lazy(() => import('./pages/Resources'));
const ResourceDetail     = lazy(() => import('./pages/ResourceDetail'));
const Announcements      = lazy(() => import('./pages/Announcements'));
const AnnouncementDetail = lazy(() => import('./pages/AnnouncementDetail'));
const Search             = lazy(() => import('./pages/Search'));
const JoinUs                = lazy(() => import('./pages/JoinUs'));
const NotFound           = lazy(() => import('./pages/NotFound'));

// ── Auth (lazy) ────────────────────────────────────────────
const AdminLogin         = lazy(() => import('./pages/auth/AdminLogin'));

// ── Admin pages (lazy) ────────────────────────────────────
const AdminDashboard        = lazy(() => import('./pages/admin/Dashboard'));
const AdminEvents           = lazy(() => import('./pages/admin/Events'));
const AdminEventForm        = lazy(() => import('./pages/admin/EventForm'));
const AdminRegistrations    = lazy(() => import('./pages/admin/Registrations'));
const AdminExCom            = lazy(() => import('./pages/admin/ExCom'));
const AdminExComForm        = lazy(() => import('./pages/admin/ExComForm'));
const AdminAnnouncements    = lazy(() => import('./pages/admin/Announcements'));
const AdminAnnouncementForm = lazy(() => import('./pages/admin/AnnouncementForm'));
const AdminAchievements     = lazy(() => import('./pages/admin/Achievements'));
const AdminAchievementForm  = lazy(() => import('./pages/admin/AchievementForm'));
const AdminProjects         = lazy(() => import('./pages/admin/Projects'));
const AdminProjectForm      = lazy(() => import('./pages/admin/ProjectForm'));
const AdminGallery          = lazy(() => import('./pages/admin/Gallery'));
const AdminGalleryForm      = lazy(() => import('./pages/admin/GalleryForm'));
const AdminResources        = lazy(() => import('./pages/admin/Resources'));
const AdminResourceForm     = lazy(() => import('./pages/admin/ResourceForm'));
const AdminContactMessages  = lazy(() => import('./pages/admin/ContactMessages'));
const AdminJoinApplications = lazy(() => import('./pages/admin/JoinApplications'));
const AdminSettings         = lazy(() => import('./pages/admin/Settings'));

// ── Shared spinner ─────────────────────────────────────────
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
    <div className="w-10 h-10 border-4 border-gray-200 dark:border-gray-700 border-t-primary-600 rounded-full animate-spin" />
  </div>
);

// ── Public layout wrapper ──────────────────────────────────
function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <Suspense fallback={<PageLoader />}>{children}</Suspense>
      </main>
      <Footer />
    </>
  );
}

// ── Admin route list (keeps JSX clean) ────────────────────
const ADMIN_ROUTES = [
  { path: '/admin/events',                  el: <AdminEvents /> },
  { path: '/admin/events/new',              el: <AdminEventForm /> },
  { path: '/admin/events/edit/:id',         el: <AdminEventForm /> },
  { path: '/admin/registrations',           el: <AdminRegistrations /> },
  { path: '/admin/excom',                   el: <AdminExCom /> },
  { path: '/admin/excom/new',               el: <AdminExComForm /> },
  { path: '/admin/excom/edit/:id',          el: <AdminExComForm /> },
  { path: '/admin/announcements',           el: <AdminAnnouncements /> },
  { path: '/admin/announcements/new',       el: <AdminAnnouncementForm /> },
  { path: '/admin/announcements/edit/:id',  el: <AdminAnnouncementForm /> },
  { path: '/admin/achievements',            el: <AdminAchievements /> },
  { path: '/admin/achievements/new',        el: <AdminAchievementForm /> },
  { path: '/admin/achievements/edit/:id',   el: <AdminAchievementForm /> },
  { path: '/admin/projects',               el: <AdminProjects /> },
  { path: '/admin/projects/new',           el: <AdminProjectForm /> },
  { path: '/admin/projects/edit/:id',      el: <AdminProjectForm /> },
  { path: '/admin/gallery',               el: <AdminGallery /> },
  { path: '/admin/gallery/new',           el: <AdminGalleryForm /> },
  { path: '/admin/gallery/edit/:id',      el: <AdminGalleryForm /> },
  { path: '/admin/resources',             el: <AdminResources /> },
  { path: '/admin/resources/new',         el: <AdminResourceForm /> },
  { path: '/admin/resources/edit/:id',    el: <AdminResourceForm /> },
  { path: '/admin/messages',              el: <AdminContactMessages /> },
  { path: '/admin/join-applications',    el: <AdminJoinApplications /> },
  { path: '/admin/settings',             el: <AdminSettings /> },
];

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-200">
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3500,
                style: { borderRadius: '10px', fontSize: '14px' },
                success: { iconTheme: { primary: '#0052cc', secondary: '#fff' } },
              }}
            />

            <Routes>
              {/* ── Public ── */}
              <Route path="/"                   element={<PublicLayout><Home /></PublicLayout>} />
              <Route path="/about"              element={<PublicLayout><About /></PublicLayout>} />
              <Route path="/contact"            element={<PublicLayout><Contact /></PublicLayout>} />
              <Route path="/excom"              element={<PublicLayout><ExCom /></PublicLayout>} />
              <Route path="/events"             element={<PublicLayout><Events /></PublicLayout>} />
              <Route path="/events/:slug"       element={<PublicLayout><EventDetail /></PublicLayout>} />
              <Route path="/achievements"       element={<PublicLayout><Achievements /></PublicLayout>} />
              <Route path="/projects"           element={<PublicLayout><Projects /></PublicLayout>} />
              <Route path="/projects/:slug"     element={<PublicLayout><ProjectDetail /></PublicLayout>} />
              <Route path="/gallery"            element={<PublicLayout><Gallery /></PublicLayout>} />
              <Route path="/gallery/:slug"      element={<PublicLayout><GalleryAlbum /></PublicLayout>} />
              <Route path="/resources"          element={<PublicLayout><Resources /></PublicLayout>} />
              <Route path="/resources/:slug"    element={<PublicLayout><ResourceDetail /></PublicLayout>} />
              <Route path="/announcements"      element={<PublicLayout><Announcements /></PublicLayout>} />
              <Route path="/announcements/:slug"element={<PublicLayout><AnnouncementDetail /></PublicLayout>} />
              <Route path="/search"             element={<PublicLayout><Search /></PublicLayout>} />
              <Route path="/join"              element={<PublicLayout><JoinUs /></PublicLayout>} />

              {/* ── Auth ── */}
              <Route path="/admin/login" element={
                <Suspense fallback={<PageLoader />}><AdminLogin /></Suspense>
              } />

              {/* ── Admin dashboard ── */}
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Suspense fallback={<PageLoader />}><AdminDashboard /></Suspense>
                  </AdminLayout>
                </ProtectedRoute>
              } />

              {/* ── Admin sub-routes ── */}
              {ADMIN_ROUTES.map(({ path, el }) => (
                <Route key={path} path={path} element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <Suspense fallback={<PageLoader />}>{el}</Suspense>
                    </AdminLayout>
                  </ProtectedRoute>
                } />
              ))}

              {/* ── 404 ── */}
              <Route path="*" element={
                <PublicLayout>
                  <Suspense fallback={<PageLoader />}><NotFound /></Suspense>
                </PublicLayout>
              } />
            </Routes>
          </div>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
