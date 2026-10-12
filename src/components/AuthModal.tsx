import React, { useState } from 'react';
import { User, UserRole } from '../types/forum';
import { storageService } from '../services/storage';
import { UserCheck, Sparkles, UserPlus, Shield, X, Smile, Check } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'switch' | 'register' | 'guest'>('switch');
  const [users, setUsers] = useState<User[]>(storageService.getUsers());
  const currentUser = storageService.getCurrentUser();

  // Register Form State
  const [regDisplayName, setRegDisplayName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regBio, setRegBio] = useState('Semangat belajar dan bertukar wawasan di Mentarimuda.');
  const [regRole, setRegRole] = useState<UserRole>('member');
  const [avatarSeed, setAvatarSeed] = useState('pemuda_' + Math.floor(Math.random() * 900 + 100));

  // Guest Customization State
  const [guestName, setGuestName] = useState('Tamu Mentari #' + Math.floor(Math.random() * 900 + 100));

  if (!isOpen) return null;

  const handleSelectUser = (userId: string) => {
    storageService.setCurrentUser(userId);
    onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regDisplayName.trim() || !regUsername.trim()) return;

    const newUser = storageService.createUser({
      displayName: regDisplayName.trim(),
      username: regUsername.trim().toLowerCase().replace(/\s+/g, '_'),
      bio: regBio.trim(),
      role: regRole,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${avatarSeed}&backgroundColor=b6e3f4,ffd5dc,d1d4f9`,
      badges: ['Anggota Baru', regRole === 'moderator' ? 'Moderator' : 'Pionir Komunitas'],
    });

    setUsers(storageService.getUsers());
    storageService.setCurrentUser(newUser.id);
    onClose();
  };

  const handleContinueAsGuest = () => {
    // Check if guest user exists or create customized guest
    const existingGuest = users.find(u => u.role === 'guest');
    if (existingGuest) {
      storageService.updateUserProfile(existingGuest.id, {
        displayName: guestName.trim() || 'Tamu Kasual',
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${guestName}&backgroundColor=e2e8f0`,
      });
      storageService.setCurrentUser(existingGuest.id);
    } else {
      const guest = storageService.createUser({
        displayName: guestName.trim() || 'Tamu Kasual',
        username: 'tamu_' + Math.floor(Math.random() * 1000),
        role: 'guest',
        bio: 'Pengunjung tanpa akun permanen di Forum Mentarimuda.',
        badges: ['Pengunjung Kasual'],
      });
      storageService.setCurrentUser(guest.id);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div 
        className="clay-card w-full max-w-lg bg-white border-2 border-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md">
              <UserCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg leading-tight">Akun & Akses Mentarimuda</h3>
              <p className="text-xs text-slate-500">Pilih akun simulasi, daftar mudah, atau masuk sebagai tamu</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('switch')}
            className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'switch'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Pilih Akun Demo</span>
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'register'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5 text-emerald-500" />
            <span>Daftar Akun Baru</span>
          </button>
          <button
            onClick={() => setActiveTab('guest')}
            className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'guest'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smile className="w-3.5 h-3.5 text-sky-500" />
            <span>Mode Tamu</span>
          </button>
        </div>

        {/* Tab 1: Quick Switch */}
        {activeTab === 'switch' && (
          <div className="p-5 space-y-3 max-h-[60vh] overflow-y-auto">
            <p className="text-xs text-slate-500">
              Uji coba forum dari berbagai peran: Admin (akses moderasi penuh), Moderator, Member aktif, atau Pengunjung kasual:
            </p>
            <div className="space-y-2.5">
              {users.map((user) => {
                const isCurrent = user.id === currentUser.id;
                return (
                  <div
                    key={user.id}
                    onClick={() => handleSelectUser(user.id)}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isCurrent
                        ? 'border-amber-400 bg-amber-50/60 shadow-sm'
                        : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50/80'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={user.avatar}
                        alt={user.displayName}
                        referrerPolicy="no-referrer"
                        className="w-11 h-11 rounded-2xl bg-slate-100 border-2 border-white shadow-xs object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-800 truncate">
                            {user.displayName}
                          </span>
                          {user.role === 'admin' && (
                            <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-md font-semibold">
                              Admin
                            </span>
                          )}
                          {user.role === 'moderator' && (
                            <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-md font-semibold">
                              Mod
                            </span>
                          )}
                          {user.role === 'guest' && (
                            <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded-md font-semibold">
                              Tamu
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 truncate mt-0.5">
                          @{user.username} · {user.postCount} Post · {user.karma} Poin
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isCurrent ? (
                        <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-white px-2.5 py-1 rounded-xl shadow-xs border border-amber-200">
                          <Check className="w-3.5 h-3.5" />
                          <span>Aktif</span>
                        </div>
                      ) : (
                        <button className="clay-btn-secondary px-3 py-1 text-xs">
                          Pilih
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Fast Register */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Lengkap / Panggilan
              </label>
              <input
                type="text"
                required
                value={regDisplayName}
                onChange={(e) => setRegDisplayName(e.target.value)}
                placeholder="cth: Rian Aliansyah"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 clay-inset text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Username
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 text-xs">@</span>
                  <input
                    type="text"
                    required
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="rian_dev"
                    className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-slate-200 clay-inset text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Peran Akun
                </label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 clay-inset text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <option value="member">Anggota Komunitas</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Bio Singkat
              </label>
              <textarea
                rows={2}
                value={regBio}
                onChange={(e) => setRegBio(e.target.value)}
                placeholder="Ceritakan minat atau bidang keahlian Anda..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 clay-inset text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Pilih Karakter Avatar
              </label>
              <div className="flex items-center gap-3">
                <img
                  src={`https://api.dicebear.com/7.x/bottts/svg?seed=${avatarSeed}&backgroundColor=b6e3f4,ffd5dc,d1d4f9`}
                  alt="Preview"
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 object-cover shrink-0"
                />
                <button
                  type="button"
                  onClick={() => setAvatarSeed('pemuda_' + Math.floor(Math.random() * 9000))}
                  className="clay-btn-secondary px-3 py-2 text-xs flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Acak Avatar</span>
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="clay-btn-primary w-full py-3 text-sm font-bold flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Daftar & Masuk Sekarang</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Mode Tamu */}
        {activeTab === 'guest' && (
          <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 space-y-2">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                <Shield className="w-4 h-4 text-amber-600" />
                <span>Fitur Mode Tamu Tanpa Registrasi</span>
              </div>
              <p className="text-xs text-amber-900/80 leading-relaxed">
                Anda dapat langsung menjelajah seluruh forum, membaca diskusi, memberikan voting polling, dan ikut menanggapi komentar tanpa harus membuat password atau email.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Panggilan Tamu Anda
              </label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="cth: Tamu Penasaran"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 clay-inset text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Nama ini akan muncul pada komentar atau interaksi Anda dengan tanda badge [Tamu].
              </p>
            </div>

            <button
              onClick={handleContinueAsGuest}
              className="clay-btn-primary w-full py-3 text-sm font-bold flex items-center justify-center gap-2"
            >
              <Smile className="w-4 h-4" />
              <span>Lanjut Sebagai Tamu</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
