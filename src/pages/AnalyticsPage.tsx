import React, { useState, useEffect } from 'react';
import { CommunityStats, ActivityEvent } from '../types/forum';
import { storageService, subscribeToStateChange } from '../services/storage';
import { formatTimeAgo } from '../utils/slugify';
import { 
  TrendingUp, 
  Sparkles, 
  Activity, 
  MessageSquare, 
  Vote, 
  CheckCircle, 
  Users, 
  ArrowLeft,
  Flame,
  Radio,
  Zap,
  BarChart3,
  ShieldCheck,
  LogIn
} from 'lucide-react';

interface AnalyticsPageProps {
  onNavigate: (path: string) => void;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<CommunityStats>(storageService.getCommunityStats());
  const [activities, setActivities] = useState<ActivityEvent[]>(storageService.getActivityEvents());
  const [isSimulating, setIsSimulating] = useState(false);
  const categories = storageService.getCategories();
  const posts = storageService.getPosts();

  const loadData = () => {
    setStats(storageService.getCommunityStats());
    setActivities(storageService.getActivityEvents());
  };

  useEffect(() => {
    loadData();
    const unsub = subscribeToStateChange(() => {
      loadData();
    });
    return () => unsub();
  }, []);

  const handleTriggerSimulation = () => {
    setIsSimulating(true);
    storageService.simulateRandomInteraction();
    setTimeout(() => {
      setIsSimulating(false);
      loadData();
    }, 400);
  };

  // Compute category distribution
  const totalPostsCount = Math.max(1, posts.length);
  const categoryStats = categories.map(cat => {
    const count = posts.filter(p => p.categorySlug === cat.slug).length;
    const percentage = Math.round((count / totalPostsCount) * 100);
    return {
      ...cat,
      count,
      percentage,
    };
  }).sort((a, b) => b.count - a.count);

