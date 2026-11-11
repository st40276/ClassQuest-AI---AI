import React, { useState, useEffect } from 'react';
import { Game, Question } from '../types';
import { api } from '../services/api';
import confetti from 'canvas-confetti';
import { 
  Sparkles, Clock, CheckCircle2, XCircle, Award, 
  ArrowRight, Bot, Coins, Zap
} from 'lucide-react';

interface GamePlayModalProps {
  game: Game & { questions?: Question[] };
  onClose: () => void;
  onGameCompleted: () => void;
  onOpenAIAssistant: (data: { question: string; options: string[]; userAnswer?: string; correctAnswer?: string; topic?: string; subject?: string }) => void;
  animationsEnabled: boolean;
}

export const GamePlayModal: React.FC<GamePlayModalProps> = ({
  game,
  onClose,
  onGameCompleted,
  onOpenAIAssistant,
  animationsEnabled
}) => {
  const questions = game.questions || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(game.time_limit || 30);
  const [userAnswers, setUserAnswers] = useState<{ question_id: string; selected_option: number; is_correct: boolean; time_spent_seconds: number }[]>([]);
  const [streakCombo, setStreakCombo] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const currentQ = questions[currentIndex];

  // Timer countdown
  useEffect(() => {
    if (result || isAnswered || !currentQ) return;

    if (timeLeft <= 0) {
      handleAnswerSelect(-1);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isAnswered, result, currentQ]);

  // Reset timer on question change
  useEffect(() => {
    setTimeLeft(currentQ?.time_limit || game.time_limit || 30);
    setSelectedOption(null);
    setIsAnswered(false);
  }, [currentIndex, currentQ, game.time_limit]);

  const handleAnswerSelect = (optionIndex: number) => {
    if (isAnswered || !currentQ) return;

    setSelectedOption(optionIndex);
    setIsAnswered(true);

    const isCorrect = optionIndex === currentQ.correct_answer;
    const timeSpent = (currentQ.time_limit || game.time_limit || 30) - timeLeft;

    if (isCorrect) {
      setStreakCombo(prev => prev + 1);
    } else {
      setStreakCombo(0);
    }

    setUserAnswers(prev => [
      ...prev,
      {
        question_id: currentQ.id,
        selected_option: optionIndex,
        is_correct: isCorrect,
        time_spent_seconds: timeSpent
      }
    ]);
  };

  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsSubmitting(true);
      try {
        const res = await api.submitGameAnswers(game.id, userAnswers);
        setResult(res);

        if (animationsEnabled) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        }

        onGameCompleted();
      } catch (err) {
        console.error('Failed to submit game:', err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (!currentQ && !result) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
        <div className="card-academy rounded-3xl p-6 text-center max-w-sm">
          <p className="text-slate-600 font-bold">ยังไม่มีคำถามสำหรับเควสต์นี้</p>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-sky-500 rounded-xl text-white font-bold text-xs">
            ปิด
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="card-academy w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col">
        
        {/* Game Arena Header */}
        {!result && (
          <div className="p-4 sm:p-5 bg-gradient-to-r from-sky-500 via-sky-600 to-indigo-600 text-white shrink-0">
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full text-white">
                  {game.game_type === 'quiz_battle' && '⚔️ Quiz Battle'}
                  {game.game_type === 'team_battle' && '🛡️ Team Battle ประลองกิลด์'}
                  {game.game_type === 'mission_quest' && '📜 Mission Quest'}
                  {game.game_type === 'daily_challenge' && '🔥 Daily Challenge'}
                  {game.game_type === 'weekly_challenge' && '👑 Weekly Challenge'}
                </span>
                <h3 className="text-sm sm:text-base font-black text-white mt-1 truncate max-w-md">
                  {game.title}
                </h3>
              </div>

              {/* Timer & Combo */}
              <div className="flex items-center gap-2">
                {streakCombo > 1 && (
                  <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400 text-slate-900 text-xs font-black shadow-xs">
                    <Zap className="w-3.5 h-3.5 fill-slate-900" />
                    <span>{streakCombo}x Combo!</span>
                  </div>
                )}
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs shadow-xs ${
                  timeLeft <= 5 
                    ? 'bg-rose-500 text-white animate-pulse' 
                    : 'bg-white/20 text-white'
                }`}>
                  <Clock className="w-4 h-4" />
                  <span>{timeLeft}s</span>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 h-2 bg-white/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-300 rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
              <span className="text-[11px] font-bold text-sky-100 shrink-0">
                ข้อ {currentIndex + 1} / {questions.length}
              </span>
            </div>
          </div>
        )}

        {/* Question Area */}
        {!result && currentQ && (
          <div className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1">
            <div className="p-4 sm:p-5 rounded-2xl bg-sky-50/70 border border-sky-100">
              <span className="text-xs font-bold text-sky-700">
                คะแนนข้อนี้: {currentQ.points} คะแนน
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-1 leading-relaxed">
                {currentQ.question}
              </h2>
            </div>

            {/* 4 Choices */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQ.correct_answer;
                
                let btnStyle = 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-xs';

                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 ring-2 ring-emerald-300 font-bold';
                  } else if (isSelected && !isCorrect) {
                    btnStyle = 'bg-rose-50 border-rose-400 text-rose-900 ring-2 ring-rose-300 font-bold';
                  } else {
                    btnStyle = 'opacity-40 bg-slate-50 border-slate-200 text-slate-400';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleAnswerSelect(idx)}
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all ${btnStyle}`}
                  >
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-extrabold shrink-0 ${
                      isAnswered && isCorrect 
                        ? 'bg-emerald-500 text-white'
                        : isAnswered && isSelected 
                        ? 'bg-rose-500 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1 mt-0.5">{opt}</span>
                    {isAnswered && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 ml-1" />
                    )}
                    {isAnswered && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-500 shrink-0 ml-1" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Instant Explanation Box */}
            {isAnswered && (
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {selectedOption === currentQ.correct_answer ? (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> ตอบถูกต้อง! เก่งมาก
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-rose-700">
                        <XCircle className="w-4 h-4 text-rose-600" /> ยังไม่ถูกต้อง คำตอบที่ถูกคือตัวเลือก {String.fromCharCode(65 + currentQ.correct_answer)}
                      </span>
                    )}
                  </div>

                  {/* AI Learning Mentor Button */}
                  <button
                    onClick={() => onOpenAIAssistant({
                      question: currentQ.question,
                      options: currentQ.options,
                      userAnswer: selectedOption !== null && selectedOption >= 0 ? currentQ.options[selectedOption] : 'ไม่ได้ตอบ',
                      correctAnswer: currentQ.options[currentQ.correct_answer],
                      topic: game.topic,
                      subject: game.subject
                    })}
                    className="flex items-center gap-1 px-3 py-1 rounded-xl bg-white hover:bg-slate-50 border border-sky-300 text-sky-700 text-xs font-bold shadow-xs transition-colors"
                  >
                    <Bot className="w-3.5 h-3.5 text-sky-600" />
                    <span>ถาม AI Mentor</span>
                  </button>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">
                  💡 <strong>คำอธิบาย:</strong> {currentQ.explanation}
                </p>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
              >
                ออกจากเกม
              </button>

              {isAnswered && (
                <button
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-500/20 transition-all"
                >
                  {isSubmitting ? (
                    <span>กำลังบันทึกคะแนน...</span>
                  ) : currentIndex < questions.length - 1 ? (
                    <>
                      <span>ข้อถัดไป</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>สรุปผลการผจญภัย</span>
                      <Award className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Results Screen */}
        {result && (
          <div className="p-6 sm:p-8 text-center space-y-6 overflow-y-auto flex-1">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-100 flex items-center justify-center text-4xl shadow-inner border border-amber-200">
              🏆
            </div>

            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
                Quest Completed
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-2">
                ภารกิจสำเร็จลุล่วง!
              </h2>
              <p className="text-sm text-slate-500 mt-1">{game.title}</p>
            </div>

            {/* Level up banner if achieved */}
            {result.leveledUp && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-center animate-pulse">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-widest">
                  🎉 ยินดีด้วย! เลเวลอัป
                </span>
                <h4 className="text-lg font-black text-slate-900 mt-0.5">
                  คุณได้เลื่อนขั้นเป็น Lv.{result.newLevel} {result.levelTitle}
                </h4>
              </div>
            )}

            {/* Rewards 3-Grid: Score, XP, Points! */}
            <div className="grid grid-cols-3 gap-3">
              <div className="card-academy p-4 rounded-2xl text-center">
                <div className="text-xs text-slate-500 font-semibold">คะแนนที่ได้</div>
                <div className="text-xl font-extrabold text-slate-900 mt-1">
                  {result.score} <span className="text-xs text-slate-400 font-normal">/ {result.max_score}</span>
                </div>
                <div className="text-[10px] text-sky-600 font-bold mt-0.5">{result.percentage}% ถูกต้อง</div>
              </div>

              <div className="card-academy p-4 rounded-2xl bg-sky-50/50 border-sky-200 text-center">
                <div className="text-xs text-sky-700 font-semibold">XP ที่ได้รับ</div>
                <div className="text-xl font-extrabold text-sky-600 mt-1">
                  +{result.xp_earned}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">รวม {result.totalXp} XP</div>
              </div>

              <div className="card-academy p-4 rounded-2xl bg-amber-50/50 border-amber-200 text-center">
                <div className="text-xs text-amber-700 font-semibold">Points ที่ได้รับ</div>
                <div className="text-xl font-extrabold text-amber-600 mt-1 flex items-center justify-center gap-1">
                  <Coins className="w-4 h-4 text-amber-500" />
                  +{result.points_earned || 50}
                </div>
                <div className="text-[10px] text-amber-700 mt-0.5">ใช้ตกแต่งอาณาจักร</div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-sky-500/20 transition-all"
              >
                เสร็จสิ้นและกลับสู่หน้าหลัก
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
