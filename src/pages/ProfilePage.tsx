import React, { useState, useEffect } from 'react';
import { User, Post, Comment } from '../types/forum';
import { storageService, subscribeToStateChange } from '../services/storage';
import { EditProfileModal } from '../components/EditProfileModal';
import { PostCard } from '../components/PostCard';
import { 
  Trophy, 
  MessageSquare, 
  CheckCircle, 
  Calendar, 
  MapPin, 
  Globe, 
  Edit3, 
  ArrowLeft, 
  Award,
  Layers
} from 'lucide-react';

interface ProfilePageProps {
  username: string;
  onNavigate: (path: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  username,
  onNavigate,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [userSolutions, setUserSolutions] = useState<Comment[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'solutions'>('posts');

  const currentUser = storageService.getCurrentUser();

  const loadUserData = () => {
    const users = storageService.getUsers();
    const cleanUsername = username.toLowerCase().replace(/[\s\(\)]+/g, '_');
    const found = users.find(u => 
      u.username.toLowerCase() === cleanUsername || 
      u.displayName.toLowerCase().replace(/[\s\(\)]+/g, '_') === cleanUsername
    );

    if (found) {
      setUser(found);
      const allPosts = storageService.getPosts();
      setUserPosts(allPosts.filter(p => p.authorId === found.id));

      const allComments = storageService.getComments();
      setUserSolutions(allComments.filter(c => c.authorId === found.id && c.isAcceptedSolution));
    }
  };

  useEffect(() => {
    loadUserData();
    const unsub = subscribeToStateChange(() => {
      loadUserData();
    });
    return () => unsub();
  }, [username]);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="clay-card p-12 bg-white">
          <h2 className="text-xl font-bold text-slate-800">Profil Anggota Tidak Ditemukan</h2>
          <p className="text-xs text-slate-500 mt-2">
            Pengguna dengan username "@{username}" belum terdaftar.
          </p>
          <button
            onClick={() => onNavigate('')}
            className="mt-5 clay-btn-primary px-5 py-2.5 text-xs font-bold inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda Forum</span>
          </button>
        </div>
      </div>
    );
  }

