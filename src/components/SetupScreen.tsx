import React, { useState } from 'react';
import { UserConfig, DifficultyLevel } from '../types';
import { UNITS_DATA } from '../data/units';
import { DIFFICULTY_LABELS } from '../data/questions';
import { 
  User, 
  GraduationCap, 
  BookOpen, 
  Layers, 
  HelpCircle, 
  Zap, 
  Play, 
  Flame, 
  CheckCircle2, 
  Sparkles,
  Trophy,
  Clock,
  Volume2
} from 'lucide-react';

interface SetupScreenProps {
  initialConfig: UserConfig;
  onStartQuiz: (config: UserConfig, isUnlimitedTime?: boolean) => void;
  onOpenHistory: () => void;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({
  initialConfig,
  onStartQuiz,
  onOpenHistory
}) => {
  const [studentName, setStudentName] = useState(initialConfig.studentName || '');
  const [className, setClassName] = useState(initialConfig.className || '');
  const [selectedUnitId, setSelectedUnitId] = useState(initialConfig.selectedUnitId || 'all');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(initialConfig.difficulty || 'all');
  const [questionCount, setQuestionCount] = useState(initialConfig.questionCount || 20);
  const [errorMsg, setErrorMsg] = useState('');

  const handleStart = (isUnlimited: boolean = false) => {
    if (!studentName.trim()) {
      setErrorMsg('Vui lòng nhập Họ và Tên học sinh để bắt đầu!');
      return;
    }
    if (!className.trim()) {
      setErrorMsg('Vui lòng nhập Tên Lớp học của em!');
      return;
    }

    setErrorMsg('');
    const config: UserConfig = {
      studentName: studentName.trim(),
      className: className.trim().toUpperCase(),
      selectedUnitId,
      difficulty,
      questionCount,
      timeLimit: isUnlimited ? 999999 : 60
    };

    onStartQuiz(config, isUnlimited);
  };

  const selectedUnit = UNITS_DATA.find((u) => u.id === selectedUnitId) || UNITS_DATA[0];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/90 via-slate-800/50 to-indigo-950/40 border border-slate-700/80 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500/20 to-rose-500/20 text-amber-300 border border-amber-500/30">
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> Hệ thống Ôn tập Siêu Tốc 10
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              THỬ THÁCH 60 GIÂY – <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-rose-400 to-indigo-400">LAB MASTER</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              Biên soạn & Tối ưu hoá bởi <span className="font-bold text-amber-300">ThS. NGƯT NGUYỄN BÙI THÙY LINH</span>. 
              Luyện phản xạ nhanh, củng cố toàn diện Ngữ pháp, Từ vựng, Phát âm & Đọc hiểu theo chuẩn SGK và SBT Tiếng Anh 10 Global Success!
            </p>
          </div>

          {/* Quick rules badge */}
          <div className="flex-shrink-0 bg-slate-900/80 backdrop-blur border border-slate-700 rounded-xl p-4 text-center min-w-[200px] shadow-lg">
            <div className="text-3xl font-black text-amber-400 flex items-center justify-center gap-1.5">
              <Clock className="w-7 h-7 text-amber-400 animate-pulse" /> 60 GIÂY
            </div>
            <p className="text-xs text-slate-400 mt-1">Trả lời đúng càng nhiều câu càng tốt</p>
            <div className="mt-2 pt-2 border-t border-slate-800 flex justify-around text-xs font-semibold text-slate-300">
              <span>🔥 Combo x2, x3</span>
              <span>•</span>
              <span>🏆 Vinh danh</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Student Info & Quiz Settings */}
        <div className="lg:col-span-1 space-y-6">
          {/* 1. Student Information */}
          <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 p-5 shadow-lg space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-base pb-2 border-b border-slate-700">
              <User className="w-5 h-5 text-amber-400" />
              <span>1. Thông Tin Học Sinh</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Họ và Tên Học Sinh <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => {
                      setStudentName(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="Ví dụ: Nguyễn Văn An"
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Lớp Học <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={className}
                    onChange={(e) => {
                      setClassName(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="Ví dụ: 10A1 / 10D1 / 10 Anh"
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 uppercase transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Difficulty Level */}
          <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 p-5 shadow-lg space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-base pb-2 border-b border-slate-700">
              <Layers className="w-5 h-5 text-indigo-400" />
              <span>2. Chọn Mức Độ Nhận Thức</span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {(Object.keys(DIFFICULTY_LABELS) as DifficultyLevel[]).map((level) => {
                const info = DIFFICULTY_LABELS[level];
                const isSelected = difficulty === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setDifficulty(level)}
                    className={`text-left p-3 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 shadow-md shadow-indigo-500/10'
                        : 'bg-slate-900/60 border-slate-700/60 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${isSelected ? 'text-indigo-300' : 'text-slate-200'}`}>
                        {info.label}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                      {info.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Question Count (Max 30) */}
          <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-700">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <HelpCircle className="w-5 h-5 text-rose-400" />
                <span>3. Số Lượng Câu Hỏi</span>
              </div>
              <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {questionCount} Câu (Tối đa 30)
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                {[10, 15, 20, 25, 30].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setQuestionCount(num)}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-colors ${
                      questionCount === num
                        ? 'bg-rose-500 text-white border-rose-400 shadow-md shadow-rose-500/20'
                        : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>

              <input
                type="range"
                min={5}
                max={30}
                step={1}
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>5 câu</span>
                <span>Thử thách 60 giây</span>
                <span>30 câu tối đa</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Unit Selection & Action Controls */}
        <div className="lg:col-span-2 space-y-6">
          {/* 4. Select Unit */}
          <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 p-5 sm:p-6 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-700">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                <span>4. Chọn Bài Học (Units 1 - 10 & Tests)</span>
              </div>
              <span className="text-xs text-slate-400">
                Đang chọn: <strong className="text-amber-300">{selectedUnit.title}</strong>
              </span>
            </div>

            {/* Units Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
              {UNITS_DATA.map((unit) => {
                const isSelected = selectedUnitId === unit.id;
                return (
                  <div
                    key={unit.id}
                    onClick={() => setSelectedUnitId(unit.id)}
                    className={`cursor-pointer rounded-xl p-3.5 border transition-all text-left flex flex-col justify-between ${
                      isSelected
                        ? 'bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500 shadow-md shadow-emerald-500/10'
                        : 'bg-slate-900/70 border-slate-700/70 hover:border-slate-600 hover:bg-slate-900/90'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className={`text-xs font-black px-2 py-0.5 rounded-md ${
                          unit.isTest 
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' 
                            : unit.id === 'all'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}>
                          {unit.id === 'all' ? 'TỔNG HỢP' : unit.isTest ? `TEST ${unit.number}` : `UNIT ${unit.number}`}
                        </span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                      </div>

                      <h4 className="text-sm font-bold text-white line-clamp-1">
                        {unit.title}
                      </h4>
                      <p className="text-xs text-slate-300 font-medium line-clamp-1 mb-2">
                        {unit.vietnameseTitle}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
                      <p className="line-clamp-1">
                        <span className="text-slate-500 font-semibold">Ngữ pháp:</span> {unit.grammarHighlight}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Validation Error Banner */}
          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-sm font-semibold flex items-center gap-2 animate-bounce">
              <span>⚠️ {errorMsg}</span>
            </div>
          )}

          {/* Start Actions */}
          <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 p-5 shadow-lg space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Button 1: 60s Speedrun Challenge */}
              <button
                type="button"
                onClick={() => handleStart(false)}
                className="group relative overflow-hidden flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-black text-white bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:from-amber-400 hover:via-rose-400 hover:to-indigo-500 shadow-xl shadow-rose-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Flame className="w-6 h-6 text-amber-200 fill-amber-200 animate-pulse" />
                <div className="text-left">
                  <div className="text-sm uppercase tracking-wider font-extrabold">
                    BẮT ĐẦU THỬ THÁCH
                  </div>
                  <div className="text-xs text-amber-100 font-normal">
                    60 Giây Tốc Độ Cao
                  </div>
                </div>
              </button>

              {/* Button 2: Free Practice Mode */}
              <button
                type="button"
                onClick={() => handleStart(true)}
                className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold text-slate-200 bg-slate-900/90 hover:bg-slate-700/90 border border-slate-700 hover:border-slate-600 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <BookOpen className="w-5 h-5 text-indigo-400" />
                <div className="text-left">
                  <div className="text-sm font-bold text-white">
                    LUYỆN TẬP TỰ DO
                  </div>
                  <div className="text-xs text-slate-400">
                    Không giới hạn thời gian
                  </div>
                </div>
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 px-1 pt-1">
              <span>💡 Mẹo: Có thể dùng phím số 1, 2, 3, 4 hoặc A, B, C, D để chọn nhanh đáp án.</span>
              <button
                onClick={onOpenHistory}
                className="text-amber-400 hover:underline font-semibold flex items-center gap-1"
              >
                <Trophy className="w-3.5 h-3.5" /> Bảng vàng điểm cao
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
