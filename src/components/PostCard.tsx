import React from 'react';
import { Post, Category } from '../types/forum';
import { storageService } from '../services/storage';
import { formatTimeAgo } from '../utils/slugify';
import { PollWidget } from './PollWidget';
import { 
  MessageSquare, 
  ThumbsUp, 
  Eye, 
  Pin, 
  Lock, 
  CheckCircle, 
  Vote, 
  HelpCircle, 
  Share2 
} from 'lucide-react';

interface PostCardProps {
  post: Post;
  category?: Category;
  onNavigate: (slug: string) => void;
  onPostUpdated?: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  category,
  onNavigate,
  onPostUpdated,
}) => {
  const currentUser = storageService.getCurrentUser();
  const hasLiked = (post.likedByUserIds || []).includes(currentUser.id);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    storageService.toggleLikePost(post.id, currentUser.id);
    if (onPostUpdated) onPostUpdated();
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/#/diskusi/${post.slug}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      alert('Tautan diskusi berhasil disalin ke clipboard!');
    }
  };

  const getTypeLabel = () => {
    switch (post.type) {
      case 'pertanyaan':
        return {
          icon: <HelpCircle className="w-3.5 h-3.5 text-sky-600" />,
          label: 'Pertanyaan',
          textColor: 'text-sky-700',
        };
      case 'polling':
        return {
          icon: <Vote className="w-3.5 h-3.5 text-purple-600" />,
          label: 'Polling',
          textColor: 'text-purple-700',
        };
      default:
        return {
          icon: <MessageSquare className="w-3.5 h-3.5 text-amber-600" />,
          label: 'Diskusi',
          textColor: 'text-amber-700',
        };
    }
  };

  const typeInfo = getTypeLabel();

  return (
    <div
      onClick={() => onNavigate(`diskusi/${post.slug}`)}
      className="clay-card p-5 md:p-6 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl cursor-pointer group relative"
    >
      {/* Top Metadata Row: Zero-pill discipline (clean unboxed text with · separators) */}
      <div className="flex items-center justify-between gap-3 text-xs text-slate-500 mb-2.5 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 font-bold">
            {typeInfo.icon}
            <span className={typeInfo.textColor}>{typeInfo.label}</span>
          </div>

          <span aria-hidden="true">·</span>

          {category && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onNavigate(`kategori/${category.slug}`);
              }}
              className="font-medium text-slate-700 hover:text-amber-600 hover:underline transition-colors cursor-pointer"
            >
              {category.name}
            </span>
          )}

          <span aria-hidden="true">·</span>

          <span className="tabular-nums text-slate-400">
            {formatTimeAgo(post.createdAt)}
          </span>
        </div>

        {/* Status flags */}
        <div className="flex items-center gap-2">
          {post.isPinned && (
            <span className="flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/80">
              <Pin className="w-3 h-3 text-amber-600" />
              <span>Disematkan</span>
            </span>
          )}
          {post.isSolved && (
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80">
              <CheckCircle className="w-3 h-3 text-emerald-600" />
              <span>Terjawab</span>
            </span>
          )}
          {post.isLocked && (
            <span className="flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
              <Lock className="w-3 h-3" />
              <span>Terkunci</span>
            </span>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-base md:text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors leading-snug line-clamp-2">
        {post.title}
      </h3>

      {/* Snippet Content */}
      <p className="text-xs md:text-sm text-slate-600 line-clamp-2 mt-2 leading-relaxed font-normal">
        {post.content}
      </p>

      {/* Poll Inline Preview if Polling */}
      {post.type === 'polling' && post.pollData && (
        <div className="mt-3">
          <PollWidget
            postId={post.id}
            pollData={post.pollData}
            compact={true}
            onVoted={onPostUpdated}
          />
        </div>
      )}

      {/* Author & Interaction Bar */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap">
        {/* Author info */}
        <div 
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(`u/${post.authorName.toLowerCase().replace(/[\s\(\)]+/g, '_')}`);
          }}
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
        >
          <img
            src={post.authorAvatar}
            alt={post.authorName}
            referrerPolicy="no-referrer"
            className="w-7 h-7 rounded-xl bg-amber-50 object-cover shadow-xs border border-white"
          />
          <div className="text-xs">
            <span className="font-semibold text-slate-800">{post.authorName}</span>
            {post.authorRole === 'admin' && (
              <span className="ml-1.5 text-[10px] text-red-600 font-bold">Admin</span>
            )}
            {post.authorRole === 'moderator' && (
              <span className="ml-1.5 text-[10px] text-emerald-600 font-bold">Mod</span>
            )}
            {post.authorRole === 'guest' && (
              <span className="ml-1.5 text-[10px] text-slate-500 font-bold">Tamu</span>
            )}
          </div>
        </div>

        {/* Stats & Actions */}
        <div className="flex items-center gap-3 text-xs text-slate-500 tabular-nums">
          {/* Like Button */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl transition-all ${
              hasLiked
                ? 'clay-btn-primary text-white font-bold'
                : 'clay-btn-secondary text-slate-600 hover:text-amber-600'
            }`}
          >
            <ThumbsUp className={`w-3.5 h-3.5 ${hasLiked ? 'text-white' : 'text-slate-500'}`} />
            <span>{post.likes}</span>
          </button>

          {/* Comments count */}
          <div className="flex items-center gap-1 text-slate-500 font-medium">
            <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
            <span>{post.commentCount}</span>
          </div>

          {/* Views */}
          <div className="flex items-center gap-1 text-slate-400 font-medium hidden sm:flex">
            <Eye className="w-3.5 h-3.5 text-slate-300" />
            <span>{post.views}</span>
          </div>

          {/* Share */}
          <button
            onClick={handleShare}
            className="p-1 text-slate-400 hover:text-amber-600 rounded-lg hover:bg-slate-50 transition-colors"
            title="Salin tautan diskusi"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
