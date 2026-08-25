import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TelemetryBar } from './components/layout/TelemetryBar';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { AuthProvider } from './lib/auth';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { AboutPage } from './pages/public/AboutPage';
import { ServicesPage } from './pages/public/ServicesPage';
import { GalleryPage } from './pages/public/GalleryPage';
import { ContactPage } from './pages/public/ContactPage';
import { ConfiguratorPage } from './pages/public/ConfiguratorPage';

// Hidden Staff Consoles (Direct URL Only)
import { SalesLoginPage } from './pages/sales/SalesLoginPage';
import { SalesDashboardPage } from './pages/sales/SalesDashboardPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';

// Layout Wrapper for Public Marketing Pages
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-[var(--bg-canvas)] text-[var(--text-primary)] transition-colors">
    <TelemetryBar />
    <Header />
    <main className="flex-1">
      {children}
    </main>
    <Footer />
  </div>
);

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
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
      </Router>
    </AuthProvider>
  );
};

export default App;
