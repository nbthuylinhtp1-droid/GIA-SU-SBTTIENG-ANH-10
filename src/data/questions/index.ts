import { Question, DifficultyLevel } from '../../types';
import { UNIT_1_TO_3_QUESTIONS } from './unit1_3';
import { UNIT_4_TO_6_QUESTIONS } from './unit4_6';
import { UNIT_7_TO_10_QUESTIONS } from './unit7_10';
import { ADDITIONAL_QUESTIONS } from './additional_pool';

export const ALL_QUESTIONS: Question[] = [
  ...UNIT_1_TO_3_QUESTIONS,
  ...UNIT_4_TO_6_QUESTIONS,
  ...UNIT_7_TO_10_QUESTIONS,
  ...ADDITIONAL_QUESTIONS
];

export const DIFFICULTY_LABELS: Record<DifficultyLevel, { label: string; desc: string; badgeColor: string }> = {
  recognition: {
    label: 'Nhận Biết (Knowledge & Recall)',
    desc: 'Nhận diện phát âm, trọng âm, nghĩa từ vựng cơ bản và cấu trúc ngữ pháp quen thuộc.',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
  },
  comprehension: {
    label: 'Thông Hiểu (Comprehension)',
    desc: 'Hiểu nghĩa câu theo ngữ cảnh, chọn liên từ, chia thì tương phản, đọc hiểu phân tích.',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40'
  },
  application: {
    label: 'Vận Dụng (Application & Synthesis)',
    desc: 'Tìm và sửa lỗi sai, viết lại câu biến đổi cấu trúc, kết hợp mệnh đề, câu trực tiếp - gián tiếp.',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40'
  },
  all: {
    label: 'Tổng Hợp 3 Mức Độ (All Levels)',
    desc: 'Kết hợp hài hòa cả 3 cấp độ: Nhận biết, Thông hiểu và Vận dụng theo ma trận đề chuẩn.',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
  }
};

/**
 * Shuffle array using Fisher-Yates algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Filter and retrieve random questions according to user selection
 */
export function getFilteredQuestions(
  unitId: string,
  difficulty: DifficultyLevel,
  count: number
): Question[] {
  let pool = ALL_QUESTIONS;

  // Filter by Unit
  if (unitId !== 'all') {
    pool = pool.filter((q) => q.unitId === unitId);
  }

  // Filter by Difficulty
  if (difficulty !== 'all') {
    pool = pool.filter((q) => q.difficulty === difficulty);
  }

  // If pool is smaller than requested count, fill with remaining questions from unit or all
  let selected = shuffleArray(pool);

  if (selected.length < count) {
    // Fill from related questions
    const fallbackPool = ALL_QUESTIONS.filter((q) => !selected.some((s) => s.id === q.id));
    const extraNeeded = count - selected.length;
    selected = [...selected, ...shuffleArray(fallbackPool).slice(0, extraNeeded)];
  }

  return selected.slice(0, count);
}

/**
 * Get teacher pedagogical evaluation based on score and accuracy
 */
export function getTeacherComment(score: number, accuracy: number, answeredCount: number): { comment: string; rankTitle: string; badgeIcon: string } {
  if (accuracy >= 90 && answeredCount >= 10) {
    return {
      rankTitle: 'Xuất Sắc – Master LAB 60S',
      badgeIcon: '🏆',
      comment: 'Thầy/Cô Nguyễn Bùi Thùy Linh khen ngợi em! Tốc độ phản xạ thần tốc, nắm cực vững kiến thức từ vựng, ngữ pháp và kỹ năng ngôn ngữ. Hãy tiếp tục duy trì phong độ đỉnh cao này!'
    };
  } else if (accuracy >= 75) {
    return {
      rankTitle: 'Giỏi – Star Learner',
      badgeIcon: '🌟',
      comment: 'Kết quả rất tốt! Em có nền tảng ngữ pháp và từ vựng vững vàng, phản xạ nhanh. Chú ý ôn lại một vài câu bẫy ngữ pháp để bứt phá đạt điểm tuyệt đối nhé!'
    };
  } else if (accuracy >= 50) {
    return {
      rankTitle: 'Khá – Active Achiever',
      badgeIcon: '⚡',
      comment: 'Em đã nỗ lực rất đáng khen! Hãy xem lại phần giải thích chi tiết của các câu làm sai và luyện thêm thử thách 60 giây để tăng tốc độ phản xạ nhé!'
    };
  } else {
    return {
      rankTitle: 'Cần Cố Gắng – Step by Step',
      badgeIcon: '🎯',
      comment: 'Đừng nản lòng nhé! Em hãy dành thêm thời gian ôn lại lý thuyết trọng tâm từng Unit, xem kỹ phần giải thích chi tiết và thử lại một lần nữa!'
    };
  }
}
