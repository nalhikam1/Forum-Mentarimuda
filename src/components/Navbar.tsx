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
  User as UserIcon
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

  return (
    <header className="sticky top-0 z-40 bg-[#F6F4F0]/90 backdrop-blur-md border-b border-amber-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar 3-Zone Contract: [Brand Wordmark] - [4-5 Links] - [Actions] */}
        <div className="flex items-center justify-between gap-8 h-18">
          {/* Zone 1: Brand Wordmark (Single text element wordmark) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('')}
              className="flex items-center gap-2.5 text-left group transition-transform"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-md border-2 border-white group-hover:rotate-6 transition-transform">
                <SunMedium className="w-6 h-6 text-white" />
              </div>
              <div className="whitespace-nowrap shrink-0">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 font-display">
                  Mentari<span className="text-amber-600">Muda</span>
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: 4-5 Clean single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-600">
            <button
              onClick={() => onNavigate('')}
              className={`hover:text-amber-600 transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentPath === '' || currentPath === 'forum' ? 'text-amber-600 font-bold border-b-2 border-amber-500' : ''
              }`}
            >
              Beranda
            </button>
            <button
              onClick={() => onNavigate('kategori')}
              className={`hover:text-amber-600 transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentPath.startsWith('kategori') ? 'text-amber-600 font-bold border-b-2 border-amber-500' : ''
              }`}
            >
              Kategori
            </button>
            <button
              onClick={() => onNavigate('tanya-jawab')}
              className={`hover:text-amber-600 transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentPath === 'tanya-jawab' ? 'text-amber-600 font-bold border-b-2 border-amber-500' : ''
              }`}
            >
              Tanya Jawab
            </button>
            <button
              onClick={() => onNavigate('polling')}
              className={`hover:text-amber-600 transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentPath === 'polling' ? 'text-amber-600 font-bold border-b-2 border-amber-500' : ''
              }`}
            >
              Polling
            </button>
            <button
              onClick={() => onNavigate('analitik')}
              className={`hover:text-amber-600 transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentPath === 'analitik' ? 'text-amber-600 font-bold border-b-2 border-amber-500' : ''
              }`}
            >
              Analitik Komunitas
            </button>
            {(currentUser.role === 'admin' || currentUser.role === 'moderator') && (
              <button
                onClick={() => onNavigate('admin')}
                className={`hover:text-red-600 transition-colors whitespace-nowrap shrink-0 py-1 flex items-center gap-1.5 ${
                  currentPath === 'admin' ? 'text-red-600 font-bold border-b-2 border-red-500' : 'text-slate-500'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-red-500" />
                <span>Admin Panel</span>
              </button>
            )}
          </nav>

          {/* Zone 3: Interactive Affordances & Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Quick Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2.5 rounded-xl text-slate-600 hover:text-slate-900 clay-btn-secondary"
              title="Cari diskusi"
              aria-label="Cari diskusi"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Notification Bell with Badge */}
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

            {/* Current User Pill / Switcher */}
            <div
              onClick={onOpenAuth}
              className="hidden sm:flex items-center gap-2 p-1.5 pr-3 rounded-2xl bg-white border border-slate-200 shadow-xs cursor-pointer hover:border-amber-300 transition-colors"
              title="Ganti akun atau edit profil"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.displayName}
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-xl bg-amber-50 object-cover shadow-2xs"
              />
              <div className="text-left leading-none max-w-[100px] truncate">
                <span className="text-xs font-bold text-slate-800 block truncate">
                  {currentUser.displayName}
                </span>
                <span className="text-[10px] text-slate-400 capitalize">
                  {currentUser.role}
                </span>
              </div>
            </div>

            {/* Primary Action Button: Buat Topik */}
            <button
              onClick={() => onNavigate('buat-topik')}
              className="clay-btn-primary px-4 py-2.5 text-xs md:text-sm font-bold flex items-center gap-2 whitespace-nowrap shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden xs:inline">Buat Topik</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 clay-btn-secondary"
              aria-label="Menu navigasi"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search Bar Drawer (Expands cleanly below top bar) */}
        {isSearchOpen && (
          <form onSubmit={handleSearchSubmit} className="py-3 pb-4 animate-fade-in">
            <div className="relative max-w-xl mx-auto">
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari topik diskusi, pertanyaan, polling, atau tag..."
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

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200/80 space-y-2 animate-fade-in">
            <button
              onClick={() => {
                onNavigate('');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-xl font-semibold text-sm text-slate-700 hover:bg-white"
            >
              Beranda Forum
            </button>
            <button
              onClick={() => {
                onNavigate('kategori');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-xl font-semibold text-sm text-slate-700 hover:bg-white"
            >
              Semua Kategori
            </button>
            <button
              onClick={() => {
                onNavigate('tanya-jawab');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-xl font-semibold text-sm text-slate-700 hover:bg-white"
            >
              Tanya Jawab (Q&A)
            </button>
            <button
              onClick={() => {
                onNavigate('polling');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-xl font-semibold text-sm text-slate-700 hover:bg-white"
            >
              Polling Interaktif
            </button>
            <button
              onClick={() => {
                onNavigate('analitik');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-xl font-semibold text-sm text-slate-700 hover:bg-white"
            >
              Dashboard Analitik
            </button>
            {(currentUser.role === 'admin' || currentUser.role === 'moderator') && (
              <button
                onClick={() => {
                  onNavigate('admin');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl font-bold text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Panel Dashboard</span>
              </button>
            )}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => {
                  onNavigate(`u/${currentUser.username}`);
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 text-sm font-bold text-slate-800"
              >
                <UserIcon className="w-4 h-4 text-amber-500" />
                <span>Profil Saya (@{currentUser.username})</span>
              </button>
              <button
                onClick={() => {
                  onOpenAuth();
                  setIsMobileMenuOpen(false);
                }}
                className="text-xs font-semibold text-amber-600 underline"
              >
                Ganti Akun / Tamu
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
