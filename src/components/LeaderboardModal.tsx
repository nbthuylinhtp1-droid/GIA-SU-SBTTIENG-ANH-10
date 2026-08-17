import React from 'react';
import { QuizResult } from '../types';
import { Trophy, X, Calendar, Clock, Award, Trash2 } from 'lucide-react';
import { DIFFICULTY_LABELS } from '../data/questions';

interface LeaderboardModalProps {
  history: QuizResult[];
  onClose: () => void;
  onClearHistory: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  history,
  onClose,
  onClearHistory
}) => {
  // Sort by score descending
  const sortedHistory = [...history].sort((a, b) => b.score - a.score);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-scaleUp">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-800/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">
                BẢNG VÀNG THÀNH TÍCH 60 GIÂY
              </h3>
              <p className="text-xs text-slate-400">
                Lịch sử ôn tập & thành tích học sinh
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List Content */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3 custom-scrollbar">
          {sortedHistory.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              <Award className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <p>Chưa có lượt thử thách nào được lưu.</p>
              <p className="text-xs text-slate-500 mt-1">Hãy tham gia thử thách 60 giây để ghi tên vào bảng vàng!</p>
            </div>
          ) : (
            sortedHistory.map((item, idx) => (
              <div
                key={item.id}
                className={`p-3.5 sm:p-4 rounded-xl border flex items-center justify-between gap-3 ${
                  idx === 0
                    ? 'bg-amber-950/30 border-amber-500/50 shadow-md shadow-amber-500/10'
                    : idx === 1
                    ? 'bg-slate-800/60 border-slate-600/50'
                    : idx === 2
                    ? 'bg-amber-900/20 border-amber-700/40'
                    : 'bg-slate-800/30 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-xl font-black text-sm flex items-center justify-center flex-shrink-0 ${
                    idx === 0
                      ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30'
                      : idx === 1
                      ? 'bg-slate-300 text-slate-900'
                      : idx === 2
                      ? 'bg-amber-700 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {idx + 1}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-white text-sm truncate">
                        {item.studentName}
                      </span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                        {item.className}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {item.unitTitle} • {DIFFICULTY_LABELS[item.difficulty]?.label || 'Tổng hợp'}
                    </p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="text-base sm:text-lg font-black text-emerald-400">
                    {item.score} <span className="text-xs text-slate-400">pts</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">
                    {item.correctCount}/{item.totalQuestionsAnswered} đúng ({item.accuracyRate}%)
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        {sortedHistory.length > 0 && (
          <div className="p-3.5 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">
              Tổng số lượt đã làm: <strong className="text-white">{sortedHistory.length}</strong>
            </span>
            <button
              onClick={onClearHistory}
              className="flex items-center gap-1 text-rose-400 hover:text-rose-300 transition-colors font-semibold"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa lịch sử</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
