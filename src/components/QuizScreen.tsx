import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Question, UserConfig, AnswerRecord, QuizResult } from '../types';
import { sounds } from '../utils/audio';
import { 
  Clock, 
  Flame, 
  Volume2, 
  SkipForward, 
  XCircle, 
  CheckCircle, 
  AlertCircle,
  HelpCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { getTeacherComment } from '../data/questions';

interface QuizScreenProps {
  config: UserConfig;
  questions: Question[];
  isUnlimitedTime: boolean;
  onFinishQuiz: (result: QuizResult) => void;
  onQuitQuiz: () => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  config,
  questions,
  isUnlimitedTime,
  onFinishQuiz,
  onQuitQuiz
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(isUnlimitedTime ? 0 : 60);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [score, setScore] = useState(0);

  const questionStartTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const finishCalledRef = useRef<boolean>(false);

  const currentQuestion = questions[currentIndex];

  // Helper to finalize result
  const handleComplete = useCallback(() => {
    if (finishCalledRef.current) return;
    finishCalledRef.current = true;

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    const totalAnswered = answers.length;
    const correctCount = answers.filter((a) => a.isCorrect).length;
    const wrongCount = answers.filter((a) => !a.isCorrect && a.selectedIndex !== null).length;
    const skippedCount = answers.filter((a) => a.selectedIndex === null).length;
    const accuracyRate = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
    const timeSpent = isUnlimitedTime ? Math.round((Date.now() - questionStartTimeRef.current) / 1000) : (60 - timeLeft);

    const evaluation = getTeacherComment(score, accuracyRate, correctCount);

    const result: QuizResult = {
      id: 'res_' + Date.now(),
      studentName: config.studentName,
      className: config.className,
      unitId: config.selectedUnitId,
      unitTitle: currentQuestion ? currentQuestion.unitName : 'Global Success 10',
      difficulty: config.difficulty,
      score,
      totalQuestionsAnswered: totalAnswered,
      targetQuestions: config.questionCount,
      correctCount,
      wrongCount,
      skippedCount,
      accuracyRate,
      timeSpent: isUnlimitedTime ? Math.max(1, timeSpent) : (60 - timeLeft),
      maxCombo,
      answers,
      timestamp: Date.now(),
      rankBadge: evaluation.rankTitle,
      teacherComment: evaluation.comment
    };

    sounds.playCombo();
    onFinishQuiz(result);
  }, [answers, config, isUnlimitedTime, maxCombo, onFinishQuiz, score, timeLeft, currentQuestion]);

  // Timer effect
  useEffect(() => {
    if (isUnlimitedTime) {
      // In unlimited time mode, timer counts up
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev + 1);
      }, 1000);
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }

    // 60-second countdown mode
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleComplete();
          return 0;
        }

        // Play warning tick during last 10 seconds
        if (prev <= 11 && prev > 1) {
          sounds.playWarningTick();
        } else if (prev % 10 === 0) {
          sounds.playTick();
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isUnlimitedTime, handleComplete]);

  // Handle Option selection
  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted || !currentQuestion) return;

    const timeSpentOnQuestion = Math.max(1, Math.round((Date.now() - questionStartTimeRef.current) / 1000));
    setSelectedOption(index);
    setIsAnswerSubmitted(true);

    const isCorrect = index === currentQuestion.correctAnswer;
    let newCombo = combo;
    let pointsToAdd = 0;

    if (isCorrect) {
      newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > maxCombo) {
        setMaxCombo(newCombo);
      }
      
      // Points calculation with combo bonus
      pointsToAdd = 100 + (newCombo > 1 ? (newCombo - 1) * 20 : 0);
      setScore((prev) => prev + pointsToAdd);

      sounds.playCorrect();
      if (newCombo >= 3 && newCombo % 2 === 1) {
        sounds.playCombo();
      }
    } else {
      setCombo(0);
      sounds.playWrong();
    }

    const newRecord: AnswerRecord = {
      question: currentQuestion,
      selectedIndex: index,
      isCorrect,
      timeSpent: timeSpentOnQuestion
    };

    const updatedAnswers = [...answers, newRecord];
    setAnswers(updatedAnswers);

    // Auto advance after brief delay for fast-paced 60s speedrun (800ms)
    setTimeout(() => {
      moveToNextQuestion(updatedAnswers);
    }, 900);
  };

  // Skip current question
  const handleSkip = () => {
    if (isAnswerSubmitted || !currentQuestion) return;

    const timeSpentOnQuestion = Math.max(1, Math.round((Date.now() - questionStartTimeRef.current) / 1000));
    setCombo(0);

    const newRecord: AnswerRecord = {
      question: currentQuestion,
      selectedIndex: null,
      isCorrect: false,
      timeSpent: timeSpentOnQuestion
    };

    const updatedAnswers = [...answers, newRecord];
    setAnswers(updatedAnswers);
    moveToNextQuestion(updatedAnswers);
  };

  const moveToNextQuestion = (currentAnswersList: AnswerRecord[]) => {
    if (currentIndex + 1 < questions.length && (!finishCalledRef.current)) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      questionStartTimeRef.current = Date.now();
    } else {
      // Completed all questions in the set
      handleComplete();
    }
  };

  // Keyboard shortcut support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnswerSubmitted) return;

      if (e.key === '1' || e.key === 'a' || e.key === 'A') {
        handleSelectOption(0);
      } else if (e.key === '2' || e.key === 'b' || e.key === 'B') {
        handleSelectOption(1);
      } else if (e.key === '3' || e.key === 'c' || e.key === 'C') {
        handleSelectOption(2);
      } else if (e.key === '4' || e.key === 'd' || e.key === 'D') {
        handleSelectOption(3);
      } else if (e.key === ' ') {
        e.preventDefault();
        handleSkip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isAnswerSubmitted, currentQuestion]);

  if (!currentQuestion) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">Đang tải câu hỏi...</p>
      </div>
    );
  }

  // Progress calculations
  const progressPercent = ((currentIndex + 1) / questions.length) * 100;
  const timeProgressPercent = isUnlimitedTime ? 100 : (timeLeft / 60) * 100;
  const isUrgent = !isUnlimitedTime && timeLeft <= 10;

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
      {/* Top Status Bar: Timer, Score, Combo */}
      <div className="bg-slate-800/90 backdrop-blur rounded-2xl border border-slate-700/80 p-4 shadow-xl">
        <div className="flex items-center justify-between gap-4">
          {/* Student Tag */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold text-xs">
              {config.className}
            </div>
            <div className="truncate">
              <span className="text-xs text-slate-400 block">Học sinh:</span>
              <span className="text-sm font-bold text-white truncate block">
                {config.studentName}
              </span>
            </div>
          </div>

          {/* Center: 60s Countdown Timer */}
          <div className="flex flex-col items-center">
            <div className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full font-black text-lg transition-all ${
              isUrgent
                ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/50 scale-110'
                : 'bg-slate-900 text-amber-400 border border-slate-700'
            }`}>
              <Clock className={`w-5 h-5 ${isUrgent ? 'animate-spin' : ''}`} />
              <span>{isUnlimitedTime ? `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}` : `${timeLeft}s`}</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5">
              {isUnlimitedTime ? 'Thời gian đã trôi' : 'Thời gian còn lại'}
            </span>
          </div>

          {/* Right: Score & Combo */}
          <div className="flex items-center gap-3">
            {combo > 1 && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black animate-bounce">
                <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>x{combo} COMBO!</span>
              </div>
            )}
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Điểm số:</span>
              <span className="text-base sm:text-lg font-black text-emerald-400">
                {score} <span className="text-xs font-medium text-slate-400">pts</span>
              </span>
            </div>
          </div>
        </div>

        {/* Time Progress Bar */}
        {!isUnlimitedTime && (
          <div className="w-full h-2 bg-slate-900 rounded-full mt-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                isUrgent ? 'bg-rose-500' : timeLeft <= 25 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${timeProgressPercent}%` }}
            />
          </div>
        )}
      </div>

      {/* Question Card */}
      <div className="bg-slate-800/90 rounded-2xl border border-slate-700/80 p-5 sm:p-7 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Unit & Category Meta */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-700/60">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-900 text-slate-300 border border-slate-700">
              Câu {currentIndex + 1} / {questions.length}
            </span>
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {currentQuestion.category}
            </span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
              currentQuestion.difficulty === 'recognition'
                ? 'bg-emerald-500/20 text-emerald-300'
                : currentQuestion.difficulty === 'comprehension'
                ? 'bg-blue-500/20 text-blue-300'
                : 'bg-purple-500/20 text-purple-300'
            }`}>
              {currentQuestion.difficulty === 'recognition' ? 'Nhận biết' : currentQuestion.difficulty === 'comprehension' ? 'Thông hiểu' : 'Vận dụng'}
            </span>
          </div>

          {/* Text-to-speech button */}
          <button
            type="button"
            onClick={() => sounds.speakText(currentQuestion.question)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-700 border border-slate-700 transition-colors"
            title="Nghe phát âm tiếng Anh"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Đọc câu hỏi</span>
          </button>
        </div>

        {/* Question Content */}
        <div className="space-y-3">
          {currentQuestion.context && (
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-xs sm:text-sm text-slate-300 italic">
              {currentQuestion.context}
            </div>
          )}
          <h2 className="text-base sm:text-xl font-bold text-white leading-relaxed whitespace-pre-line">
            {currentQuestion.question}
          </h2>
        </div>

        {/* 4 Options Grid */}
        <div className="grid grid-cols-1 gap-3">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrectAnswer = currentQuestion.correctAnswer === idx;

            let btnStyle = 'bg-slate-900/80 border-slate-700 text-slate-200 hover:border-amber-500/60 hover:bg-slate-900';

            if (isAnswerSubmitted) {
              if (isCorrectAnswer) {
                btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/60 shadow-lg shadow-emerald-500/20';
              } else if (isSelected && !isCorrectAnswer) {
                btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200 ring-2 ring-rose-500/60';
              } else {
                btnStyle = 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={isAnswerSubmitted}
                onClick={() => handleSelectOption(idx)}
                className={`relative flex items-center justify-between p-4 rounded-xl border text-left text-sm sm:text-base font-semibold transition-all ${btnStyle}`}
              >
                <div className="flex items-center gap-3 pr-2">
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0 ${
                    isAnswerSubmitted && isCorrectAnswer
                      ? 'bg-emerald-500 text-white'
                      : isAnswerSubmitted && isSelected
                      ? 'bg-rose-500 text-white'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{option.replace(/^[A-D]\.\s*/, '')}</span>
                </div>

                {isAnswerSubmitted && (
                  <div className="flex-shrink-0">
                    {isCorrectAnswer ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    ) : isSelected ? (
                      <XCircle className="w-5 h-5 text-rose-400" />
                    ) : null}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Instant explanation snippet when submitted */}
        {isAnswerSubmitted && (
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-indigo-500/30 text-xs sm:text-sm text-slate-300 space-y-1 animate-fadeIn">
            <p className="font-bold text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Giải thích:
            </p>
            <p>{currentQuestion.explanation}</p>
          </div>
        )}

        {/* Footer actions: Skip or End */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-700/60">
          <button
            type="button"
            onClick={onQuitQuiz}
            className="text-xs font-semibold text-slate-400 hover:text-rose-400 transition-colors"
          >
            Dừng thử thách
          </button>

          <button
            type="button"
            disabled={isAnswerSubmitted}
            onClick={handleSkip}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-700 border border-slate-700 transition-colors disabled:opacity-50"
          >
            <span>Bỏ qua câu này</span>
            <SkipForward className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
