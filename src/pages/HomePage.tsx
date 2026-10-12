import React, { useState, useEffect } from 'react';
import { Post, Category, Announcement, User } from '../types/forum';
import { storageService, subscribeToStateChange } from '../services/storage';
import { PostCard } from '../components/PostCard';
import { PollWidget } from '../components/PollWidget';
import { 
  Sparkles, 
  Flame, 
  MessageSquare, 
  HelpCircle, 
  Vote, 
  Trophy, 
  TrendingUp, 
  AlertCircle, 
  Layers, 
  Users, 
  CheckCircle,
  X,
  Compass
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (path: string) => void;
  selectedCategorySlug?: string;
  searchFilter?: string;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  selectedCategorySlug,
  searchFilter,
}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [leaderboard, setLeaderboard] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'diskusi' | 'pertanyaan' | 'polling' | 'trending' | 'unsolved'>('all');
  const [featuredPollPost, setFeaturedPollPost] = useState<Post | null>(null);

  const loadData = () => {
    const allPosts = storageService.getPosts();
    setPosts(allPosts);
    setCategories(storageService.getCategories());
    setAnnouncements(storageService.getAnnouncements().filter(a => a.active));

    // Leaderboard sorted by karma
    const users = storageService.getUsers().filter(u => u.role !== 'guest');
    users.sort((a, b) => b.karma - a.karma);
    setLeaderboard(users.slice(0, 5));

    // Find first active poll
    const pollPost = allPosts.find(p => p.type === 'polling' && p.pollData);
    setFeaturedPollPost(pollPost || null);
  };

  useEffect(() => {
    loadData();
    const unsub = subscribeToStateChange(() => {
      loadData();
    });
    return () => unsub();
  }, []);

  // Filter posts based on tab, category, or search
  const filteredPosts = posts.filter(post => {
    if (selectedCategorySlug && post.categorySlug !== selectedCategorySlug) {
      return false;
    }

    if (searchFilter) {
      const q = searchFilter.toLowerCase();
      const matchTitle = post.title.toLowerCase().includes(q);
      const matchContent = post.content.toLowerCase().includes(q);
      const matchTag = post.tags.some(t => t.toLowerCase().includes(q));
      if (!matchTitle && !matchContent && !matchTag) return false;
    }

    if (activeTab === 'diskusi') return post.type === 'diskusi';
    if (activeTab === 'pertanyaan') return post.type === 'pertanyaan';
    if (activeTab === 'polling') return post.type === 'polling';
    if (activeTab === 'trending') return post.likes >= 10 || post.commentCount >= 3;
    if (activeTab === 'unsolved') return post.type === 'pertanyaan' && !post.isSolved;

    return true;
  });

  const activeCategory = selectedCategorySlug 
    ? categories.find(c => c.slug === selectedCategorySlug) 
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Active Announcement Banner */}
      {announcements.length > 0 && (
        <div className="mb-6 space-y-3">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className="clay-card-warm p-4.5 border-2 border-amber-300/80 bg-gradient-to-r from-amber-50 via-orange-50/40 to-yellow-50 flex items-start justify-between gap-3 shadow-md"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{ann.title}</h4>
                  <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">{ann.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Grid: Left/Center Feed (8 cols) + Right Sidebar (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Feed Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Hero Welcome / Category Header */}
          {activeCategory ? (
            <div className="clay-card p-6 bg-gradient-to-br from-white to-amber-50/30 border-2 border-amber-100">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
                    Kategori Diskusi
                  </span>
                  <h1 className="text-2xl font-black text-slate-900 mt-0.5">
                    {activeCategory.name}
                  </h1>
                  <p className="text-xs md:text-sm text-slate-600 mt-1 max-w-xl">
                    {activeCategory.description}
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('')}
                  className="clay-btn-secondary px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Semua Kategori</span>
                </button>
              </div>
            </div>
          ) : searchFilter ? (
            <div className="clay-card p-5 bg-white flex items-center justify-between gap-3">
              <div>
                <p className="text-xs text-slate-400">Hasil pencarian untuk:</p>
                <h2 className="text-lg font-bold text-slate-800">"{searchFilter}"</h2>
              </div>
              <button
                onClick={() => onNavigate('')}
                className="clay-btn-secondary px-3 py-1.5 text-xs font-semibold"
              >
                Reset Pencarian
              </button>
            </div>
          ) : (
            <div className="clay-card p-6 md:p-7 bg-gradient-to-r from-amber-50/70 via-white to-orange-50/40 border-2 border-white shadow-xl relative overflow-hidden">
              <div className="relative z-10 max-w-xl">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[11px] font-extrabold text-amber-600 uppercase tracking-widest">
                    Komunitas Pemuda
                  </span>
                </div>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Forum MentariMuda
                </h1>
                <p className="text-xs md:text-sm text-slate-600 mt-1.5 leading-relaxed">
                  Ruang diskusi teknologi, karir, startup, dan kolaborasi ide inspiratif generasi muda.
                </p>

                <div className="mt-4 flex items-center gap-2.5 flex-wrap">
                  <button
                    onClick={() => onNavigate('buat-topik')}
                    className="clay-btn-primary px-4 py-2 text-xs font-bold flex items-center gap-1.5"
                  >
                    <span>+ Buat Topik Baru</span>
                  </button>
                  {storageService.getCurrentUser().role === 'admin' ? (
                    <button
                      onClick={() => onNavigate('analitik')}
                      className="clay-btn-secondary px-3.5 py-2 text-xs font-semibold flex items-center gap-1.5 text-purple-700 border-purple-200"
                    >
                      <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
                      <span>Analitik</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onNavigate('kategori')}
                      className="clay-btn-secondary px-3.5 py-2 text-xs font-semibold flex items-center gap-1.5 text-slate-700"
                    >
                      <Compass className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Jelajah Kategori</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Interactive Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                activeTab === 'all'
                  ? 'clay-btn-primary shadow-sm'
                  : 'clay-btn-secondary text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setActiveTab('diskusi')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === 'diskusi'
                  ? 'clay-btn-primary shadow-sm'
                  : 'clay-btn-secondary text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
              <span>Diskusi</span>
            </button>
            <button
              onClick={() => setActiveTab('pertanyaan')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === 'pertanyaan'
                  ? 'clay-btn-primary shadow-sm'
                  : 'clay-btn-secondary text-slate-600 hover:text-slate-900'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-sky-500" />
              <span>Q&A</span>
            </button>
            <button
              onClick={() => setActiveTab('polling')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === 'polling'
                  ? 'clay-btn-primary shadow-sm'
                  : 'clay-btn-secondary text-slate-600 hover:text-slate-900'
              }`}
            >
              <Vote className="w-3.5 h-3.5 text-purple-500" />
              <span>Polling</span>
            </button>
            <button
              onClick={() => setActiveTab('trending')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === 'trending'
                  ? 'clay-btn-primary shadow-sm'
                  : 'clay-btn-secondary text-slate-600 hover:text-slate-900'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              <span>Terhangat</span>
            </button>
          </div>

          {/* Posts List */}
          <div className="space-y-4">
            {filteredPosts.length === 0 ? (
              <div className="clay-card p-12 text-center bg-white">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 mx-auto flex items-center justify-center mb-3 clay-inset">
                  <Compass className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-slate-800 text-base">Tidak Ada Topik Ditemukan</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Belum ada diskusi dalam kriteria ini. Jadilah yang pertama memulai obrolan bermakna!
                </p>
                <button
                  onClick={() => onNavigate('buat-topik')}
                  className="mt-4 clay-btn-primary px-4 py-2 text-xs font-bold"
                >
                  Buat Topik Sekarang
                </button>
              </div>
            ) : (
              filteredPosts.map((post) => {
                const category = categories.find(c => c.slug === post.categorySlug);
                return (
                  <PostCard
                    key={post.id}
                    post={post}
                    category={category}
                    onNavigate={onNavigate}
                    onPostUpdated={loadData}
                  />
                );
              })
            )}
          </div>
        </div>

        {/* Right Sidebar Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Categories Quick Nav */}
          <div className="clay-card p-5 bg-white">
            <div className="flex items-center justify-between gap-2 mb-3.5">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-sm">Kategori Forum</h3>
              </div>
              <button
                onClick={() => onNavigate('kategori')}
                className="text-xs font-semibold text-amber-600 hover:underline"
              >
                Lihat Semua
              </button>
            </div>

            <div className="space-y-2">
              {categories.slice(0, 6).map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => onNavigate(`kategori/${cat.slug}`)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                    selectedCategorySlug === cat.slug
                      ? 'border-amber-400 bg-amber-50/60 font-bold text-slate-900'
                      : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  <span className="text-[11px] text-slate-400 font-semibold tabular-nums shrink-0">
                    {cat.threadCount} topik
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Poll Widget */}
          {featuredPollPost && featuredPollPost.pollData && (
            <div className="clay-card p-5 bg-gradient-to-br from-amber-50/60 to-white border-2 border-amber-200/60">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Vote className="w-3.5 h-3.5 text-amber-600" />
                  <span>Polling Pilihan Hari Ini</span>
                </span>
              </div>
              <PollWidget
                postId={featuredPollPost.id}
                pollData={featuredPollPost.pollData}
                onVoted={loadData}
              />
            </div>
          )}

          {/* Top Kontributor Pemuda Leaderboard */}
          <div className="clay-card p-5 bg-white">
            <div className="flex items-center justify-between gap-2 mb-3.5">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-slate-900 text-sm">Top Kontributor</h3>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Reputasi Mentari</span>
            </div>

            <div className="space-y-3">
              {leaderboard.map((user, idx) => (
                <div
                  key={user.id}
                  onClick={() => onNavigate(`u/${user.username}`)}
                  className="flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xs font-bold text-slate-400 w-4 text-center tabular-nums">
                      {idx + 1}
                    </span>
                    <img
                      src={user.avatar}
                      alt={user.displayName}
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-xl bg-amber-50 object-cover border border-white shadow-2xs shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {user.displayName}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {user.badges[0] || 'Anggota'}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-amber-600 tabular-nums">
                      {user.karma}
                    </span>
                    <span className="text-[10px] text-slate-400 block">poin</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Community Guidelines Card */}
          <div className="clay-card p-5 bg-slate-50/70 border border-slate-200/80 text-xs text-slate-600 space-y-2">
            <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Etika Komunitas Mentarimuda</span>
            </h4>
            <p className="leading-relaxed">
              Utamakan diskusi yang konstruktif dan saling menghargai. Berikan apresiasi jika ada anggota yang membantu menjawab pertanyaanmu!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
