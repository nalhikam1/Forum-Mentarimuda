import React, { useState, useEffect } from 'react';
import { Post, Comment, Category } from '../types/forum';
import { storageService, subscribeToStateChange } from '../services/storage';
import { formatTimeAgo } from '../utils/slugify';
import { PollWidget } from '../components/PollWidget';
import { 
  ThumbsUp, 
  MessageSquare, 
  Eye, 
  Share2, 
  CheckCircle, 
  Pin, 
  Lock, 
  ArrowLeft, 
  Send, 
  Award, 
  Trash2, 
  Reply, 
  CornerDownRight, 
  HelpCircle, 
  Vote, 
  Check, 
  Smile, 
  Sparkles 
} from 'lucide-react';

interface PostDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
  onOpenAuth: () => void;
}

export const PostDetailPage: React.FC<PostDetailPageProps> = ({
  slug,
  onNavigate,
  onOpenAuth,
}) => {
  const [post, setPost] = useState<Post | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [copiedShare, setCopiedShare] = useState(false);

  const currentUser = storageService.getCurrentUser();

  const loadData = () => {
    const foundPost = storageService.getPostBySlug(slug);
    if (foundPost) {
      setPost(foundPost);
      const categories = storageService.getCategories();
      const cat = categories.find(c => c.slug === foundPost.categorySlug);
      setCategory(cat || null);
      setComments(storageService.getComments(foundPost.id));
    }
  };

  useEffect(() => {
    loadData();
    storageService.incrementPostViews(slug);
    const unsub = subscribeToStateChange(() => {
      loadData();
    });
    return () => unsub();
  }, [slug]);

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="clay-card p-12 bg-white">
          <h2 className="text-xl font-bold text-slate-800">Topik Tidak Ditemukan</h2>
          <p className="text-xs text-slate-500 mt-2">
            Topik dengan slug "{slug}" mungkin telah dipindahkan atau dihapus.
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

  const hasLiked = (post.likedByUserIds || []).includes(currentUser.id);
  const isAuthor = currentUser.id === post.authorId;
  const isAdminOrMod = currentUser.role === 'admin' || currentUser.role === 'moderator';
  const canMarkSolution = post.type === 'pertanyaan' && (isAuthor || isAdminOrMod);

  const handleLikePost = () => {
    storageService.toggleLikePost(post.id, currentUser.id);
    loadData();
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    if (post.isLocked) {
      alert('Topik ini telah dikunci oleh moderator dan tidak menerima komentar baru.');
      return;
    }

    storageService.addComment({
      postId: post.id,
      parentId: null,
      authorId: currentUser.id,
      authorName: currentUser.displayName,
      authorAvatar: currentUser.avatar,
      authorRole: currentUser.role,
      authorBadges: currentUser.badges,
      content: newCommentText.trim(),
    });

    setNewCommentText('');
    loadData();
  };

  const handleAddReply = (parentId: string) => {
    if (!replyText.trim()) return;

    if (post.isLocked) {
      alert('Topik ini terkunci.');
      return;
    }

    storageService.addComment({
      postId: post.id,
      parentId,
      authorId: currentUser.id,
      authorName: currentUser.displayName,
      authorAvatar: currentUser.avatar,
      authorRole: currentUser.role,
      authorBadges: currentUser.badges,
      content: replyText.trim(),
    });

    setReplyText('');
    setReplyingToCommentId(null);
    loadData();
  };

  const handleMarkSolution = (commentId: string) => {
    storageService.markAcceptedSolution(post.id, commentId);
    loadData();
  };

  const handleDeleteComment = (commentId: string) => {
    if (confirm('Hapus komentar ini?')) {
      storageService.deleteComment(commentId);
      loadData();
    }
  };

  // Group top-level and nested comments
  const topLevelComments = comments.filter(c => !c.parentId);
  const getReplies = (parentId: string) => comments.filter(c => c.parentId === parentId);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back button */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => onNavigate('')}
          className="clay-btn-secondary px-3.5 py-1.5 text-xs font-semibold flex items-center gap-1.5 text-slate-700"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Forum</span>
        </button>

        {category && (
          <button
            onClick={() => onNavigate(`kategori/${category.slug}`)}
            className="text-xs font-bold text-amber-600 hover:underline"
          >
            Kategori: {category.name}
          </button>
        )}
      </div>

      {/* Main Post Article */}
      <article className="clay-card p-6 md:p-8 bg-white border-2 border-white shadow-xl relative">
        {/* Top Metadata Row: Zero-pill discipline */}
        <div className="flex items-center justify-between gap-3 text-xs text-slate-500 mb-4 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1">
              {post.type === 'pertanyaan' && <HelpCircle className="w-3.5 h-3.5" />}
              {post.type === 'polling' && <Vote className="w-3.5 h-3.5" />}
              {post.type === 'diskusi' && <MessageSquare className="w-3.5 h-3.5" />}
              <span>{post.type}</span>
            </span>

            <span aria-hidden="true">·</span>

            {category && (
              <span className="font-semibold text-slate-700">
                {category.name}
              </span>
            )}

            <span aria-hidden="true">·</span>

            <span className="tabular-nums text-slate-400">
              {formatTimeAgo(post.createdAt)}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {post.isPinned && (
              <span className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                <Pin className="w-3.5 h-3.5 text-amber-600" />
                <span>Disematkan</span>
              </span>
            )}
            {post.isSolved && (
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Solusi Diterima</span>
              </span>
            )}
            {post.isLocked && (
              <span className="flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                <Lock className="w-3.5 h-3.5" />
                <span>Terkunci</span>
              </span>
            )}

            {/* Admin-only quick actions */}
            {currentUser.role === 'admin' && (
              <div className="flex items-center gap-1 pl-2 border-l border-slate-200">
                <button
                  onClick={() => {
                    storageService.togglePinPost(post.id);
                    loadData();
                  }}
                  className={`p-1.5 rounded-lg border text-xs font-bold transition-colors ${
                    post.isPinned ? 'bg-amber-100 border-amber-300 text-amber-700' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                  }`}
                  title={post.isPinned ? 'Lepas Sematan' : 'Sematkan Topik'}
                >
                  <Pin className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    storageService.toggleLockPost(post.id);
                    loadData();
                  }}
                  className={`p-1.5 rounded-lg border text-xs font-bold transition-colors ${
                    post.isLocked ? 'bg-slate-200 border-slate-300 text-slate-800' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                  }`}
                  title={post.isLocked ? 'Buka Kunci' : 'Kunci Komentar'}
                >
                  <Lock className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm('Hapus topik ini secara permanen?')) {
                      storageService.deletePost(post.id);
                      onNavigate('');
                    }
                  }}
                  className="p-1.5 rounded-lg border border-rose-200 text-rose-500 hover:bg-rose-50"
                  title="Hapus Topik (Admin)"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Title */}
        <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-slate-900 leading-tight">
          {post.title}
        </h1>

        {/* Author card strip */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap">
          <div 
            onClick={() => onNavigate(`u/${post.authorName.toLowerCase().replace(/[\s\(\)]+/g, '_')}`)}
            className="flex items-center gap-3 cursor-pointer hover:opacity-85"
          >
            <img
              src={post.authorAvatar}
              alt={post.authorName}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-2xl bg-amber-50 object-cover shadow-2xs border border-white"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">{post.authorName}</span>
                {post.authorRole === 'admin' && (
                  <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold">Admin</span>
                )}
                {post.authorRole === 'moderator' && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold">Mod</span>
                )}
                {post.authorRole === 'guest' && (
                  <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-bold">Tamu</span>
                )}
              </div>
              <span className="text-xs text-slate-400">
                Ditayangkan {new Date(post.createdAt).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400 tabular-nums">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              <span>{post.views} dilihat</span>
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{post.commentCount} tanggapan</span>
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="mt-6 text-sm md:text-base text-slate-800 leading-relaxed space-y-4 whitespace-pre-line font-normal">
          {post.content}
        </div>

        {/* Poll Widget if type is polling */}
        {post.type === 'polling' && post.pollData && (
          <div className="mt-6">
            <PollWidget
              postId={post.id}
              pollData={post.pollData}
              onVoted={loadData}
            />
          </div>
        )}

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mt-6 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400 font-medium">Tag:</span>
            {post.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-xs text-amber-700 bg-amber-50/70 border border-amber-200/60 px-2 py-0.5 rounded-lg font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Action Bar: Like, Share */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <button
              onClick={handleLikePost}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                hasLiked
                  ? 'clay-btn-primary shadow-sm text-white'
                  : 'clay-btn-secondary text-slate-700 hover:text-amber-600'
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{post.likes} Suka</span>
            </button>

            <button
              onClick={handleShare}
              className="clay-btn-secondary px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 text-slate-700"
            >
              {copiedShare ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Tautan Disalin!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-slate-500" />
                  <span>Bagikan</span>
                </>
              )}
            </button>
          </div>

          <div className="text-xs text-slate-400">
            {post.isSolved && (
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                <span>Pertanyaan memiliki solusi terverifikasi</span>
              </span>
            )}
          </div>
        </div>
      </article>

      {/* Comment Section Header */}
      <div className="pt-2">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-amber-600" />
            <span>Tanggapan & Diskusi ({comments.length})</span>
          </h2>
          <button
            onClick={onOpenAuth}
            className="text-xs font-semibold text-slate-500 hover:text-amber-600 flex items-center gap-1"
          >
            <Smile className="w-3.5 h-3.5 text-amber-500" />
            <span>Mengomentari sebagai: <b>{currentUser.displayName}</b> (Ganti)</span>
          </button>
        </div>

        {/* Comment Input Box */}
        {!post.isLocked ? (
          <form onSubmit={handleAddComment} className="clay-card p-4.5 bg-white mb-6">
            <div className="flex items-start gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.displayName}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-2xl bg-amber-50 object-cover border border-white shadow-xs shrink-0"
              />
              <div className="flex-1 min-w-0">
                <textarea
                  rows={3}
                  required
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder={
                    post.type === 'pertanyaan'
                      ? 'Tulis jawaban atau saran solusi yang membantu...'
                      : 'Tulis komentar atau pandangan Anda di sini...'
                  }
                  className="w-full p-3 rounded-xl border border-slate-200 clay-inset text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />

                <div className="mt-2.5 flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-[11px] text-slate-400">
                    Mendukung format paragraf & apresiasi solusi komunitas
                  </span>
                  <button
                    type="submit"
                    className="clay-btn-primary px-4 py-2 text-xs font-bold flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim Tanggapan</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div className="clay-card p-4 bg-slate-50 border border-slate-200 text-center text-xs text-slate-500 mb-6">
            Topik ini telah dikunci oleh moderator komunitas. Komentar baru ditutup.
          </div>
        )}

        {/* Comments Thread List */}
        <div className="space-y-4">
          {topLevelComments.length === 0 ? (
            <div className="clay-card p-8 text-center bg-white">
              <p className="text-xs text-slate-400 font-medium">
                Belum ada tanggapan. Jadilah orang pertama yang berbagi opini di topik ini!
              </p>
            </div>
          ) : (
            topLevelComments.map((comment) => {
              const replies = getReplies(comment.id);
              const commentLikes = (comment.likedByUserIds || []).includes(currentUser.id);

              return (
                <div
                  key={comment.id}
                  className={`clay-card p-5 transition-all ${
                    comment.isAcceptedSolution
                      ? 'border-2 border-emerald-400 bg-emerald-50/20 shadow-md'
                      : 'bg-white'
                  }`}
                >
                  {/* Accepted solution ribbon */}
                  {comment.isAcceptedSolution && (
                    <div className="mb-3 p-2 bg-emerald-100/70 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800 font-bold">
                      <div className="flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-emerald-600" />
                        <span>Jawaban Terbaik (Solusi Terverifikasi)</span>
                      </div>
                      <span className="text-[10px] text-emerald-700 bg-white px-2 py-0.5 rounded-md font-extrabold shadow-2xs">
                        +50 Poin Mentari
                      </span>
                    </div>
                  )}

                  {/* Comment Author Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={comment.authorAvatar}
                        alt={comment.authorName}
                        referrerPolicy="no-referrer"
                        className="w-9 h-9 rounded-xl bg-amber-50 object-cover border border-white shadow-2xs"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">
                            {comment.authorName}
                          </span>
                          {comment.authorRole === 'admin' && (
                            <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.2 rounded font-bold">Admin</span>
                          )}
                          {comment.authorRole === 'moderator' && (
                            <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.2 rounded font-bold">Mod</span>
                          )}
                          {comment.authorRole === 'guest' && (
                            <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.2 rounded font-bold">Tamu</span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 tabular-nums">
                          {formatTimeAgo(comment.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Mark Solution Button */}
                      {canMarkSolution && !comment.isAcceptedSolution && (
                        <button
                          onClick={() => handleMarkSolution(comment.id)}
                          className="clay-btn-secondary px-2.5 py-1 text-[11px] font-bold text-emerald-700 hover:bg-emerald-50 flex items-center gap-1 border-emerald-200"
                          title="Tandai komentar ini sebagai jawaban terbaik"
                        >
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Tandai Solusi</span>
                        </button>
                      )}

                      {/* Delete comment if author or admin */}
                      {(comment.authorId === currentUser.id || isAdminOrMod) && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="p-1 text-slate-300 hover:text-rose-600 transition-colors"
                          title="Hapus komentar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Comment Body */}
                  <div className="mt-3 text-xs md:text-sm text-slate-700 leading-relaxed whitespace-pre-line pl-12">
                    {comment.content}
                  </div>

                  {/* Comment Action Footer */}
                  <div className="mt-3 pl-12 flex items-center gap-3">
                    <button
                      onClick={() => {
                        storageService.toggleLikeComment(comment.id, currentUser.id);
                        loadData();
                      }}
                      className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg transition-colors ${
                        commentLikes
                          ? 'clay-btn-primary text-white font-bold'
                          : 'clay-btn-secondary text-slate-600 hover:text-amber-600'
                      }`}
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span className="tabular-nums">{comment.likes}</span>
                    </button>

                    <button
                      onClick={() => setReplyingToCommentId(replyingToCommentId === comment.id ? null : comment.id)}
                      className="text-xs text-slate-500 hover:text-amber-600 font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Reply className="w-3 h-3" />
                      <span>Balas</span>
                    </button>
                  </div>

                  {/* Reply Input Box */}
                  {replyingToCommentId === comment.id && (
                    <div className="mt-3 pl-12 pt-3 border-t border-slate-100 flex items-start gap-2">
                      <CornerDownRight className="w-4 h-4 text-slate-400 mt-2 shrink-0" />
                      <div className="flex-1">
                        <textarea
                          rows={2}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder={`Balas ${comment.authorName}...`}
                          className="w-full p-2.5 text-xs rounded-xl border border-slate-200 clay-inset text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                        <div className="mt-2 flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setReplyingToCommentId(null)}
                            className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1"
                          >
                            Batal
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddReply(comment.id)}
                            className="clay-btn-primary px-3 py-1 text-xs font-bold"
                          >
                            Kirim Balasan
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Nested Replies List */}
                  {replies.length > 0 && (
                    <div className="mt-4 pl-10 space-y-3 border-l-2 border-amber-200/60 ml-4">
                      {replies.map((reply) => {
                        const replyLikes = (reply.likedByUserIds || []).includes(currentUser.id);
                        return (
                          <div key={reply.id} className="p-3 rounded-xl bg-slate-50/80 border border-slate-100">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <img
                                  src={reply.authorAvatar}
                                  alt={reply.authorName}
                                  referrerPolicy="no-referrer"
                                  className="w-6 h-6 rounded-lg bg-white object-cover"
                                />
                                <span className="text-xs font-bold text-slate-800">
                                  {reply.authorName}
                                </span>
                                <span className="text-[10px] text-slate-400 tabular-nums">
                                  {formatTimeAgo(reply.createdAt)}
                                </span>
                              </div>

                              {(reply.authorId === currentUser.id || isAdminOrMod) && (
                                <button
                                  onClick={() => handleDeleteComment(reply.id)}
                                  className="p-1 text-slate-300 hover:text-rose-600"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>

                            <p className="mt-1.5 text-xs text-slate-700 pl-8 leading-relaxed">
                              {reply.content}
                            </p>

                            <div className="mt-2 pl-8">
                              <button
                                onClick={() => {
                                  storageService.toggleLikeComment(reply.id, currentUser.id);
                                  loadData();
                                }}
                                className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md ${
                                  replyLikes ? 'text-amber-600 font-bold' : 'text-slate-500 hover:text-amber-600'
                                }`}
                              >
                                <ThumbsUp className="w-2.5 h-2.5" />
                                <span className="tabular-nums">{reply.likes}</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
