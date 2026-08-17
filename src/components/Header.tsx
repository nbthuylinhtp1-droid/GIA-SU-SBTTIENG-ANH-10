import React from 'react';
import { Sparkles, Volume2, VolumeX, Award, BookOpen, Clock } from 'lucide-react';
import { sounds } from '../utils/audio';

interface HeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenHistory?: () => void;
  onGoHome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  soundEnabled,
  onToggleSound,
  onOpenHistory,
  onGoHome
}) => {
  return (
    <header className="w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Brand & Title */}
        <div 
          onClick={onGoHome} 
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-rose-400 to-indigo-300">
                THỬ THÁCH 60 GIÂY – LAB MASTER
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <Sparkles className="w-3 h-3" /> Global Success 10
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <span>Tác giả:</span>
              <span className="text-amber-300 font-bold tracking-wide">
                ThS. NGƯT NGUYỄN BÙI THÙY LINH
              </span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {onOpenHistory && (
            <button
              onClick={onOpenHistory}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              title="Lịch sử bài làm & Bảng vàng"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline">Bảng Thành Tích</span>
            </button>
          )}

          <button
            onClick={onToggleSound}
            className={`p-2 rounded-lg text-xs font-medium border transition-colors ${
              soundEnabled
                ? 'bg-slate-800 text-emerald-400 border-slate-700 hover:bg-slate-700'
                : 'bg-slate-800/60 text-slate-500 border-slate-800 hover:bg-slate-800'
            }`}
            title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
