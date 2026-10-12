import React, { useState, useEffect } from 'react';
import { Post, Category, User, Announcement, UserRole } from '../types/forum';
import { storageService, subscribeToStateChange } from '../services/storage';
import { slugify } from '../utils/slugify';
import { 
  ShieldCheck, 
  Layers, 
  Users, 
  FileText, 
  Bell, 
  Database, 
  Pin, 
  Lock, 
  Unlock, 
  Trash2, 
  Plus, 
  Ban, 
  CheckCircle, 
  Download, 
  Upload, 
  RefreshCw, 
  Search,
  ExternalLink,
  Tag,
  LogIn
} from 'lucide-react';

interface AdminDashboardPageProps {
  onNavigate: (path: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const currentUser = storageService.getCurrentUser();
  const [activeTab, setActiveTab] = useState<'overview' | 'posts' | 'categories' | 'users' | 'announcements' | 'backup'>('overview');

  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [stats, setStats] = useState(storageService.getCommunityStats());

  // Post search filter
  const [postSearch, setPostSearch] = useState('');

  // Category Form State
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatColor, setNewCatColor] = useState('amber');
  const [newCatIcon, setNewCatIcon] = useState('Code');

  // Announcement Form State
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnContent, setNewAnnContent] = useState('');
  const [newAnnType, setNewAnnType] = useState<'info' | 'warning' | 'success'>('info');

  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [adminAuthError, setAdminAuthError] = useState('');

  const loadData = () => {
    setPosts(storageService.getPosts());
    setCategories(storageService.getCategories());
    setUsers(storageService.getUsers());
    setAnnouncements(storageService.getAnnouncements());
    setStats(storageService.getCommunityStats());
  };

  useEffect(() => {
    loadData();
    const unsub = subscribeToStateChange(() => {
      loadData();
    });
    return () => unsub();
  }, []);

  const handleTogglePin = (postId: string) => {
    storageService.togglePinPost(postId);
    loadData();
  };

  const handleToggleLock = (postId: string) => {
    storageService.toggleLockPost(postId);
    loadData();
  };

  const handleDeletePost = (postId: string) => {
    if (confirm('Yakin ingin menghapus postingan ini secara permanen?')) {
      storageService.deletePost(postId);
      loadData();
    }
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    storageService.saveCategory({
      name: newCatName.trim(),
      slug: newCatSlug.trim() || slugify(newCatName.trim()),
      description: newCatDesc.trim(),
      color: newCatColor,
      iconName: newCatIcon,
    });

    setNewCatName('');
    setNewCatSlug('');
    setNewCatDesc('');
    loadData();
  };

  const handleDeleteCategory = (catId: string) => {
    if (confirm('Hapus kategori ini?')) {
      storageService.deleteCategory(catId);
      loadData();
    }
  };

  const handleToggleBan = (userId: string) => {
    storageService.toggleBanUser(userId);
    loadData();
  };

  const handleChangeRole = (userId: string, role: UserRole) => {
    storageService.changeUserRole(userId, role);
    loadData();
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnTitle.trim() || !newAnnContent.trim()) return;

    storageService.saveAnnouncement({
      title: newAnnTitle.trim(),
      content: newAnnContent.trim(),
      type: newAnnType,
      active: true,
    });

    setNewAnnTitle('');
    setNewAnnContent('');
    loadData();
  };

  const handleDeleteAnnouncement = (id: string) => {
    storageService.deleteAnnouncement(id);
    loadData();
  };

  const handleExportData = () => {
    const jsonStr = storageService.exportDataJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mentarimuda_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = storageService.importDataJson(content);
      if (success) {
        alert('Data berhasil diimpor dan disinkronkan!');
        loadData();
      } else {
        alert('Format file JSON tidak valid.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (confirm('PERINGATAN: Ini akan mereset seluruh database forum ke data bawaan demo. Lanjutkan?')) {
      storageService.resetToDefaultData();
      loadData();
      alert('Data telah direset ke versi demo.');
    }
  };

  const filteredPosts = posts.filter(p => {
    if (!postSearch.trim()) return true;
    const q = postSearch.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.authorName.toLowerCase().includes(q);
  });

  const handleAdminVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminAuthError('');
    const res = storageService.login(loginUsername, loginPassword);
    if (res.success) {
      if (res.user?.role !== 'admin') {
        setAdminAuthError('Akun ini tidak memiliki akses administrator.');
        return;
      }
      setLoginUsername('');
      setLoginPassword('');
      loadData();
    } else {
      setAdminAuthError(res.error || 'Username atau password salah.');
    }
  };

  if (currentUser.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="clay-card p-6 md:p-8 bg-white border-2 border-amber-200/80 shadow-2xl text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 mx-auto flex items-center justify-center mb-4 clay-inset">
            <ShieldCheck className="w-7 h-7 text-amber-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Login Administrator</h2>
          <p className="text-xs text-slate-500 mt-1.5 mb-5 leading-relaxed">
            Silakan masukkan username dan password untuk mengakses dashboard ini.
          </p>

          <form onSubmit={handleAdminVerify} className="space-y-3.5 text-left">
            {adminAuthError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium text-center">
                {adminAuthError}
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

            <button
              type="submit"
              className="clay-btn-primary w-full py-2.5 text-xs md:text-sm font-bold flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk</span>
            </button>
          </form>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center text-xs">
            <button
              onClick={() => onNavigate('')}
              className="text-slate-400 hover:text-slate-700 font-medium"
            >
              Kembali ke Forum
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Admin Title Card */}
      <div className="clay-card p-6 md:p-8 bg-gradient-to-r from-red-500/10 via-amber-500/5 to-white border-2 border-red-200/60 shadow-xl flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-red-700 uppercase tracking-widest flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-red-600" />
              <span>Pusat Kendali Moderator & Admin</span>
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
            Dashboard Admin Panel Mentarimuda
          </h1>
          <p className="text-xs md:text-sm text-slate-600 mt-1">
            Kelola postingan, moderasi konten, kategorisasi forum, pengguna, dan pencadangan data dengan mudah.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('')}
            className="clay-btn-secondary px-4 py-2 text-xs font-bold"
          >
            Kembali ke Forum
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'overview'
              ? 'clay-btn-primary shadow-sm'
              : 'clay-btn-secondary text-slate-600'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Ringkasan Moderasi</span>
        </button>

        <button
          onClick={() => setActiveTab('posts')}
          className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'posts'
              ? 'clay-btn-primary shadow-sm'
              : 'clay-btn-secondary text-slate-600'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Kelola Topik ({posts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'categories'
              ? 'clay-btn-primary shadow-sm'
              : 'clay-btn-secondary text-slate-600'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Kelola Kategori ({categories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'users'
              ? 'clay-btn-primary shadow-sm'
              : 'clay-btn-secondary text-slate-600'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Kelola Anggota ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('announcements')}
          className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'announcements'
              ? 'clay-btn-primary shadow-sm'
              : 'clay-btn-secondary text-slate-600'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Pengumuman Forum ({announcements.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('backup')}
          className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'backup'
              ? 'clay-btn-primary shadow-sm'
              : 'clay-btn-secondary text-slate-600'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Sinkronisasi & Backup</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="clay-card p-5 bg-white">
              <span className="text-xs font-bold text-slate-400 uppercase">Total Postingan</span>
              <p className="text-2xl font-black text-slate-900 mt-1 tabular-nums">{stats.totalPosts}</p>
              <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Aktif dan terpantau</span>
            </div>
            <div className="clay-card p-5 bg-white">
              <span className="text-xs font-bold text-slate-400 uppercase">Total Tanggapan</span>
              <p className="text-2xl font-black text-slate-900 mt-1 tabular-nums">{stats.totalComments}</p>
              <span className="text-[11px] text-slate-500 font-semibold mt-1 block">Rata-rata 3.2 per topik</span>
            </div>
            <div className="clay-card p-5 bg-white">
              <span className="text-xs font-bold text-slate-400 uppercase">Tingkat Solusi Q&A</span>
              <p className="text-2xl font-black text-emerald-600 mt-1 tabular-nums">{stats.solvedRate}%</p>
              <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">Pertanyaan berhasil teratasi</span>
            </div>
            <div className="clay-card p-5 bg-white">
              <span className="text-xs font-bold text-slate-400 uppercase">Anggota Terdaftar</span>
              <p className="text-2xl font-black text-slate-900 mt-1 tabular-nums">{stats.activeMembers}</p>
              <span className="text-[11px] text-amber-600 font-semibold mt-1 block">Termasuk tamu aktif</span>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="clay-card p-6 bg-white space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Pintasan Tindakan Moderasi Cepat</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => setActiveTab('categories')}
                className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-left hover:bg-amber-100/50 transition-colors"
              >
                <Layers className="w-5 h-5 text-amber-600 mb-2" />
                <h4 className="font-bold text-sm text-slate-900">Tambah Kategori Baru</h4>
                <p className="text-xs text-slate-500 mt-0.5">Kelompokkan diskusi pemuda berdasarkan tren baru</p>
              </button>

              <button
                onClick={() => setActiveTab('announcements')}
                className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200/80 text-left hover:bg-sky-100/50 transition-colors"
              >
                <Bell className="w-5 h-5 text-sky-600 mb-2" />
                <h4 className="font-bold text-sm text-slate-900">Pasang Banner Pengumuman</h4>
                <p className="text-xs text-slate-500 mt-0.5">Sampaikan info webinar, kompetisi, atau agenda penting</p>
              </button>

              <button
                onClick={() => setActiveTab('backup')}
                className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-left hover:bg-emerald-100/50 transition-colors"
              >
                <Download className="w-5 h-5 text-emerald-600 mb-2" />
                <h4 className="font-bold text-sm text-slate-900">Cadangkan Data Komunitas</h4>
                <p className="text-xs text-slate-500 mt-0.5">Export seluruh postingan & komentar ke file JSON</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: POSTS MANAGEMENT */}
      {activeTab === 'posts' && (
        <div className="clay-card p-6 bg-white space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h3 className="font-bold text-slate-900 text-base">Daftar Semua Topik & Moderasi</h3>
            <div className="relative min-w-[240px]">
              <input
                type="text"
                value={postSearch}
                onChange={(e) => setPostSearch(e.target.value)}
                placeholder="Cari judul atau nama penulis..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 clay-inset"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Judul & Kategori</th>
                  <th className="p-3">Tipe</th>
                  <th className="p-3">Penulis</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Tindakan Moderasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50/70">
                    <td className="p-3 max-w-xs">
                      <p className="font-bold text-slate-900 truncate">{post.title}</p>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">/{post.slug}</p>
                    </td>
                    <td className="p-3">
                      <span className="capitalize font-semibold text-slate-700">{post.type}</span>
                    </td>
                    <td className="p-3">
                      <span className="font-medium">{post.authorName}</span>
                    </td>
                    <td className="p-3 space-x-1">
                      {post.isPinned && <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded text-[10px] font-bold">Pinned</span>}
                      {post.isLocked && <span className="bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded text-[10px] font-bold">Locked</span>}
                      {post.isSolved && <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded text-[10px] font-bold">Solved</span>}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleTogglePin(post.id)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            post.isPinned ? 'bg-amber-100 border-amber-300 text-amber-700' : 'bg-white text-slate-500 hover:bg-slate-100'
                          }`}
                          title={post.isPinned ? 'Lepas Sematan' : 'Sematkan Topik'}
                        >
                          <Pin className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleToggleLock(post.id)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            post.isLocked ? 'bg-slate-200 border-slate-300 text-slate-800' : 'bg-white text-slate-500 hover:bg-slate-100'
                          }`}
                          title={post.isLocked ? 'Buka Gembok Topik' : 'Kunci Topik'}
                        >
                          {post.isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={() => onNavigate(`diskusi/${post.slug}`)}
                          className="p-1.5 rounded-lg bg-white border text-slate-500 hover:text-amber-600 hover:bg-slate-100"
                          title="Buka Topik"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="p-1.5 rounded-lg bg-white border border-rose-200 text-rose-500 hover:bg-rose-50"
                          title="Hapus Topik"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CATEGORIES */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Add Category Form (5 cols) */}
          <div className="lg:col-span-5 clay-card p-6 bg-white space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Tambah Kategori Baru</h3>
            <form onSubmit={handleCreateCategory} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Kategori</label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => {
                    setNewCatName(e.target.value);
                    if (!newCatSlug) setNewCatSlug(slugify(e.target.value));
                  }}
                  placeholder="cth: Riset & Inovasi"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 clay-inset"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Slug URL</label>
                <input
                  type="text"
                  required
                  value={newCatSlug}
                  onChange={(e) => setNewCatSlug(slugify(e.target.value))}
                  placeholder="riset-inovasi"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 clay-inset font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Kategori</label>
                <textarea
                  rows={2}
                  required
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="Jelaskan jenis diskusi yang relevan..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 clay-inset"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Aksen Warna</label>
                  <select
                    value={newCatColor}
                    onChange={(e) => setNewCatColor(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 clay-inset"
                  >
                    <option value="amber">Amber</option>
                    <option value="sky">Sky Blue</option>
                    <option value="emerald">Emerald</option>
                    <option value="rose">Rose</option>
                    <option value="purple">Purple</option>
                    <option value="orange">Orange</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ikon Simbol</label>
                  <select
                    value={newCatIcon}
                    onChange={(e) => setNewCatIcon(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 clay-inset"
                  >
                    <option value="Code">Code</option>
                    <option value="GraduationCap">GraduationCap</option>
                    <option value="Palette">Palette</option>
                    <option value="TrendingUp">TrendingUp</option>
                    <option value="HelpCircle">HelpCircle</option>
                    <option value="Coffee">Coffee</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="clay-btn-primary w-full py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 mt-2"
              >
                <Plus className="w-4 h-4" />
                <span>Simpan Kategori Baru</span>
              </button>
            </form>
          </div>

          {/* Existing Categories List (7 cols) */}
          <div className="lg:col-span-7 clay-card p-6 bg-white space-y-3">
            <h3 className="font-bold text-slate-900 text-base">Kategori Aktif ({categories.length})</h3>
            <div className="divide-y divide-slate-100">
              {categories.map((cat) => (
                <div key={cat.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{cat.name}</h4>
                    <p className="text-xs text-slate-500 line-clamp-1">{cat.description}</p>
                    <span className="text-[10px] text-slate-400 font-mono">/kategori/{cat.slug} · {cat.threadCount} Topik</span>
                  </div>

                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="p-1.5 rounded-lg border border-rose-200 text-rose-500 hover:bg-rose-50"
                    title="Hapus Kategori"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: USERS MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="clay-card p-6 bg-white space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Daftar Pengguna & Hak Akses</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Pengguna</th>
                  <th className="p-3">Peran (Role)</th>
                  <th className="p-3">Poin Reputasi</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Ubah Hak Akses</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70">
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={u.avatar}
                          alt={u.displayName}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-xl bg-slate-100 object-cover"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{u.displayName}</p>
                          <p className="text-[10px] text-slate-400">@{u.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <select
                        value={u.role}
                        onChange={(e) => handleChangeRole(u.id, e.target.value as UserRole)}
                        className="px-2 py-1 rounded-lg border border-slate-200 bg-white text-xs font-semibold"
                      >
                        <option value="member">Member</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin">Admin</option>
                        <option value="guest">Guest</option>
                      </select>
                    </td>
                    <td className="p-3 tabular-nums font-bold text-amber-600">
                      {u.karma} Poin
                    </td>
                    <td className="p-3">
                      {u.isBanned ? (
                        <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold">Diblokir</span>
                      ) : (
                        <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold">Aktif</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      {u.id !== currentUser.id && (
                        <button
                          onClick={() => handleToggleBan(u.id)}
                          className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                            u.isBanned
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                              : 'bg-rose-50 text-rose-700 border-rose-300'
                          }`}
                        >
                          {u.isBanned ? 'Buka Blokir' : 'Blokir User'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: ANNOUNCEMENTS */}
      {activeTab === 'announcements' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 clay-card p-6 bg-white space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Buat Pengumuman Baru</h3>
            <form onSubmit={handleCreateAnnouncement} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Judul Banner</label>
                <input
                  type="text"
                  required
                  value={newAnnTitle}
                  onChange={(e) => setNewAnnTitle(e.target.value)}
                  placeholder="cth: Webinar Nasional Mentarimuda 2026"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 clay-inset"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Isi Pesan</label>
                <textarea
                  rows={3}
                  required
                  value={newAnnContent}
                  onChange={(e) => setNewAnnContent(e.target.value)}
                  placeholder="Tulis informasi detail pengumuman yang ingin ditampilkan ke seluruh anggota..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 clay-inset"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tipe Tampilan</label>
                <select
                  value={newAnnType}
                  onChange={(e) => setNewAnnType(e.target.value as 'info' | 'warning' | 'success')}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 clay-inset"
                >
                  <option value="info">Informasi (Biru/Netral)</option>
                  <option value="success">Sukses / Peluang (Hijau/Emas)</option>
                  <option value="warning">Peringatan / Deadline (Kuning/Oranye)</option>
                </select>
              </div>

              <button
                type="submit"
                className="clay-btn-primary w-full py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 mt-2"
              >
                <Plus className="w-4 h-4" />
                <span>Terbitkan Pengumuman</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 clay-card p-6 bg-white space-y-3">
            <h3 className="font-bold text-slate-900 text-base">Daftar Pengumuman Aktif</h3>
            <div className="space-y-3">
              {announcements.map((ann) => (
                <div key={ann.id} className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{ann.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{ann.content}</p>
                    <span className="text-[10px] text-slate-400 mt-2 block">
                      Dibuat {new Date(ann.createdAt).toLocaleDateString('id-ID')}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteAnnouncement(ann.id)}
                    className="p-1.5 rounded-lg border border-rose-200 text-rose-500 hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: BACKUP & SYNC */}
      {activeTab === 'backup' && (
        <div className="clay-card p-6 bg-white space-y-6">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Sinkronisasi & Pencadangan Data Forum</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Simpan seluruh database lokal forum ke format JSON atau pulihkan data kapan saja.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <Download className="w-6 h-6 text-amber-600 mb-2" />
                <h4 className="font-bold text-sm text-slate-900">Export Backup JSON</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Unduh seluruh koleksi postingan, komentar, pengguna, dan polling.
                </p>
              </div>
              <button
                onClick={handleExportData}
                className="mt-4 clay-btn-primary px-4 py-2 text-xs font-bold"
              >
                Unduh File Backup
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <Upload className="w-6 h-6 text-emerald-600 mb-2" />
                <h4 className="font-bold text-sm text-slate-900">Import Data JSON</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Pulihkan database dari file JSON yang telah dicadangkan sebelumnya.
                </p>
              </div>
              <label className="mt-4 clay-btn-secondary px-4 py-2 text-xs font-bold text-center cursor-pointer block">
                <span>Pilih File JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                />
              </label>
            </div>

            <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-200/80 flex flex-col justify-between">
              <div>
                <RefreshCw className="w-6 h-6 text-rose-600 mb-2" />
                <h4 className="font-bold text-sm text-slate-900">Reset ke Demo Bawaan</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Kembalikan seluruh postingan ke data benih awal Mentarimuda.
                </p>
              </div>
              <button
                onClick={handleResetData}
                className="mt-4 px-4 py-2 text-xs font-bold bg-white text-rose-600 border border-rose-300 rounded-xl hover:bg-rose-100 transition-colors"
              >
                Reset Database
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
