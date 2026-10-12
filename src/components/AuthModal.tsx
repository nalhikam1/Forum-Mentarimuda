import React, { useState } from 'react';
import { storageService } from '../services/storage';
import { 
  ShieldCheck, 
  UserPlus, 
  Smile, 
  LogIn, 
  LogOut, 
  X, 
  Sparkles, 
  KeyRound, 
  User, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const currentUser = storageService.getCurrentUser();
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'guest'>('login');

  // Login state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register state
  const [regDisplayName, setRegDisplayName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regBio, setRegBio] = useState('Semangat belajar dan bertukar wawasan di Mentarimuda.');
  const [avatarSeed, setAvatarSeed] = useState('pemuda_' + Math.floor(Math.random() * 900 + 100));

  // Guest state
  const [guestName, setGuestName] = useState('Tamu Mentari');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const res = storageService.login(loginUsername, loginPassword);
    if (res.success) {
      setLoginUsername('');
      setLoginPassword('');
      onClose();
    } else {
      setLoginError(res.error || 'Login gagal. Periksa kembali username dan password.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regDisplayName.trim() || !regUsername.trim()) return;

    const cleanUsername = regUsername.trim().toLowerCase().replace(/\s+/g, '_');
    if (cleanUsername === 'naufalmuhammadalhikam') {
      alert('Username ini dikhususkan untuk Administrator.');
      return;
    }

    storageService.createUser({
      displayName: regDisplayName.trim(),
      username: cleanUsername,
      password: regPassword.trim(),
      bio: regBio.trim(),
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${avatarSeed}&backgroundColor=b6e3f4,ffd5dc`,
    });

    onClose();
  };

  const handleContinueAsGuest = () => {
    storageService.setGuestMode(guestName.trim());
    onClose();
  };

  const handleLogout = () => {
    storageService.logout();
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
              <KeyRound className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg leading-tight">Akun Mentarimuda</h3>
              <p className="text-xs text-slate-500">
                {currentUser.role === 'guest' ? 'Mode Tamu (Belum Login)' : `Masuk sebagai: ${currentUser.displayName}`}
              </p>
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
        <div className="p-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-1.5">
          <button
            onClick={() => { setActiveTab('login'); setLoginError(''); }}
            className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'login'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-3.5 h-3.5 text-amber-500" />
            <span>Masuk (Login)</span>
          </button>
          <button
            onClick={() => { setActiveTab('register'); setLoginError(''); }}
            className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'register'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5 text-emerald-500" />
            <span>Daftar Member</span>
          </button>
          <button
            onClick={() => { setActiveTab('guest'); setLoginError(''); }}
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

        {/* TAB 1: LOGIN */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="p-5 space-y-4 max-h-[65vh] overflow-y-auto">
            {loginError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Username
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 text-xs">@</span>
                <input
                  type="text"
                  required
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="username kamu"
                  className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-slate-200 clay-inset text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="password kamu"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 clay-inset text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium"
              />
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              {currentUser.role !== 'guest' && (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="clay-btn-secondary px-4 py-2.5 text-xs font-semibold text-rose-600 flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              )}

              <button
                type="submit"
                className="clay-btn-primary flex-1 py-2.5 text-xs md:text-sm font-bold flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Masuk</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: REGISTER */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="p-5 space-y-4 max-h-[65vh] overflow-y-auto">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Lengkap / Panggilan
              </label>
              <input
                type="text"
                required
                value={regDisplayName}
                onChange={(e) => setRegDisplayName(e.target.value)}
                placeholder="cth: Ahmad Zaki"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 clay-inset text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Username Member
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 text-xs">@</span>
                  <input
                    type="text"
                    required
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="ahmad_zaki"
                    className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-slate-200 clay-inset text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Buat password..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 clay-inset text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
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
                  src={`https://api.dicebear.com/7.x/bottts/svg?seed=${avatarSeed}&backgroundColor=b6e3f4,ffd5dc`}
                  alt="Preview Avatar"
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 object-cover shrink-0"
                />
                <button
                  type="button"
                  onClick={() => setAvatarSeed('pemuda_' + Math.floor(Math.random() * 9000))}
                  className="clay-btn-secondary px-3 py-2 text-xs flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Acak Avatar Robot Clay</span>
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="clay-btn-primary w-full py-3 text-sm font-bold flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Daftar Member & Masuk</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: GUEST MODE */}
        {activeTab === 'guest' && (
          <div className="p-5 space-y-4 max-h-[65vh] overflow-y-auto">
            <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200/60 space-y-2">
              <div className="flex items-center gap-2 text-sky-800 font-bold text-sm">
                <Smile className="w-4 h-4 text-sky-600" />
                <span>Fitur Mode Tamu (Pengunjung Kasual)</span>
              </div>
              <p className="text-xs text-sky-900/80 leading-relaxed">
                Anda dapat langsung menjelajahi seluruh diskusi, voting pada polling, serta menanggapi komentar dengan lencana <b>[Tamu]</b> tanpa perlu membuat password.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Panggilan Tamu
              </label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="cth: Tamu Mentari"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 clay-inset text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <button
              onClick={handleContinueAsGuest}
              className="clay-btn-primary w-full py-3 text-sm font-bold flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Gunakan Mode Tamu</span>
            </button>

            {currentUser.role !== 'guest' && (
              <button
                onClick={handleLogout}
                className="w-full text-center text-xs text-slate-500 hover:text-rose-600 font-semibold py-1 transition-colors"
              >
                Keluar dari akun {currentUser.displayName}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
