/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserConfig, Question, QuizResult } from './types';
import { Header } from './components/Header';
import { SetupScreen } from './components/SetupScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultScreen } from './components/ResultScreen';
import { LeaderboardModal } from './components/LeaderboardModal';
import { getFilteredQuestions } from './data/questions';
import { sounds } from './utils/audio';

const STORAGE_KEY_CONFIG = 'labmaster_user_config';
const STORAGE_KEY_HISTORY = 'labmaster_quiz_history';

export default function App() {
  const [screen, setScreen] = useState<'setup' | 'quiz' | 'result'>('setup');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [isUnlimitedTime, setIsUnlimitedTime] = useState(false);

  // User Config State
  const [userConfig, setUserConfig] = useState<UserConfig>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return {
      studentName: '',
      className: '',
      selectedUnitId: 'all',
      difficulty: 'all',
      questionCount: 20,
      timeLimit: 60
    };
  });

  // Active Questions for current quiz session
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  // Last Completed Quiz Result
  const [currentResult, setCurrentResult] = useState<QuizResult | null>(null);

  // Quiz History
  const [history, setHistory] = useState<QuizResult[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return [];
  });

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
    } catch {
      // ignore
    }
  }, [history]);

  // Save user config
  const saveConfig = (newConfig: UserConfig) => {
    setUserConfig(newConfig);
    try {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(newConfig));
    } catch {
      // ignore
    }
  };

  const handleToggleSound = () => {
    const newState = sounds.toggleSound();
    setSoundEnabled(newState);
  };

  const handleStartQuiz = (config: UserConfig, unlimited: boolean = false) => {
    saveConfig(config);
    setIsUnlimitedTime(unlimited);

    const questions = getFilteredQuestions(
      config.selectedUnitId,
      config.difficulty,
      config.questionCount
    );

    setActiveQuestions(questions);
    setScreen('quiz');
  };

  const handleFinishQuiz = (result: QuizResult) => {
    setCurrentResult(result);
    setHistory((prev) => [result, ...prev].slice(0, 50)); // Keep top 50
    setScreen('result');
  };

  const handleRetakeQuiz = () => {
    if (!userConfig) return;
    const questions = getFilteredQuestions(
      userConfig.selectedUnitId,
      userConfig.difficulty,
      userConfig.questionCount
    );
    setActiveQuestions(questions);
    setScreen('quiz');
  };

  const handleNewQuiz = () => {
    setScreen('setup');
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY_HISTORY);
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navigation / App Header */}
      <Header
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenHistory={() => setShowHistoryModal(true)}
        onGoHome={() => setScreen('setup')}
      />

      {/* Main Interactive View Container */}
      <main className="flex-1 w-full pb-12 pt-2">
        {screen === 'setup' && (
          <SetupScreen
            initialConfig={userConfig}
            onStartQuiz={handleStartQuiz}
            onOpenHistory={() => setShowHistoryModal(true)}
          />
        )}

        {screen === 'quiz' && (
          <QuizScreen
            config={userConfig}
            questions={activeQuestions}
            isUnlimitedTime={isUnlimitedTime}
            onFinishQuiz={handleFinishQuiz}
            onQuitQuiz={() => setScreen('setup')}
          />
        )}

        {screen === 'result' && currentResult && (
          <ResultScreen
            result={currentResult}
            onRetakeQuiz={handleRetakeQuiz}
            onNewQuiz={handleNewQuiz}
          />
        )}
      </main>

      {/* Footer Info & Pedagogical Credits */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-900/60 py-4 px-4 text-center text-xs text-slate-400 space-y-1">
        <p>
          <strong className="text-slate-300">THỬ THÁCH 60 GIÂY – LAB MASTER</strong> • Hệ Thống Ôn Tập Toàn Diện Tiếng Anh 10 Global Success
        </p>
        <p className="text-slate-400">
          Chủ biên & Biên soạn: <strong className="text-amber-400">Thạc sĩ Nhà giáo Ưu tú NGUYỄN BÙI THÙY LINH</strong>
        </p>
      </footer>

      {/* Leaderboard Modal */}
      {showHistoryModal && (
        <LeaderboardModal
          history={history}
          onClose={() => setShowHistoryModal(false)}
          onClearHistory={handleClearHistory}
        />
      )}
    </div>
  );
}
