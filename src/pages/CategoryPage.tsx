import React, { useState, useEffect } from 'react';
import { Category } from '../types/forum';
import { storageService, subscribeToStateChange } from '../services/storage';
import { 
  Layers, 
  MessageSquare, 
  Code, 
  GraduationCap, 
  Palette, 
  TrendingUp, 
  HelpCircle, 
  Coffee, 
  ArrowRight,
  Hash
} from 'lucide-react';

interface CategoryPageProps {
  onNavigate: (path: string) => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ onNavigate }) => {
  const [categories, setCategories] = useState<Category[]>(storageService.getCategories());

  useEffect(() => {
    const unsub = subscribeToStateChange(() => {
      setCategories(storageService.getCategories());
    });
    return () => unsub();
  }, []);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code':
        return <Code className="w-6 h-6 text-sky-500" />;
      case 'GraduationCap':
        return <GraduationCap className="w-6 h-6 text-emerald-500" />;
      case 'Palette':
        return <Palette className="w-6 h-6 text-rose-500" />;
      case 'TrendingUp':
        return <TrendingUp className="w-6 h-6 text-amber-500" />;
      case 'HelpCircle':
        return <HelpCircle className="w-6 h-6 text-purple-500" />;
      case 'Coffee':
        return <Coffee className="w-6 h-6 text-orange-500" />;
      default:
        return <Hash className="w-6 h-6 text-slate-500" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="clay-card p-6 md:p-8 bg-gradient-to-r from-amber-50/60 via-white to-orange-50/30 border-2 border-white shadow-lg">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-1.5">
            <Layers className="w-4 h-4 text-amber-600" />
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
              Kategori Komunitas
            </span>
          </div>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-slate-900 leading-tight">
            Eksplorasi Kategori Diskusi
          </h1>
          <p className="text-xs md:text-sm text-slate-600 mt-1.5 leading-relaxed">
            Temukan topik sesuai minat: teknologi koding, beasiswa, desain UI/UX, startup, atau bimbingan mentor.
          </p>
        </div>
      </div>

      {/* Grid of Categories (Clay Boxes) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => onNavigate(`kategori/${cat.slug}`)}
            className="clay-card p-6 bg-white hover:-translate-y-1 hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50/80 flex items-center justify-center clay-inset group-hover:scale-105 transition-transform">
                  {getCategoryIcon(cat.iconName)}
                </div>
                <span className="text-xs font-bold text-slate-500 tabular-nums bg-slate-100 px-2.5 py-1 rounded-xl">
                  {cat.threadCount} Topik
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                {cat.name}
              </h3>

              <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-3">
                {cat.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-600">
              <span>Buka Diskusi</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
