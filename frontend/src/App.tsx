import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TelemetryBar } from './components/layout/TelemetryBar';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { PageLoader } from './components/layout/PageLoader';
import { Toaster } from './components/ui/sonner';
import { AuthProvider } from './lib/auth';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// Lazy-Loaded Public Pages
const HomePage = lazy(() => import('./pages/public/HomePage').then(m => ({ default: m.HomePage })));
const AboutPage = lazy(() => import('./pages/public/AboutPage').then(m => ({ default: m.AboutPage })));
const ServicesPage = lazy(() => import('./pages/public/ServicesPage').then(m => ({ default: m.ServicesPage })));
const GalleryPage = lazy(() => import('./pages/public/GalleryPage').then(m => ({ default: m.GalleryPage })));
const ContactPage = lazy(() => import('./pages/public/ContactPage').then(m => ({ default: m.ContactPage })));
const ConfiguratorPage = lazy(() => import('./pages/public/ConfiguratorPage').then(m => ({ default: m.ConfiguratorPage })));

// Lazy-Loaded Staff & Admin Consoles
const SalesLoginPage = lazy(() => import('./pages/sales/SalesLoginPage').then(m => ({ default: m.SalesLoginPage })));
const SalesDashboardPage = lazy(() => import('./pages/sales/SalesDashboardPage').then(m => ({ default: m.SalesDashboardPage })));
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage').then(m => ({ default: m.AdminLoginPage })));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));

// Layout Wrapper for Public Marketing Pages
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-[var(--bg-canvas)] text-[var(--text-primary)] transition-colors">
    <TelemetryBar />
    <Header />
    <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
      {children}
    </main>
    <Footer />
  </div>
);

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Toaster position="top-right" closeButton richColors />
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Website Routes */}
            <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
            <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
            <Route path="/services" element={<PublicLayout><ServicesPage /></PublicLayout>} />
            <Route path="/gallery" element={<PublicLayout><GalleryPage /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
            <Route path="/configurator" element={<PublicLayout><ConfiguratorPage /></PublicLayout>} />

            {/* Hidden Sales Console (Protected by Role Guard) */}
            <Route path="/sales/login" element={<SalesLoginPage />} />
            <Route 
              path="/sales" 
              element={
                <ProtectedRoute allowedRoles={['sales', 'admin']}>
                  <SalesDashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/sales/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['sales', 'admin']}>
                  <SalesDashboardPage />
                </ProtectedRoute>
              } 
            />

            {/* Hidden Executive Management Hub (Protected by Admin-Only Role Guard) */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              } 
            />

            {/* Catch-all Fallback */}
            <Route path="*" element={<PublicLayout><HomePage /></PublicLayout>} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
};

export default App;
