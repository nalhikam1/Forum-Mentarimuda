import React, { useEffect, useState } from 'react';
import { PushNotification } from '../types/forum';
import { subscribeToStateChange, storageService } from '../services/storage';
import { playNotificationChime } from '../utils/audio';
import { Bell, MessageSquare, ThumbsUp, CheckCircle, Vote, X, ExternalLink } from 'lucide-react';

interface NotificationToastProps {
  onNavigate: (slug: string) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ onNavigate }) => {
  const [activeToast, setActiveToast] = useState<PushNotification | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToStateChange((event) => {
      const { eventType, payload } = event.detail || {};
      if (eventType === 'push_notification' && payload) {
        const notif = payload as PushNotification;
        const currentUser = storageService.getCurrentUser();
        // Check if recipient is current user or all
        if (notif.recipientId === currentUser.id || notif.recipientId === 'all') {
          playNotificationChime();
          setActiveToast(notif);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!activeToast) return;
    const timer = setTimeout(() => {
      setActiveToast(null);
    }, 6500);
    return () => clearTimeout(timer);
  }, [activeToast]);

  if (!activeToast) return null;

  const getIcon = () => {
    switch (activeToast.type) {
      case 'comment':
        return <MessageSquare className="w-5 h-5 text-sky-500" />;
      case 'upvote':
        return <ThumbsUp className="w-5 h-5 text-amber-500" />;
      case 'best_answer':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'poll_vote':
        return <Vote className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-orange-500" />;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-bounce-in transition-all">
      <div className="clay-card p-4 border-2 border-amber-200/80 bg-white/95 backdrop-blur-sm shadow-2xl flex items-start gap-3">
        {/* Clay Avatar / Icon Bubble */}
        <div className="relative shrink-0">
          <img
            src={activeToast.senderAvatar}
            alt={activeToast.senderName}
            referrerPolicy="no-referrer"
            className="w-11 h-11 rounded-2xl bg-amber-50 border-2 border-white shadow-sm object-cover"
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-white border border-slate-100 flex items-center justify-center shadow-sm">
            {getIcon()}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider">
              Push Notifikasi Interaktif
            </span>
            <button
              onClick={() => setActiveToast(null)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded-md hover:bg-slate-100 transition-colors"
              aria-label="Tutup notifikasi"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <h4 className="text-sm font-bold text-slate-800 line-clamp-1 mt-0.5">
            {activeToast.title}
          </h4>
          <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
            {activeToast.message}
          </p>

          <div className="mt-2.5 flex items-center gap-2">
            <button
              onClick={() => {
                storageService.markNotificationRead(activeToast.id);
                if (activeToast.targetSlug) {
                  onNavigate(`diskusi/${activeToast.targetSlug}`);
                }
                setActiveToast(null);
              }}
              className="clay-btn-primary px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5"
            >
              <span>Lihat Detail</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                storageService.markNotificationRead(activeToast.id);
                setActiveToast(null);
              }}
              className="text-xs font-medium text-slate-500 hover:text-slate-800 px-2 py-1 transition-colors"
            >
              Tandai Dibaca
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
