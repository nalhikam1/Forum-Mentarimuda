import React, { useState, useEffect } from 'react';
import { storageService, subscribeToStateChange } from '../services/storage';
import { 
  Bell, 
  PlusCircle, 
  Search, 
  ShieldCheck, 
  Menu, 
  X, 
  SunMedium,
  Home,
  Compass,
  BarChart3,
  User as UserIcon,
  LogOut
} from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenNotifications: () => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  onNavigate,
  onOpenNotifications,
  onOpenAuth,
}) => {
  const [currentUser, setCurrentUser] = useState(storageService.getCurrentUser());
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const refreshUserData = () => {
    const user = storageService.getCurrentUser();
    setCurrentUser(user);
    const notifs = storageService.getNotifications(user.id);
    setUnreadCount(notifs.filter(n => !n.read).length);
  };

  useEffect(() => {
    refreshUserData();
    const unsub = subscribeToStateChange(() => {
      refreshUserData();
    });
    return () => unsub();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate(`cari?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const isAdmin = currentUser.role === 'admin';

  return (
    <header className="sticky top-0 z-40 bg-[#F6F4F0]/95 backdrop-blur-md border-b border-amber-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 md:gap-8 h-18">
          {/* Zone 1: Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('')}
              className="flex items-center gap-2.5 text-left group transition-transform"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-md border-2 border-white group-hover:rotate-6 transition-transform">
                <SunMedium className="w-6 h-6 text-white" />
              </div>
              <div className="whitespace-nowrap shrink-0">
                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                  Mentari<span className="text-amber-600">Muda</span>
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Icon-driven Clean Navigation */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {/* Beranda (Home) */}
            <button
              onClick={() => onNavigate('')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                currentPath === '' || currentPath === 'forum'
                  ? 'bg-white text-amber-600 shadow-sm border border-amber-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Home className="w-4 h-4 text-amber-500" />
              <span>Beranda</span>
            </button>

            {/* Kategori */}
            <button
              onClick={() => onNavigate('kategori')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                currentPath.startsWith('kategori')
                  ? 'bg-white text-amber-600 shadow-sm border border-amber-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Compass className="w-4 h-4 text-emerald-500" />
              <span>Kategori</span>
            </button>

            {/* Analitik — KHUSUS ADMIN SAJA */}
            {isAdmin && (
              <button
                onClick={() => onNavigate('analitik')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  currentPath === 'analitik'
                    ? 'bg-white text-purple-700 shadow-sm border border-purple-200'
                    : 'text-purple-700/80 hover:text-purple-900 hover:bg-purple-50'
                }`}
                title="Khusus Administrator: Pantau analitik komunitas"
              >
                <BarChart3 className="w-4 h-4 text-purple-600" />
                <span>Analitik</span>
                <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.2 rounded-md font-extrabold">
                  Admin
                </span>
              </button>
            )}

            {/* Admin Panel — KHUSUS ADMIN SAJA */}
            {isAdmin && (
              <button
                onClick={() => onNavigate('admin')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  currentPath === 'admin'
                    ? 'bg-white text-rose-700 shadow-sm border border-rose-200'
                    : 'text-rose-700/80 hover:text-rose-900 hover:bg-rose-50'
                }`}
                title="Khusus Administrator: Pusat kendali moderasi"
              >
                <ShieldCheck className="w-4 h-4 text-rose-600" />
                <span>Panel</span>
                <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded-md font-extrabold">
                  Admin
                </span>
              </button>
            )}
          </nav>

          {/* Zone 3: Interactive Affordances & User Status */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Quick Search */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2.5 rounded-xl text-slate-600 hover:text-slate-900 clay-btn-secondary"
              title="Cari diskusi"
              aria-label="Cari diskusi"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Push Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2.5 rounded-xl text-slate-600 hover:text-amber-600 clay-btn-secondary"
              title="Push Notifikasi"
              aria-label="Push Notifikasi"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-extrabold flex items-center justify-center shadow-md animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* User Identity Capsule with Clear Role Separation */}
            {currentUser.role === 'guest' ? (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-amber-400 hover:bg-amber-50/50 transition-colors"
                title="Status Tamu (Belum Login). Klik untuk Masuk atau Daftar."
              >
                <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                  <UserIcon className="w-3.5 h-3.5" />
                </div>
                <div className="text-left leading-none">
                  <span className="text-xs font-bold text-slate-700 block">Tamu</span>
                  <span className="text-[10px] text-amber-600 font-semibold">Masuk / Daftar</span>
                </div>
              </button>
            ) : (
              <div
                onClick={onOpenAuth}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-2xl bg-white border border-slate-200 shadow-xs cursor-pointer hover:border-amber-400 transition-colors"
                title={`Login sebagai: ${currentUser.displayName} (${currentUser.role}). Klik untuk ganti akun.`}
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.displayName}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-xl bg-amber-50 object-cover shadow-2xs"
                />
                <div className="hidden sm:block text-left leading-none max-w-[110px]">
                  <span className="text-xs font-bold text-slate-800 block truncate">
                    {currentUser.displayName}
                  </span>
                  <span className={`text-[10px] font-bold ${
                    isAdmin ? 'text-rose-600' : 'text-emerald-600'
                  }`}>
                    {isAdmin ? 'Admin' : 'Member'}
                  </span>
                </div>
              </div>
            )}

            {/* Primary Action Button: Buat Topik */}
            <button
              onClick={() => onNavigate('buat-topik')}
              className="clay-btn-primary px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-sm"
              title="Buat Topik Baru"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden xs:inline">Topik Baru</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 clay-btn-secondary"
              aria-label="Menu navigasi"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search Bar Drawer */}
        {isSearchOpen && (
          <form onSubmit={handleSearchSubmit} className="py-3 pb-4 animate-fade-in">
            <div className="relative max-w-xl mx-auto">
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari topik, pertanyaan, polling, atau tag..."
                className="w-full pl-10 pr-24 py-2.5 rounded-2xl border-2 border-amber-300 bg-white text-sm text-slate-800 shadow-md focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <button
                type="submit"
                className="absolute right-2 top-1.5 clay-btn-primary px-3 py-1.5 text-xs font-bold"
              >
                Cari
              </button>
            </div>
          </form>
        )}

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200/80 space-y-2 animate-fade-in">
            <button
              onClick={() => { onNavigate(''); setIsMobileMenuOpen(false); }}
              className="w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-sm text-slate-800 hover:bg-white flex items-center gap-2.5"
            >
              <Home className="w-4 h-4 text-amber-500" />
              <span>Beranda</span>
            </button>

            <button
              onClick={() => { onNavigate('kategori'); setIsMobileMenuOpen(false); }}
              className="w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-sm text-slate-800 hover:bg-white flex items-center gap-2.5"
            >
              <Compass className="w-4 h-4 text-emerald-500" />
              <span>Kategori</span>
            </button>

            {isAdmin && (
              <>
                <button
                  onClick={() => { onNavigate('analitik'); setIsMobileMenuOpen(false); }}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-sm text-purple-700 hover:bg-purple-50 flex items-center gap-2.5"
                >
                  <BarChart3 className="w-4 h-4 text-purple-600" />
                  <span>Dashboard Analitik (Admin)</span>
                </button>

                <button
                  onClick={() => { onNavigate('admin'); setIsMobileMenuOpen(false); }}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-sm text-rose-700 hover:bg-rose-50 flex items-center gap-2.5"
                >
                  <ShieldCheck className="w-4 h-4 text-rose-600" />
                  <span>Admin Panel Moderasi</span>
                </button>
              </>
            )}

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between px-2">
              <button
                onClick={() => { onNavigate(`u/${currentUser.username}`); setIsMobileMenuOpen(false); }}
                className="flex items-center gap-2 text-xs font-bold text-slate-800"
              >
                <UserIcon className="w-4 h-4 text-amber-500" />
                <span>Profil (@{currentUser.username})</span>
              </button>

              <button
                onClick={() => { onOpenAuth(); setIsMobileMenuOpen(false); }}
                className="text-xs font-bold text-amber-600 underline"
              >
                Ganti Akun
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
