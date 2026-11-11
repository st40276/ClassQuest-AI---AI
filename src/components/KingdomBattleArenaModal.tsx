import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';
import confetti from 'canvas-confetti';
import { 
  Swords, Shield, Clock, CheckCircle2, XCircle, Award, 
  ArrowRight, Sparkles, AlertCircle, RefreshCw, X, BookOpen,
  Trophy, Flame, Zap, Crown
} from 'lucide-react';

interface KingdomBattleArenaModalProps {
  currentUser: User;
  targetKingdomId: string;
  defenderId: string;
  defenderName: string;
  targetKingdomName: string;
  onClose: () => void;
  onBattleFinished: () => void;
  animationsEnabled: boolean;
}

export const KingdomBattleArenaModal: React.FC<KingdomBattleArenaModalProps> = ({
  currentUser,
  targetKingdomId,
  defenderId,
  defenderName,
  targetKingdomName,
  onClose,
  onBattleFinished,
  animationsEnabled
}) => {
  // Battle state machine: 'confirm' -> 'loading' -> 'playing' -> 'submitting' -> 'result'
  const [phase, setPhase] = useState<'confirm' | 'loading' | 'playing' | 'submitting' | 'result'>('confirm');
  const [errorMsg, setErrorMsg] = useState('');

  // Battle session info from server
  const [battleId, setBattleId] = useState('');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState<Array<{ id: string; question: string; options: string[]; difficulty: string }>>([]);
  const [pointsAtStake, setPointsAtStake] = useState(50);

  // Gameplay state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(45);

  // Result state
  const [battleResult, setBattleResult] = useState<{
    result: 'victory' | 'defeat';
    score: number;
    total: number;
    pointsTransferred: number;
    attackerNewPoints: number;
    defenderNewPoints: number;
    shieldActivated: boolean;
    subject: string;
    topic: string;
    review: Array<{
      question: string;
      options: string[];
      selectedAnswer: number;
      correctAnswer: number;
      isCorrect: boolean;
      explanation: string;
    }>;
  } | null>(null);

  // Timer per question during 'playing'
  useEffect(() => {
    if (phase !== 'playing') return;
    if (timeLeft <= 0) {
      handleSelectOption(-1); // timeout = skipped / incorrect
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, timeLeft, currentIndex]);

  const handleStartBattle = async () => {
    setPhase('loading');
    setErrorMsg('');
    try {
      const data = await api.startKingdomBattle(defenderId);
      setBattleId(data.battleId);
      setSubject(data.subject);
      setTopic(data.topic);
      setQuestions(data.questions);
      setPointsAtStake(data.pointsAtStake);
      setUserAnswers(new Array(data.questions.length).fill(-1));
      setCurrentIndex(0);
      setSelectedOption(null);
      setTimeLeft(45);
      setPhase('playing');
    } catch (err: any) {
      setErrorMsg(err.message || 'ไม่สามารถเริ่มศึกท้าทายได้');
      setPhase('confirm');
    }
  };

  const handleSelectOption = (optIdx: number) => {
    setSelectedOption(optIdx);

    // Record answer
    const nextAnswers = [...userAnswers];
    nextAnswers[currentIndex] = optIdx;
    setUserAnswers(nextAnswers);

    // Proceed to next question or submit
    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(prev => prev + 1);
        setSelectedOption(null);
        setTimeLeft(45);
      } else {
        // Complete - submit to server
        handleSubmitBattle(nextAnswers);
      }
    }, 400);
  };

  const handleSubmitBattle = async (finalAnswers: number[]) => {
    setPhase('submitting');
    try {
      const res = await api.submitKingdomBattle(battleId, finalAnswers);
      setBattleResult(res);
      setPhase('result');

      if (res.result === 'victory') {
        if (animationsEnabled) {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 }
          });
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'ส่งคำตอบไม่สำเร็จ');
      setPhase('confirm');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-3xl bg-white border-2 border-amber-200/80 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-sky-50 via-white to-amber-50 border-b border-amber-200/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-400 to-blue-500 shadow-md shadow-sky-500/20 flex items-center justify-center text-white font-bold">
              <Swords className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-800">
                  KINGDOM DOMINATION: ศึกชิงอาณาจักรแห่งความรู้
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                  10/10 Victory Rule
                </span>
              </div>
              <p className="text-xs text-slate-500">
                ประลองปัญญาวิชาการเพื่อขยายอำนาจและชิง Points สู่ความรุ่งโรจน์
              </p>
            </div>
          </div>

          {phase !== 'playing' && phase !== 'submitting' && (
            <button 
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Phase 1: Confirmation Stage */}
        {phase === 'confirm' && (
          <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
            {errorMsg && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Duel Header Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Attacker (You) */}
              <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200/80 flex items-center gap-3.5 shadow-sm">
                <span className="text-3xl p-2 bg-white rounded-2xl shadow-sm border border-sky-100">
                  {currentUser.avatar}
                </span>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-100 px-2 py-0.5 rounded">
                    ผู้ท้าทาย (Attacker)
                  </span>
                  <div className="text-sm font-bold text-slate-800 mt-1">{currentUser.display_name}</div>
                  <div className="text-xs text-sky-600 font-semibold">Points ปัจจุบัน: {currentUser.points || 0}</div>
                </div>
              </div>

              {/* Defender (Target) */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center gap-3.5 shadow-sm">
                <span className="text-3xl p-2 bg-white rounded-2xl shadow-sm border border-amber-100">
                  🏰
                </span>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                    อาณาจักรเป้าหมาย (Defender)
                  </span>
                  <div className="text-sm font-bold text-slate-800 mt-1">{targetKingdomName}</div>
                  <div className="text-xs text-amber-700 font-semibold">เจ้าผู้ครอง: {defenderName}</div>
                </div>
              </div>
            </div>

            {/* Challenge Rules & Stakes Box */}
            <div className="p-5 rounded-3xl bg-[#FAF8F5] border-2 border-amber-200/60 space-y-3">
              <h4 className="text-sm font-black text-slate-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                เงื่อนไขและรางวัลการท้าทาย
              </h4>

              <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>AI สุ่ม 1 วิชาและบทเรียน:</strong> จากคลังข้อสอบ 10 สาระการเรียนรู้ระดับชั้นมัธยม</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>จำนวน 10 ข้อ:</strong> คำถามปรนัย 4 ตัวเลือก พร้อมเวลาคิดข้อละ 45 วินาที</span>
                </li>
                <li className="flex items-start gap-2">
                  <Flame className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span><strong className="text-amber-800">เกณฑ์ชนะเด็ดขาด (10/10):</strong> ต้องตอบถูกครบทั้ง 10 ข้อเท่านั้นจึงจะชนะ! หากผิดแม้แต่ข้อเดียว ถือว่าปราชัย</span>
                </li>
                <li className="flex items-start gap-2">
                  <Award className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <span><strong>รางวัลชัยชนะ:</strong> ขโมย <strong>50 Points</strong> จากอาณาจักรเป้าหมายเข้าสู่กระเป๋าเงินของคุณโดยตรง (โอนตามจริง ไม่ทำให้ยอดติดลบ)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>ระบบคุ้มครอง:</strong> หากคู่แข่งถูกพิชิต จะได้รับโล่ป้องกันอัตโนมัติ 2 ชั่วโมง</span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-2xl text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleStartBattle}
                className="flex items-center gap-2 px-7 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-black text-sm shadow-xl shadow-sky-500/25 transition-all transform hover:scale-102"
              >
                <Swords className="w-4 h-4 text-amber-300" />
                <span>ยอมรับกติกาและเริ่มการท้าทาย</span>
              </button>
            </div>
          </div>
        )}

        {/* Phase: Loading */}
        {phase === 'loading' && (
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-sky-50 border-2 border-sky-300 mx-auto flex items-center justify-center text-3xl animate-spin">
              ⚔️
            </div>
            <h3 className="text-base font-black text-slate-800">
              AI กำลังสุ่มวิชาและชุดคำถาม 10 ข้อสำหรับศึกนี้...
            </h3>
            <p className="text-xs text-slate-500">
              ดึงคำถามจากคลังบทเรียนมาตรฐานกระทรวงศึกษาธิการ
            </p>
          </div>
        )}

        {/* Phase 2: Playing Stage (10 Questions) */}
        {phase === 'playing' && questions.length > 0 && (
          <div className="p-4 sm:p-6 space-y-5 overflow-y-auto">
            {/* Battle Info Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-sky-50/70 border border-sky-200 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sky-800 bg-white px-2.5 py-1 rounded-xl shadow-sm border border-sky-100">
                  วิชา: {subject}
                </span>
                <span className="text-slate-500 hidden sm:inline truncate max-w-xs">
                  {topic}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-xl">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{timeLeft} วินาที</span>
                </div>

                <div className="font-black text-slate-700 bg-white px-3 py-1 rounded-xl shadow-sm border border-slate-200">
                  ข้อ {currentIndex + 1} / {questions.length}
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-sky-400 to-blue-600 h-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Current Question */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-amber-100 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-sky-500 text-white font-black text-xs flex items-center justify-center shrink-0">
                  {currentIndex + 1}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-slate-800 leading-relaxed">
                  {questions[currentIndex]?.question}
                </h3>
              </div>

              {/* 4 Options */}
              <div className="grid grid-cols-1 gap-2.5 pt-2">
                {questions[currentIndex]?.options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={selectedOption !== null}
                      className={`w-full p-4 rounded-2xl border-2 text-left text-xs sm:text-sm font-semibold transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-sky-500 border-sky-600 text-white shadow-md scale-101'
                          : 'bg-slate-50 border-slate-200 hover:bg-sky-50 hover:border-sky-300 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-xl flex items-center justify-center font-bold text-xs ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-white text-slate-600 shadow-sm border border-slate-200'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{option}</span>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-white shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="text-center text-[11px] text-slate-400">
              💡 เพื่อชัยชนะสูงสุด คุณต้องรักษาสถิติความถูกต้อง 100% จนจบข้อ 10
            </div>
          </div>
        )}

        {/* Phase: Submitting */}
        {phase === 'submitting' && (
          <div className="p-12 text-center space-y-4">
            <RefreshCw className="w-12 h-12 text-sky-500 animate-spin mx-auto" />
            <h3 className="text-base font-black text-slate-800">
              ระบบกำลังตรวจสอบความถูกต้องของคำตอบทั้ง 10 ข้อและคำนวณการโอน Points...
            </h3>
            <p className="text-xs text-slate-500">
              ระบบ Atomic Transaction กำลังคุ้มครองความปลอดภัยของยอดคะแนน
            </p>
          </div>
        )}

        {/* Phase 3: Result & Explanations Stage */}
        {phase === 'result' && battleResult && (
          <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
            {/* Victory / Defeat Banner */}
            <div className={`p-6 rounded-3xl text-center space-y-3 border-2 shadow-lg ${
              battleResult.result === 'victory'
                ? 'bg-gradient-to-br from-amber-50 via-white to-sky-50 border-amber-300 shadow-amber-200/50'
                : 'bg-slate-50 border-slate-300'
            }`}>
              <div className="text-5xl">
                {battleResult.result === 'victory' ? '🏆' : '🛡️'}
              </div>

              <h3 className={`text-xl sm:text-2xl font-black ${
                battleResult.result === 'victory' ? 'text-amber-800' : 'text-slate-700'
              }`}>
                {battleResult.result === 'victory'
                  ? 'VICTORY! คุณพิชิตภารกิจบุกอาณาจักรสำเร็จ!'
                  : 'DEFEAT! บุกอาณาจักรไม่สำเร็จ'}
              </h3>

              <p className="text-xs text-slate-600 max-w-md mx-auto">
                {battleResult.result === 'victory'
                  ? `ยอดเยี่ยมมาก! คุณตอบถูกครบทั้ง 10 ข้อ (10/10) ในวิชา ${battleResult.subject} ได้รับชัยชนะเด็ดขาด`
                  : `คุณตอบถูก ${battleResult.score} จาก 10 ข้อ (กฎการพิชิตอาณาจักรต้องตอบถูกครบทั้ง 10 ข้อจึงจะสามารถขโมย Points ได้)`}
              </p>

              {/* Points Transfer Highlight */}
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white border border-amber-200 shadow-sm mt-2">
                <span className="text-xs text-slate-500 font-bold">Points ที่ได้รับ:</span>
                <span className={`text-lg font-black ${
                  battleResult.pointsTransferred > 0 ? 'text-emerald-600' : 'text-slate-400'
                }`}>
                  +{battleResult.pointsTransferred} Points
                </span>
                {battleResult.pointsTransferred > 0 && (
                  <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    ขโมยจาก {targetKingdomName}
                  </span>
                )}
              </div>
            </div>

            {/* Full 10 Question Review with Teacher Explanations */}
            <div className="space-y-3">
              <h4 className="text-sm font-black text-slate-800 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-sky-600" />
                เฉลยและคำอธิบายวิชาการเชิงลึก ({battleResult.review.length} ข้อ)
              </h4>

              <div className="space-y-3">
                {battleResult.review.map((item, idx) => (
                  <div 
                    key={idx}
                    className={`p-4 rounded-2xl border-2 text-xs space-y-2 ${
                      item.isCorrect 
                        ? 'bg-emerald-50/50 border-emerald-200' 
                        : 'bg-rose-50/50 border-rose-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        <span className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 ${
                          item.isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                        }`}>
                          {idx + 1}
                        </span>
                        <p className="font-bold text-slate-800">{item.question}</p>
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        item.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {item.isCorrect ? '✓ ตอบถูก' : '✗ ตอบผิด'}
                      </span>
                    </div>

                    <div className="pl-7 space-y-1 text-[11px]">
                      <div>
                        <span className="text-slate-500">คำตอบของคุณ: </span>
                        <span className={item.isCorrect ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                          {item.selectedAnswer >= 0 ? item.options[item.selectedAnswer] : 'ไม่ได้ตอบ (หมดเวลา)'}
                        </span>
                      </div>
                      {!item.isCorrect && (
                        <div>
                          <span className="text-slate-500">คำตอบที่ถูกต้อง: </span>
                          <span className="text-emerald-700 font-bold">
                            {item.options[item.correctAnswer]}
                          </span>
                        </div>
                      )}
                      <p className="text-slate-600 bg-white/70 p-2 rounded-xl border border-slate-200/60 mt-1">
                        💡 <strong>คำอธิบาย:</strong> {item.explanation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  onBattleFinished();
                  onClose();
                }}
                className="px-7 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-black text-sm shadow-lg shadow-sky-500/25 transition-all"
              >
                เสร็จสิ้นและกลับสู่อาณาจักร
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