  const currentUser = storageService.getCurrentUser();
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [adminAuthError, setAdminAuthError] = useState('');

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
        <div className="clay-card p-6 md:p-8 bg-white border-2 border-purple-200/80 shadow-2xl text-center">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-600 mx-auto flex items-center justify-center mb-4 clay-inset">
            <BarChart3 className="w-7 h-7 text-purple-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Login Administrator</h2>
          <p className="text-xs text-slate-500 mt-1.5 mb-5 leading-relaxed">
            Silakan masukkan username dan password untuk melihat analitik forum.
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
                  className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-slate-200 clay-inset text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium"
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
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 clay-inset text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium"
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
      {/* Top Banner & Simulation Trigger */}
      <div className="clay-card p-6 md:p-8 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-white border-2 border-amber-200/60 shadow-xl flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-100/70 px-2.5 py-0.5 rounded-full">
              <Radio className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              <span>Real-Time Community Pulse</span>
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
            Dashboard Analitik Aktivitas Mentarimuda
          </h1>
          <p className="text-xs md:text-sm text-slate-600 mt-1 max-w-2xl">
            Pantau pertumbuhan topik, dinamika tanggapan pemuda, serta tingkat penyelesaian tanya-jawab secara langsung.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleTriggerSimulation}
            disabled={isSimulating}
            className="clay-btn-primary px-4 py-2.5 text-xs font-bold flex items-center gap-2 shadow-md"
          >
            <Zap className="w-4 h-4" />
            <span>{isSimulating ? 'Memproses...' : 'Simulasikan Interaksi Member'}</span>
          </button>

          <button
            onClick={() => onNavigate('')}
            className="clay-btn-secondary px-3.5 py-2.5 text-xs font-semibold flex items-center gap-1.5 text-slate-700"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Forum</span>
          </button>
        </div>
      </div>

      {/* 4-Card Primary KPI Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="clay-card p-5 bg-white border border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-bold uppercase tracking-wider">Total Diskusi & Topik</span>
            <Activity className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-3xl font-black text-slate-900 tabular-nums">
            {stats.totalPosts}
          </p>
          <span className="text-[11px] text-slate-500 mt-1.5 block">
            Aktif di {categories.length} kategori forum
          </span>
        </div>

        <div className="clay-card p-5 bg-white border border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-bold uppercase tracking-wider">Total Tanggapan Komentar</span>
            <MessageSquare className="w-4 h-4 text-sky-500" />
          </div>
          <p className="text-3xl font-black text-slate-900 tabular-nums">
            {stats.totalComments}
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1.5 block">
            +18% interaksi minggu ini
          </span>
        </div>

        <div className="clay-card p-5 bg-white border border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-bold uppercase tracking-wider">Suara Polling Masuk</span>
            <Vote className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-3xl font-black text-slate-900 tabular-nums">
            {stats.totalVotes}
          </p>
          <span className="text-[11px] text-purple-700 font-semibold mt-1.5 block">
            Partisipasi voting pemuda
          </span>
        </div>

        <div className="clay-card p-5 bg-white border border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-bold uppercase tracking-wider">Resolusi Pertanyaan (Q&A)</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-3xl font-black text-emerald-600 tabular-nums">
            {stats.solvedRate}%
          </p>
          <span className="text-[11px] text-slate-500 mt-1.5 block">
            Memiliki solusi terverifikasi
          </span>
        </div>
      </div>

      {/* Charts & Breakdown Row (8 cols + 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Weekly Engagement Volume Chart */}
        <div className="lg:col-span-7 space-y-6">
          <div className="clay-card p-6 bg-white space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Aktivitas Mingguan Komunitas</h3>
                <p className="text-xs text-slate-500">Volume postingan, tanggapan komentar, dan suara polling</p>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-amber-600">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Topik
                </span>
                <span className="flex items-center gap-1.5 text-sky-600">
                  <div className="w-2.5 h-2.5 rounded-full bg-sky-500" /> Komentar
                </span>
                <span className="flex items-center gap-1.5 text-purple-600">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Suara
                </span>
              </div>
            </div>

            {/* Visual SVG & Clay Bar Chart */}
            <div className="pt-4">
              <div className="grid grid-cols-7 gap-3 items-end h-52 p-4 bg-slate-50/70 rounded-2xl clay-inset">
                {stats.weeklyActivity.map((dayStat, idx) => {
                  const maxH = 20; // scale factor
                  const postsHeight = Math.min(100, (dayStat.posts / maxH) * 100);
                  const commentsHeight = Math.min(100, (dayStat.comments / maxH) * 100);
                  const votesHeight = Math.min(100, (dayStat.votes / maxH) * 100);

                  return (
                    <div key={idx} className="flex flex-col items-center h-full justify-end gap-1.5">
                      <div className="w-full flex items-end justify-center gap-1 h-36">
                        {/* Posts Bar */}
                        <div
                          className="w-2.5 bg-gradient-to-t from-amber-500 to-amber-300 rounded-t-md shadow-xs transition-all duration-500"
                          style={{ height: `${Math.max(12, postsHeight)}%` }}
                          title={`Topik: ${dayStat.posts}`}
                        />
                        {/* Comments Bar */}
                        <div
                          className="w-2.5 bg-gradient-to-t from-sky-500 to-sky-300 rounded-t-md shadow-xs transition-all duration-500"
                          style={{ height: `${Math.max(16, commentsHeight)}%` }}
                          title={`Komentar: ${dayStat.comments}`}
                        />
                        {/* Votes Bar */}
                        <div
                          className="w-2.5 bg-gradient-to-t from-purple-500 to-purple-300 rounded-t-md shadow-xs transition-all duration-500"
                          style={{ height: `${Math.max(14, votesHeight)}%` }}
                          title={`Voting: ${dayStat.votes}`}
                        />
                      </div>
                      <span className="text-[11px] font-bold text-slate-600 mt-1">
                        {dayStat.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Category Share Distribution */}
          <div className="clay-card p-6 bg-white space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Sebaran Topik Berdasarkan Kategori</h3>
            <div className="space-y-3">
              {categoryStats.map((cat) => (
                <div key={cat.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{cat.name}</span>
                    <span className="font-semibold text-slate-500 tabular-nums">
                      {cat.count} topik ({cat.percentage}%)
                    </span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden clay-inset">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transition-all duration-700"
                      style={{ width: `${Math.max(5, cat.percentage)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Real-time Live Activity Stream (Feed) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="clay-card p-6 bg-white space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" />
                <h3 className="font-bold text-slate-900 text-base">Aliran Interaksi Real-Time</h3>
              </div>
              <span className="text-[10px] text-emerald-600 font-extrabold uppercase bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Live Feed
              </span>
            </div>

            <div className="divide-y divide-slate-100 max-h-[520px] overflow-y-auto pr-1">
              {activities.map((act) => (
                <div
                  key={act.id}
                  onClick={() => {
                    if (act.targetSlug) {
                      onNavigate(`diskusi/${act.targetSlug}`);
                    }
                  }}
                  className="py-3 flex items-start gap-3 cursor-pointer hover:bg-slate-50/70 p-2 rounded-xl transition-colors"
                >
                  <img
                    src={act.userAvatar}
                    alt={act.userName}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-xl bg-amber-50 object-cover border border-white shadow-2xs shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-700 leading-snug">
                      <span className="font-bold text-slate-900">{act.userName}</span>{' '}
                      <span className="text-slate-500">{act.actionText}</span>{' '}
                      <span className="font-bold text-amber-700">"{act.targetTitle}"</span>
                    </p>
                    <span className="text-[10px] text-slate-400 font-mono mt-0.5 block tabular-nums">
                      {formatTimeAgo(act.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
