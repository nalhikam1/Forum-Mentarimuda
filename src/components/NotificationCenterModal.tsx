import React, { useState, useEffect } from 'react';
import { PushNotification } from '../types/forum';
import { storageService, subscribeToStateChange } from '../services/storage';
import { isSoundEnabled, setSoundEnabled } from '../utils/audio';
import { formatTimeAgo } from '../utils/slugify';
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  MessageSquare, 
  ThumbsUp, 
  CheckCircle, 
  Vote, 
  X 
} from 'lucide-react';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (slug: string) => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [notifications, setNotifications] = useState<PushNotification[]>([]);
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const currentUser = storageService.getCurrentUser();

  const loadNotifications = () => {
    setNotifications(storageService.getNotifications(currentUser.id));
  };

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  useEffect(() => {
    const unsub = subscribeToStateChange(() => {
      loadNotifications();
    });
    return () => unsub();
  }, []);

  if (!isOpen) return null;

  const handleToggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
  };

  const handleMarkAllRead = () => {
    storageService.markAllNotificationsRead(currentUser.id);
    loadNotifications();
  };

  const handleClear = () => {
    storageService.clearNotifications(currentUser.id);
    loadNotifications();
  };

  const handleSimulate = () => {
    storageService.simulateRandomInteraction();
    loadNotifications();
  };

  const displayedNotifs = filter === 'unread' 
    ? notifications.filter(n => !n.read) 
    : notifications;

  const getIcon = (type: string) => {
    switch (type) {
      case 'comment':
        return <MessageSquare className="w-4 h-4 text-sky-500" />;
      case 'upvote':
        return <ThumbsUp className="w-4 h-4 text-amber-500" />;
      case 'best_answer':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'poll_vote':
        return <Vote className="w-4 h-4 text-purple-500" />;
      default:
        return <Bell className="w-4 h-4 text-orange-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 md:p-6 bg-black/25 backdrop-blur-[2px] animate-fade-in">
      <div 
        className="clay-card w-full max-w-md bg-white border-2 border-amber-100/90 shadow-2xl overflow-hidden mt-14 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-amber-50/70 to-orange-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center clay-inset">
              <Bell className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base leading-tight">Pusat Push Notifikasi</h3>
              <p className="text-xs text-slate-500">Aktivitas real-time interaksi komunitas</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleToggleSound}
              title={soundOn ? 'Suara Notifikasi Aktif' : 'Suara Notifikasi Senyap'}
              className="p-2 rounded-xl text-slate-600 hover:text-amber-600 hover:bg-white transition-colors clay-card-flat"
            >
              {soundOn ? <Volume2 className="w-4 h-4 text-amber-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar & Live Simulation trigger */}
        <div className="px-4 py-2.5 bg-slate-50/60 border-b border-slate-100 flex items-center justify-between gap-2 flex-wrap">
          {/* Filter Segmented Control */}
          <div className="flex items-center gap-1 p-1 bg-slate-200/60 rounded-xl clay-inset">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                filter === 'all'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                filter === 'unread'
                  ? 'bg-white text-amber-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Belum Dibaca ({notifications.filter(n => !n.read).length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllRead}
              className="text-xs font-medium text-slate-600 hover:text-amber-600 flex items-center gap-1 transition-colors"
              title="Tandai semua dibaca"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Baca Semua</span>
            </button>
            <button
              onClick={handleClear}
              className="text-xs font-medium text-slate-400 hover:text-rose-600 p-1 transition-colors"
              title="Hapus riwayat notifikasi"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Push Simulator Banner — Hanya tampil untuk Admin */}
        {currentUser.role === 'admin' && (
          <div className="p-3 bg-amber-50/50 border-b border-amber-100/60 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Simulasi notifikasi (Admin):</span>
            </div>
            <button
              onClick={handleSimulate}
              className="clay-btn-primary px-3 py-1 text-[11px] font-bold shrink-0 shadow-sm"
            >
              + Tes Notifikasi
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
          {displayedNotifs.length === 0 ? (
            <div className="py-12 px-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 mx-auto flex items-center justify-center text-amber-500 mb-3 clay-inset">
                <Bell className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-slate-700 text-sm">Belum Ada Notifikasi</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Setiap ada balasan diskusi, suara polling, atau solusi terverifikasi, Anda akan langsung mendapatkan push notifikasi di sini.
              </p>
            </div>
          ) : (
            displayedNotifs.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  storageService.markNotificationRead(notif.id);
                  if (notif.targetSlug) {
                    onNavigate(`diskusi/${notif.targetSlug}`);
                    onClose();
                  }
                }}
                className={`p-3 rounded-xl transition-all cursor-pointer flex items-start gap-3 hover:bg-slate-50 ${
                  notif.read ? 'opacity-80 bg-white' : 'bg-amber-50/40 border border-amber-200/50 font-medium'
                }`}
              >
                {/* Avatar with type badge */}
                <div className="relative shrink-0">
                  <img
                    src={notif.senderAvatar}
                    alt={notif.senderName}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-xl bg-amber-100 object-cover shadow-sm"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-md bg-white border border-slate-200 flex items-center justify-center shadow-xs">
                    {getIcon(notif.type)}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-slate-800 line-clamp-1">{notif.title}</span>
                    <span className="text-[10px] text-slate-400 shrink-0 tabular-nums">
                      {formatTimeAgo(notif.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-0.5 leading-relaxed">
                    {notif.message}
                  </p>
                </div>

                {!notif.read && (
                  <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0 self-center" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
