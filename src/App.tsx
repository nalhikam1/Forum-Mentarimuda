import React, { useState, useEffect } from 'react';
import { storageService } from './services/storage';
import { initSoundPreference } from './utils/audio';
import { Navbar } from './components/Navbar';
import { NotificationToast } from './components/NotificationToast';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { AuthModal } from './components/AuthModal';

// Pages
import { HomePage } from './pages/HomePage';
import { PostDetailPage } from './pages/PostDetailPage';
import { CategoryPage } from './pages/CategoryPage';
import { CreatePostPage } from './pages/CreatePostPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AnalyticsPage } from './pages/AnalyticsPage';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>('');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Initialize storage & sound preferences on mount
  useEffect(() => {
    storageService.init();
    initSoundPreference();

    const parseHash = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      setCurrentPath(hash);
    };

    parseHash();
    window.addEventListener('hashchange', parseHash);
    window.addEventListener('popstate', parseHash);

    return () => {
      window.removeEventListener('hashchange', parseHash);
      window.removeEventListener('popstate', parseHash);
    };
  }, []);

  const navigateTo = (path: string) => {
    const cleanPath = path.replace(/^\//, '');
    window.location.hash = `/${cleanPath}`;
    setCurrentPath(cleanPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Route resolver based on slug URL path
  const renderContent = () => {
    // 1. Post Detail: diskusi/:slug
    if (currentPath.startsWith('diskusi/')) {
      const slug = currentPath.replace('diskusi/', '');
      return (
        <PostDetailPage
          slug={slug}
          onNavigate={navigateTo}
          onOpenAuth={() => setIsAuthOpen(true)}
        />
      );
    }

    // 2. Category List: kategori
    if (currentPath === 'kategori') {
      return <CategoryPage onNavigate={navigateTo} />;
    }

    // 3. Category Detail Filter: kategori/:slug
    if (currentPath.startsWith('kategori/')) {
      const categorySlug = currentPath.replace('kategori/', '');
      return (
        <HomePage
          onNavigate={navigateTo}
          selectedCategorySlug={categorySlug}
        />
      );
    }

    // 4. Create Post: buat-topik
    if (currentPath === 'buat-topik') {
      return (
        <CreatePostPage
          onNavigate={navigateTo}
          onOpenAuth={() => setIsAuthOpen(true)}
        />
      );
    }

    // 5. User Profile: u/:username
    if (currentPath.startsWith('u/')) {
      const username = currentPath.replace('u/', '');
      return (
        <ProfilePage
          username={username}
          onNavigate={navigateTo}
        />
      );
    }

    // 6. Admin Panel: admin
    if (currentPath === 'admin') {
      return <AdminDashboardPage onNavigate={navigateTo} />;
    }

    // 7. Analytics: analitik
    if (currentPath === 'analitik') {
      return <AnalyticsPage onNavigate={navigateTo} />;
    }

    // 8. Filter shortcuts: tanya-jawab
    if (currentPath === 'tanya-jawab') {
      return (
        <HomePage
          onNavigate={navigateTo}
          searchFilter=""
        />
      );
    }

    // 9. Filter shortcuts: polling
    if (currentPath === 'polling') {
      return (
        <HomePage
          onNavigate={navigateTo}
          searchFilter=""
        />
      );
    }

    // 10. Search results: cari?q=...
    if (currentPath.startsWith('cari')) {
      const match = currentPath.match(/q=([^&]*)/);
      const query = match ? decodeURIComponent(match[1]) : '';
      return (
        <HomePage
          onNavigate={navigateTo}
          searchFilter={query}
        />
      );
    }

    // Default: Home Page Feed
    return <HomePage onNavigate={navigateTo} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F4F0] text-slate-900 selection:bg-amber-200 selection:text-amber-900">
      {/* Top Bar Navigation */}
      <Navbar
        currentPath={currentPath}
        onNavigate={navigateTo}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Main Viewport Content */}
      <main className="flex-1">
        {renderContent()}
      </main>

      {/* Footer (Quiet anti-slop design) */}
      <footer className="mt-16 border-t border-slate-200/80 bg-white/50 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800 text-sm">MentariMuda Forum</span>
            <span>·</span>
            <span>Komunitas Pemuda Indonesia</span>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <button onClick={() => navigateTo('')} className="hover:text-slate-800">Beranda</button>
            <button onClick={() => navigateTo('kategori')} className="hover:text-slate-800">Kategori</button>
            {storageService.getCurrentUser().role === 'admin' && (
              <>
                <button onClick={() => navigateTo('analitik')} className="text-purple-700 hover:text-purple-900 font-semibold">Analitik (Admin)</button>
                <button onClick={() => navigateTo('admin')} className="text-rose-700 hover:text-rose-900 font-semibold">Admin Panel</button>
              </>
            )}
            <button onClick={() => setIsAuthOpen(true)} className="hover:text-amber-600 font-semibold">Akun / Tamu</button>
          </div>

          <div className="text-slate-400">
            © {new Date().getFullYear()} Mentarimuda. Desain Claymorphism Kotak-Kotak.
          </div>
        </div>
      </footer>

      {/* Floating Push Notification Toast */}
      <NotificationToast onNavigate={navigateTo} />

      {/* Notification Center Modal Drawer */}
      <NotificationCenterModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onNavigate={navigateTo}
      />

      {/* Auth & Switch Account Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </div>
  );
}
