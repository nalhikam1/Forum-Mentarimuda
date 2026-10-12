import React, { useState } from 'react';
import { PostType, Category } from '../types/forum';
import { storageService } from '../services/storage';
import { slugify } from '../utils/slugify';
import { 
  PlusCircle, 
  HelpCircle, 
  Vote, 
  MessageSquare, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Sparkles, 
  Tag, 
  Check 
} from 'lucide-react';

interface CreatePostPageProps {
  onNavigate: (path: string) => void;
  onOpenAuth: () => void;
}

export const CreatePostPage: React.FC<CreatePostPageProps> = ({
  onNavigate,
  onOpenAuth,
}) => {
  const categories = storageService.getCategories();
  const currentUser = storageService.getCurrentUser();

  const [postType, setPostType] = useState<PostType>('diskusi');
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>(categories[0]?.slug || 'teknologi-koding');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsStr, setTagsStr] = useState('');

  // Poll state
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);

  const autoSlug = slugify(title);

  const handleAddPollOption = () => {
    if (pollOptions.length < 6) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const handleRemovePollOption = (idx: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== idx));
    }
  };

  const handlePollOptionChange = (idx: number, val: string) => {
    const updated = [...pollOptions];
    updated[idx] = val;
    setPollOptions(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const tags = tagsStr
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    let pollData = undefined;
    if (postType === 'polling') {
      const validOptions = pollOptions.map(o => o.trim()).filter(Boolean);
      if (validOptions.length < 2) {
        alert('Harap isi minimal 2 pilihan polling.');
        return;
      }
      pollData = {
        question: pollQuestion.trim() || title.trim(),
        totalVotes: 0,
        options: validOptions.map((opt, i) => ({
          id: `opt-${Date.now()}-${i}`,
          text: opt,
          voteCount: 0,
          voterIds: [],
        })),
      };
    }

    const created = storageService.createPost({
      slug: `${autoSlug}-${Date.now().toString().slice(-4)}`,
      title: title.trim(),
      content: content.trim(),
      type: postType,
      categorySlug: selectedCategorySlug,
      tags: tags.length > 0 ? tags : ['Mentarimuda'],
      authorId: currentUser.id,
      authorName: currentUser.displayName,
      authorAvatar: currentUser.avatar,
      authorRole: currentUser.role,
      pollData,
    });

    onNavigate(`diskusi/${created.slug}`);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back button */}
      <button
        onClick={() => onNavigate('')}
        className="clay-btn-secondary px-3.5 py-1.5 text-xs font-semibold flex items-center gap-1.5 text-slate-700"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Batal & Kembali</span>
      </button>

      {/* Form Card */}
      <div className="clay-card p-6 md:p-8 bg-white border-2 border-white shadow-xl">
        <div className="flex items-center justify-between gap-3 pb-5 border-b border-slate-100 flex-wrap">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900">
              Buat Topik Baru di Mentarimuda
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Bagikan pengetahuan, ajukan pertanyaan solutif, atau buat polling suara
            </p>
          </div>

          <div 
            onClick={onOpenAuth}
            className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:border-amber-300"
            title="Klik untuk ganti akun"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.displayName}
              referrerPolicy="no-referrer"
              className="w-7 h-7 rounded-lg bg-amber-50 object-cover"
            />
            <span className="text-xs font-bold text-slate-700 truncate max-w-[120px]">
              {currentUser.displayName}
            </span>
            <span className="text-[10px] text-slate-400 capitalize">
              ({currentUser.role})
            </span>
          </div>
        </div>

        {currentUser.role === 'guest' && (
          <div className="mt-4 p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between gap-3 flex-wrap">
            <p className="text-xs text-amber-900 leading-snug">
              Anda sedang dalam <b>Mode Tamu</b>. Postingan akan memiliki label [Tamu]. Ingin memiliki nama profil permanen atau login admin?
            </p>
            <button
              type="button"
              onClick={onOpenAuth}
              className="clay-btn-primary px-3 py-1.5 text-xs font-bold shrink-0"
            >
              Masuk / Daftar Akun
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Post Type Selector (Clay Tabs) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Pilih Tipe Postingan
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setPostType('diskusi')}
                className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-1.5 ${
                  postType === 'diskusi'
                    ? 'border-amber-400 bg-amber-50/60 shadow-sm font-bold text-amber-900'
                    : 'border-slate-100 bg-slate-50 text-slate-600 hover:bg-white'
                }`}
              >
                <MessageSquare className="w-5 h-5 text-amber-600" />
                <span className="text-xs font-bold">Diskusi</span>
                <span className="text-[10px] text-slate-400 hidden sm:inline">Ide & opini</span>
              </button>

              <button
                type="button"
                onClick={() => setPostType('pertanyaan')}
                className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-1.5 ${
                  postType === 'pertanyaan'
                    ? 'border-sky-400 bg-sky-50/60 shadow-sm font-bold text-sky-900'
                    : 'border-slate-100 bg-slate-50 text-slate-600 hover:bg-white'
                }`}
              >
                <HelpCircle className="w-5 h-5 text-sky-600" />
                <span className="text-xs font-bold">Q&A</span>
                <span className="text-[10px] text-slate-400 hidden sm:inline">Tanya solusi</span>
              </button>

              <button
                type="button"
                onClick={() => setPostType('polling')}
                className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-1.5 ${
                  postType === 'polling'
                    ? 'border-purple-400 bg-purple-50/60 shadow-sm font-bold text-purple-900'
                    : 'border-slate-100 bg-slate-50 text-slate-600 hover:bg-white'
                }`}
              >
                <Vote className="w-5 h-5 text-purple-600" />
                <span className="text-xs font-bold">Polling</span>
                <span className="text-[10px] text-slate-400 hidden sm:inline">Voting suara</span>
              </button>
            </div>
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Kategori Forum
            </label>
            <select
              value={selectedCategorySlug}
              onChange={(e) => setSelectedCategorySlug(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 clay-inset text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name} ({cat.threadCount} Topik)
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Judul Topik
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                postType === 'pertanyaan'
                  ? 'cth: Bagaimana cara lolos tahap interview teknis di startup unicorn?'
                  : postType === 'polling'
                  ? 'cth: Polling: Apakah kamu berencana melanjutkan studi S2 dalam 2 tahun ke depan?'
                  : 'cth: Pelajaran berharga setelah merilis open-source tool pertama saya'
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 clay-inset text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium"
            />
            {autoSlug && (
              <p className="text-[11px] text-slate-400 mt-1 font-mono">
                Slug URL: /diskusi/{autoSlug}...
              </p>
            )}
          </div>

          {/* Polling Options Builder (Only if Polling) */}
          {postType === 'polling' && (
            <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200/70 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                  <Vote className="w-4 h-4 text-purple-600" />
                  <span>Daftar Pilihan Polling</span>
                </span>
                <span className="text-[11px] text-purple-700 font-medium">
                  {pollOptions.length} / 6 Pilihan
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Pertanyaan Spesifik Polling (Opsional jika sama dengan judul)
                </label>
                <input
                  type="text"
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  placeholder={title || 'Tulis pertanyaan yang akan divote...'}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div className="space-y-2">
                {pollOptions.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 w-5 text-center">
                      {idx + 1}.
                    </span>
                    <input
                      type="text"
                      required
                      value={opt}
                      onChange={(e) => handlePollOptionChange(idx, e.target.value)}
                      placeholder={`Pilihan ${idx + 1}...`}
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                    {pollOptions.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemovePollOption(idx)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {pollOptions.length < 6 && (
                <button
                  type="button"
                  onClick={handleAddPollOption}
                  className="clay-btn-secondary px-3 py-1.5 text-xs font-bold text-purple-700 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Opsi Pilihan</span>
                </button>
              )}
            </div>
          )}

          {/* Content Body */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {postType === 'pertanyaan' ? 'Detail Pertanyaan & Konteks' : 'Isi Diskusi'}
            </label>
            <textarea
              rows={6}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Jelaskan latar belakang, konteks, pertanyaan, atau pandangan Anda dengan rinci agar anggota lain mudah memahami..."
              className="w-full px-3.5 py-3 rounded-xl border border-slate-200 clay-inset text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 leading-relaxed font-normal"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              <span>Tag / Topik Kata Kunci (Pisahkan dengan koma)</span>
            </label>
            <input
              type="text"
              value={tagsStr}
              onChange={(e) => setTagsStr(e.target.value)}
              placeholder="Koding, Beasiswa, UIUX, Karir, Startup"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 clay-inset text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => onNavigate('')}
              className="clay-btn-secondary px-5 py-2.5 text-xs font-bold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="clay-btn-primary px-6 py-2.5 text-xs font-bold flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Tayangkan Topik Sekarang</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
