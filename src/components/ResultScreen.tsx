import React, { useState, useEffect } from 'react';
import { QuizResult, DifficultyLevel } from '../types';
import confetti from 'canvas-confetti';
import { DIFFICULTY_LABELS } from '../data/questions';
import { 
  Trophy, 
  RotateCcw, 
  Settings, 
  Printer, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Zap, 
  Award, 
  Volume2, 
  Share2, 
  BookOpen,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { sounds } from '../utils/audio';

interface ResultScreenProps {
  result: QuizResult;
  onRetakeQuiz: () => void;
  onNewQuiz: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  result,
  onRetakeQuiz,
  onNewQuiz
}) => {
  const [filter, setFilter] = useState<'all' | 'wrong' | 'correct'>('all');
  const [expandedDetails, setExpandedDetails] = useState<boolean>(true);

  // Trigger celebration confetti
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  }, []);

  const filteredAnswers = result.answers.filter((item) => {
    if (filter === 'wrong') return !item.isCorrect;
    if (filter === 'correct') return item.isCorrect;
    return true;
  });

  const handlePrint = () => {
    window.print();
  };

  const avgSpeed = result.totalQuestionsAnswered > 0 
    ? (result.timeSpent / result.totalQuestionsAnswered).toFixed(1) 
    : '0';

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
      {/* 1. Official Certificate / Scorecard */}
      <div 
        id="printable-certificate"
        className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-800/95 via-slate-900 to-indigo-950/70 border-2 border-amber-500/40 p-6 sm:p-10 shadow-2xl space-y-6"
      >
        {/* Certificate Watermark / Header */}
        <div className="text-center space-y-2 pb-6 border-b border-slate-700/80">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <Trophy className="w-4 h-4 text-amber-400" /> PHIẾU KẾT QUẢ ÔN TẬP NHANH TOÀN BÀI
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            THỬ THÁCH 60 GIÂY – LAB MASTER
          </h1>
          <p className="text-sm font-bold text-amber-400">
            Môn Tiếng Anh 10 – Bộ Sách Global Success (Pearson & NXB Giáo Dục Việt Nam)
          </p>
        </div>

        {/* Student & Quiz Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 py-2">
          <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800">
            <span className="text-xs text-slate-400 block font-medium">Học sinh:</span>
            <span className="text-base font-black text-white truncate block">
              {result.studentName}
            </span>
          </div>

          <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800">
            <span className="text-xs text-slate-400 block font-medium">Lớp học:</span>
            <span className="text-base font-black text-indigo-300 truncate block uppercase">
              {result.className}
            </span>
          </div>

          <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800">
            <span className="text-xs text-slate-400 block font-medium">Bài học:</span>
            <span className="text-sm font-bold text-emerald-300 truncate block">
              {result.unitTitle}
            </span>
          </div>

          <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800">
            <span className="text-xs text-slate-400 block font-medium">Mức độ:</span>
            <span className="text-xs font-bold text-amber-300 truncate block">
              {DIFFICULTY_LABELS[result.difficulty]?.label || 'Tổng hợp'}
            </span>
          </div>
        </div>

        {/* Core Stats Bento Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-4 text-center">
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">
              {result.score}
            </div>
            <div className="text-xs font-semibold text-emerald-300 mt-1">Tổng Điểm</div>
          </div>

          <div className="bg-blue-950/40 border border-blue-500/40 rounded-2xl p-4 text-center">
            <div className="text-2xl sm:text-3xl font-black text-blue-400">
              {result.correctCount} / {result.totalQuestionsAnswered}
            </div>
            <div className="text-xs font-semibold text-blue-300 mt-1">Số Câu Đúng</div>
          </div>

          <div className="bg-purple-950/40 border border-purple-500/40 rounded-2xl p-4 text-center">
            <div className="text-2xl sm:text-3xl font-black text-purple-400">
              {result.accuracyRate}%
            </div>
            <div className="text-xs font-semibold text-purple-300 mt-1">Độ Chính Xác</div>
          </div>

          <div className="bg-amber-950/40 border border-amber-500/40 rounded-2xl p-4 text-center">
            <div className="text-2xl sm:text-3xl font-black text-amber-400">
              {avgSpeed}s
            </div>
            <div className="text-xs font-semibold text-amber-300 mt-1">Tốc Độ / Câu</div>
          </div>
        </div>

        {/* Teacher Pedagogical Assessment */}
        <div className="bg-slate-900/90 rounded-2xl border border-indigo-500/40 p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-indigo-400 tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4" /> Đánh Giá Sư Phạm & Vinh Danh
            </span>
            <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {result.rankBadge}
            </span>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed italic">
            "{result.teacherComment}"
          </p>
          <div className="pt-2 text-right">
            <p className="text-xs font-bold text-slate-400">
              Tác giả chương trình:
            </p>
            <p className="text-sm font-extrabold text-amber-300">
              ThS. Nhà giáo Ưu tú Nguyễn Bùi Thùy Linh
            </p>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onRetakeQuiz}
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-extrabold text-white bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Thử Thách Lại (60s)</span>
          </button>

          <button
            type="button"
            onClick={onNewQuiz}
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm"
          >
            <Settings className="w-4 h-4 text-indigo-400" />
            <span>Đổi Bài Học & Cấu Hình</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors text-sm"
        >
          <Printer className="w-4 h-4 text-amber-400" />
          <span>In / Lưu Phiếu Kết Quả</span>
        </button>
      </div>

      {/* 2. Detailed Review Answers Section */}
      <div className="bg-slate-800/90 rounded-2xl border border-slate-700/80 p-5 sm:p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-700">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <span>Xem Lại Đáp Án & Giải Thích Chi Tiết</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Tra cứu đáp án chuẩn xác từ Sách Bài Tập Tiếng Anh 10 Global Success
            </p>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                filter === 'all'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tất cả ({result.answers.length})
            </button>
            <button
              onClick={() => setFilter('wrong')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                filter === 'wrong'
                  ? 'bg-rose-600 text-white shadow'
                  : 'text-slate-400 hover:text-rose-400'
              }`}
            >
              Câu sai ({result.answers.filter((a) => !a.isCorrect).length})
            </button>
            <button
              onClick={() => setFilter('correct')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                filter === 'correct'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-emerald-400'
              }`}
            >
              Câu đúng ({result.correctCount})
            </button>
          </div>
        </div>

        {/* Answer Cards List */}
        <div className="space-y-4">
          {filteredAnswers.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">
              Không có câu hỏi nào trong danh mục lọc này.
            </div>
          ) : (
            filteredAnswers.map((item, idx) => {
              const q = item.question;
              const isCorrect = item.isCorrect;
              const hasAnswered = item.selectedIndex !== null;

              return (
                <div
                  key={q.id + '_' + idx}
                  className={`rounded-xl border p-4 sm:p-5 transition-all ${
                    isCorrect
                      ? 'bg-slate-900/70 border-emerald-500/30'
                      : 'bg-slate-900/70 border-rose-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-black ${
                        isCorrect
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      }`}>
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-400">
                        {q.unitName} • {q.category}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => sounds.speakText(q.question)}
                      className="p-1 rounded text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                      title="Nghe phát âm"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-sm sm:text-base font-bold text-white mb-3">
                    {q.question}
                  </p>

                  {/* Options List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                    {q.options.map((opt, optIdx) => {
                      const isStudentChoice = item.selectedIndex === optIdx;
                      const isCorrectChoice = q.correctAnswer === optIdx;

                      let optClass = 'bg-slate-800/40 border-slate-700/60 text-slate-300';
                      if (isCorrectChoice) {
                        optClass = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-bold';
                      } else if (isStudentChoice && !isCorrectChoice) {
                        optClass = 'bg-rose-950/60 border-rose-500 text-rose-200 line-through';
                      }

                      return (
                        <div
                          key={optIdx}
                          className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${optClass}`}
                        >
                          <span>{opt}</span>
                          {isCorrectChoice && <span className="text-[10px] text-emerald-400 font-bold ml-1">✓ Đáp án đúng</span>}
                          {isStudentChoice && !isCorrectChoice && <span className="text-[10px] text-rose-400 font-bold ml-1">✗ Đã chọn</span>}
                        </div>
                      );
                    })}
                  </div>

                  {/* Pedagogical Explanation & Keys Notes */}
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-1">
                    <p className="font-bold text-amber-300 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Lời giải chi tiết:
                    </p>
                    <p className="leading-relaxed">{q.explanation}</p>
                    {q.grammarTip && (
                      <p className="text-[11px] text-indigo-300 font-medium pt-1 border-t border-slate-800/80">
                        📌 Ghi nhớ nhanh: {q.grammarTip}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