  const isSelf = currentUser.id === user.id || currentUser.role === 'admin';
  const categories = storageService.getCategories();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back button */}
      <button
        onClick={() => onNavigate('')}
        className="clay-btn-secondary px-3.5 py-1.5 text-xs font-semibold flex items-center gap-1.5 text-slate-700"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Kembali ke Forum</span>
      </button>

      {/* Profile Header Box (Claymorphism banner & card) */}
      <div className="clay-card overflow-hidden bg-white border-2 border-white shadow-xl">
        {/* Clay Banner gradient */}
        <div className="h-32 md:h-40 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 relative p-6">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            {isSelf && (
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="clay-btn-secondary px-3.5 py-2 text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                <span>Personalisasi Profil</span>
              </button>
            )}
          </div>
        </div>

        {/* Profile Content Body */}
        <div className="px-6 md:px-8 pb-6 pt-0 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-14 mb-4">
            <div className="flex items-end gap-4">
              <img
                src={user.avatar}
                alt={user.displayName}
                referrerPolicy="no-referrer"
                className="w-24 h-24 md:w-28 md:h-28 rounded-3xl bg-white border-4 border-white shadow-lg object-cover shrink-0"
              />
              <div className="mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">
                    {user.displayName}
                  </h1>
                  {user.role === 'admin' && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-md font-bold">Admin</span>
                  )}
                  {user.role === 'moderator' && (
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md font-bold">Moderator</span>
                  )}
                  {user.role === 'guest' && (
                    <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md font-bold">Tamu</span>
                  )}
                </div>
                <p className="text-xs text-slate-400 font-mono">@{user.username}</p>
              </div>
            </div>

            {/* Reputation Points Pill */}
            <div className="clay-card-flat px-4 py-2.5 bg-amber-50/70 border border-amber-200/60 flex items-center gap-3 shrink-0">
              <Trophy className="w-5 h-5 text-amber-500" />
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-700 block">Poin Reputasi Mentari</span>
                <span className="text-lg font-black text-slate-900 tabular-nums leading-none">
                  {user.karma} <span className="text-xs font-semibold text-slate-500">Poin</span>
                </span>
              </div>
            </div>
          </div>

          {/* Bio & Details */}
          <p className="text-xs md:text-sm text-slate-700 leading-relaxed max-w-2xl mt-2 font-normal">
            {user.bio || 'Belum ada bio singkat.'}
          </p>

          {/* Meta details strip: zero pill discipline */}
          <div className="mt-4 flex items-center gap-4 text-xs text-slate-500 flex-wrap">
            {user.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{user.location}</span>
              </span>
            )}
            {user.website && (
              <a
                href={user.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-amber-600 hover:underline"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{user.website.replace(/^https?:\/\//, '')}</span>
              </a>
            )}
            <span className="flex items-center gap-1 text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>Bergabung {new Date(user.joinedDate).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</span>
            </span>
          </div>

          {/* Badges strip */}
          {user.badges && user.badges.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-400 font-semibold mr-1">Lencana Kehormatan:</span>
              {user.badges.map((badge, idx) => (
                <span
                  key={idx}
                  className="clay-badge text-xs bg-amber-50 text-amber-800 px-2.5 py-1 rounded-xl font-bold flex items-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  <span>{badge}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 4-Column Metric Stat Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-slate-100 divide-x divide-slate-100 bg-slate-50/50">
          <div className="p-4 text-center">
            <span className="text-xs text-slate-500 block">Jumlah Postingan</span>
            <span className="text-xl font-black text-slate-900 tabular-nums">
              {userPosts.length}
            </span>
          </div>
          <div className="p-4 text-center">
            <span className="text-xs text-slate-500 block">Tanggapan Diberikan</span>
            <span className="text-xl font-black text-slate-900 tabular-nums">
              {user.answerCount || 0}
            </span>
          </div>
          <div className="p-4 text-center">
            <span className="text-xs text-slate-500 block">Solusi Terverifikasi</span>
            <span className="text-xl font-black text-emerald-600 tabular-nums">
              {userSolutions.length}
            </span>
          </div>
          <div className="p-4 text-center">
            <span className="text-xs text-slate-500 block">Peringkat Komunitas</span>
            <span className="text-xl font-black text-amber-600 tabular-nums">
              {user.role === 'admin' ? 'Pionir' : user.karma > 500 ? 'Top Tier' : 'Aktif'}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs: Postingan Saya vs Solusi */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('posts')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'posts'
              ? 'clay-btn-primary shadow-sm'
              : 'clay-btn-secondary text-slate-600'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Postingan Dibuat ({userPosts.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('solutions')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'solutions'
              ? 'clay-btn-primary shadow-sm'
              : 'clay-btn-secondary text-slate-600'
          }`}
        >
          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
          <span>Solusi Terbaik Diterima ({userSolutions.length})</span>
        </button>
      </div>

      {/* Tab Content List */}
      <div className="space-y-4">
        {activeTab === 'posts' ? (
          userPosts.length === 0 ? (
            <div className="clay-card p-8 text-center bg-white">
              <p className="text-xs text-slate-400">Pengguna belum mempublikasikan topik postingan.</p>
            </div>
          ) : (
            userPosts.map((post) => {
              const cat = categories.find(c => c.slug === post.categorySlug);
              return (
                <PostCard
                  key={post.id}
                  post={post}
                  category={cat}
                  onNavigate={onNavigate}
                  onPostUpdated={loadUserData}
                />
              );
            })
          )
        ) : (
          userSolutions.length === 0 ? (
            <div className="clay-card p-8 text-center bg-white">
              <p className="text-xs text-slate-400">Belum ada jawaban yang ditandai sebagai solusi terbaik oleh penanya.</p>
            </div>
          ) : (
            userSolutions.map((sol) => (
              <div
                key={sol.id}
                className="clay-card p-5 bg-white border-2 border-emerald-300/70 space-y-3"
              >
                <div className="flex items-center justify-between text-xs text-emerald-800 font-bold">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Jawaban Terbaik Terverifikasi</span>
                  </div>
                  <span className="text-slate-400 text-[11px] font-normal">
                    {new Date(sol.createdAt).toLocaleDateString('id-ID')}
                  </span>
                </div>
                <p className="text-xs md:text-sm text-slate-700 leading-relaxed whitespace-pre-line pl-2 border-l-2 border-emerald-300">
                  {sol.content}
                </p>
                <div className="text-xs text-slate-500">
                  <span>Diberikan {sol.likes} dukungan suka</span>
                </div>
              </div>
            ))
          )
        )}
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <EditProfileModal
          user={user}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSaved={(updated) => setUser(updated)}
        />
      )}
    </div>
  );
};
