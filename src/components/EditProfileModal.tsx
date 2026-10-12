import React, { useState } from 'react';
import { User } from '../types/forum';
import { storageService } from '../services/storage';
import { X, Sparkles, Check, Save } from 'lucide-react';

interface EditProfileModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSaved: (updatedUser: User) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  onSaved,
}) => {
  const [displayName, setDisplayName] = useState(user.displayName);
  const [bio, setBio] = useState(user.bio || '');
  const [location, setLocation] = useState(user.location || '');
  const [website, setWebsite] = useState(user.website || '');
  const [interestsStr, setInterestsStr] = useState((user.interests || []).join(', '));
  const [avatarSeed, setAvatarSeed] = useState(user.username || 'avatar');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const interests = interestsStr
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${avatarSeed}&backgroundColor=b6e3f4,ffd5dc,d1d4f9`;

    const updated = storageService.updateUserProfile(user.id, {
      displayName: displayName.trim(),
      bio: bio.trim(),
      location: location.trim(),
      website: website.trim(),
      interests,
      avatar: avatarUrl,
    });

    if (updated) {
      onSaved(updated);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div 
        className="clay-card w-full max-w-lg bg-white border-2 border-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-lg">Personalisasi Profil Pemuda</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Avatar customizer */}
          <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <img
              src={`https://api.dicebear.com/7.x/bottts/svg?seed=${avatarSeed}&backgroundColor=b6e3f4,ffd5dc,d1d4f9`}
              alt="Avatar Preview"
              referrerPolicy="no-referrer"
              className="w-14 h-14 rounded-2xl bg-white border-2 border-amber-200 shadow-sm object-cover shrink-0"
            />
            <div>
              <p className="text-xs font-bold text-slate-700">Avatar Karakter Robot Clay</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Ubah pola avatar sesuai karaktermu</p>
              <button
                type="button"
                onClick={() => setAvatarSeed('avatar_' + Math.floor(Math.random() * 99999))}
                className="mt-2 clay-btn-secondary px-3 py-1.5 text-xs flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Acak Avatar Baru</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nama Tampilan
            </label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 clay-inset text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Bio & Visi
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Ceritakan ketertarikan, proyek impian, atau moto hidupmu..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 clay-inset text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Lokasi / Kota
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="cth: Yogyakarta, Indonesia"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 clay-inset text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Website / Portofolio
              </label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://portofolio.me"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 clay-inset text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Topik & Minat (Pisahkan dengan koma)
            </label>
            <input
              type="text"
              value={interestsStr}
              onChange={(e) => setInterestsStr(e.target.value)}
              placeholder="React, Beasiswa, Desain, Startup, AI"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 clay-inset text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="clay-btn-secondary px-4 py-2.5 text-xs font-bold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="clay-btn-primary px-5 py-2.5 text-xs font-bold flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
