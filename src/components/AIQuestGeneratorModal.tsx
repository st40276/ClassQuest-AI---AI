import React, { useState } from 'react';
import { Classroom, DifficultyLevel, GameType, QuestionStyle } from '../types';
import { api } from '../services/api';
import { 
  Wand2, Sparkles, CheckCircle2, Trash2, Plus, 
  Clock, Shield, BookOpen, AlertCircle, Save, X, Edit3, Coins
} from 'lucide-react';

interface AIQuestGeneratorModalProps {
  classrooms: Classroom[];
  onClose: () => void;
  onGameCreated: () => void;
}

export const AIQuestGeneratorModal: React.FC<AIQuestGeneratorModalProps> = ({
  classrooms,
  onClose,
  onGameCreated
}) => {
  // Generator Parameters
  const [subject, setSubject] = useState('วิทยาศาสตร์');
  const [topic, setTopic] = useState('การสังเคราะห์ด้วยแสงและการดำรงชีวิตของพืช');
  const [gradeLevel, setGradeLevel] = useState('มัธยมศึกษาปีที่ 3');
  const [questionCount, setQuestionCount] = useState(4);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [gameType, setGameType] = useState<GameType>('quiz_battle');
  const [questionStyle, setQuestionStyle] = useState<QuestionStyle>('multiple_choice');
  const [selectedClassroomId, setSelectedClassroomId] = useState(classrooms[0]?.id || 'c-1');

  // Generator State
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedTitle, setGeneratedTitle] = useState('');
  const [generatedDesc, setGeneratedDesc] = useState('');
  const [rewardXp, setRewardXp] = useState(180);
  const [timeLimit, setTimeLimit] = useState(30);
  const [questions, setQuestions] = useState<any[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Quick preset topics
  const presetTemplates = [
    { subject: 'วิทยาศาสตร์', topic: 'การแบ่งเซลล์แบบไมโทซิสและไมโอซิส', grade: 'มัธยมศึกษาปีที่ 3' },
    { subject: 'คณิตศาสตร์', topic: 'ทฤษฎีบทพีทาโกรัสและอัตราส่วนตรีโกณมิติ', grade: 'มัธยมศึกษาปีที่ 2' },
    { subject: 'ภาษาอังกฤษ', topic: 'Past Continuous & Past Simple with While/When', grade: 'มัธยมศึกษาปีที่ 4' },
    { subject: 'สังคมศึกษา', topic: 'ประวัติศาสตร์อยุธยาและความสัมพันธ์ระหว่างประเทศ', grade: 'มัธยมศึกษาปีที่ 2' },
    { subject: 'สุขศึกษา', topic: 'โภชนาการและการสร้างเสริมภูมิคุ้มกันร่างกาย', grade: 'มัธยมศึกษาปีที่ 1' },
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const data = await api.generateAIQuest({
        subject,
        topic,
        gradeLevel,
        questionCount,
        difficulty,
        gameType,
        questionStyle
      });

      setGeneratedTitle(data.questTitle || `เควสต์ผจญภัย: ${topic}`);
      setGeneratedDesc(data.description || `บทเรียนผจญภัยในวิชา ${subject}`);
      setRewardXp(data.rewardXp || 180);
      setQuestions(data.questions || []);
    } catch (err) {
      console.error('AI Generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, idx) => idx !== index));
  };

  const handleAddQuestion = () => {
    const newQ = {
      question: 'ข้อใดคือคำตอบที่ถูกต้องตามหลักการ?',
      options: ['ตัวเลือกที่ 1', 'ตัวเลือกที่ 2', 'ตัวเลือกที่ 3', 'ตัวเลือกที่ 4'],
      correct_answer: 0,
      explanation: 'คำอธิบายเชิงวิชาการสำหรับข้อนี้',
      difficulty: 'medium',
      points: 10
    };
    setQuestions([...questions, newQ]);
    setEditingIndex(questions.length);
  };

  const handleSaveAndPublish = async () => {
    if (!generatedTitle || questions.length === 0) {
      alert('กรุณาสร้างหรือเพิ่มคำถามอย่างน้อย 1 ข้อ');
      return;
    }

    setIsSaving(true);
    try {
      await api.createGame({
        title: generatedTitle,
        subject,
        topic,
        difficulty,
        game_type: gameType,
        classroom_id: selectedClassroomId,
        reward_xp: rewardXp,
        time_limit: timeLimit,
        questions
      });

      onGameCreated();
      onClose();
    } catch (err: any) {
      alert(err.message || 'บันทึกเกมล้มเหลว');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-4xl bg-white border-2 border-amber-100 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-sky-50 via-white to-amber-50 border-b border-amber-200/50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-400 to-blue-500 shadow-md shadow-sky-500/20 flex items-center justify-center text-white">
              <Wand2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-800">
                  AI Quest Generator
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-100 px-2 py-0.5 rounded border border-sky-300">
                  Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-xs text-slate-500">สร้างแบบทดสอบและเควสต์เกมผจญภัยอัตโนมัติตามหลักสูตรแกนกลาง</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Quick Preset Topics */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
              หัวข้อตัวอย่างยอดนิยม (คลิกเพื่อเลือกทันที)
            </label>
            <div className="flex flex-wrap gap-2">
              {presetTemplates.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSubject(item.subject);
                    setTopic(item.topic);
                    setGradeLevel(item.grade);
                  }}
                  className="text-xs px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 text-slate-700 transition-all text-left"
                >
                  <span className="font-bold text-sky-600">[{item.subject}]</span> {item.topic}
                </button>
              ))}
            </div>
          </div>

          {/* Generator Config Form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-amber-50/40 border border-amber-200/60">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                ชื่อวิชา
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="เช่น วิทยาศาสตร์, คณิตศาสตร์"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-sky-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                หัวข้อบทเรียน
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="เช่น การสังเคราะห์ด้วยแสง, พีทาโกรัส"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-sky-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                ระดับชั้น
              </label>
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-sky-500 font-medium"
              >
                <option value="มัธยมศึกษาปีที่ 1">มัธยมศึกษาปีที่ 1 (ม.1)</option>
                <option value="มัธยมศึกษาปีที่ 2">มัธยมศึกษาปีที่ 2 (ม.2)</option>
                <option value="มัธยมศึกษาปีที่ 3">มัธยมศึกษาปีที่ 3 (ม.3)</option>
                <option value="มัธยมศึกษาปีที่ 4">มัธยมศึกษาปีที่ 4 (ม.4)</option>
                <option value="มัธยมศึกษาปีที่ 5">มัธยมศึกษาปีที่ 5 (ม.5)</option>
                <option value="มัธยมศึกษาปีที่ 6">มัธยมศึกษาปีที่ 6 (ม.6)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                ประเภทเกม
              </label>
              <select
                value={gameType}
                onChange={(e) => setGameType(e.target.value as GameType)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-sky-500 font-medium"
              >
                <option value="quiz_battle">⚔️ Quiz Battle (ประลองคำถามรายบุคคล)</option>
                <option value="team_battle">🛡️ Team Battle (แข่งขันรวมแต้มกิลด์)</option>
                <option value="mission_quest">📜 Mission Quest (เควสต์เนื้อเรื่องผจญภัย)</option>
                <option value="daily_challenge">🔥 Daily Challenge (ภารกิจประจำวัน)</option>
                <option value="weekly_challenge">👑 Weekly Challenge (มหาศึกประจำสัปดาห์)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                ระดับความยาก
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-sky-500 font-medium"
              >
                <option value="easy">ง่าย (Beginner / ทบทวนความจำ)</option>
                <option value="medium">ปานกลาง (Standard / ความเข้าใจ)</option>
                <option value="hard">ท้าทาย (Advanced / วิเคราะห์ประยุกต์)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                จำนวนข้อ (1 - 10)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-sky-500 font-medium"
              />
            </div>
          </div>

          {/* Action Trigger Button */}
          <div className="flex justify-center">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex items-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-black text-sm shadow-xl shadow-sky-500/25 transition-all transform hover:scale-102"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
                  <span>AI กำลังออกแบบเควสต์และคำถามตามหลักสูตร...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5 text-amber-300" />
                  <span>สร้างเควสต์และคำถามด้วย AI ทันที</span>
                </>
              )}
            </button>
          </div>

          {/* Generated Content Preview & Editor */}
          {questions.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    ชื่อเกมที่สร้าง
                  </label>
                  <input
                    type="text"
                    value={generatedTitle}
                    onChange={(e) => setGeneratedTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-base font-bold text-slate-800 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">
                      รางวัล XP
                    </label>
                    <input
                      type="number"
                      value={rewardXp}
                      onChange={(e) => setRewardXp(Number(e.target.value))}
                      className="w-24 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-amber-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">
                      เวลา/ข้อ (วิ)
                    </label>
                    <input
                      type="number"
                      value={timeLimit}
                      onChange={(e) => setTimeLimit(Number(e.target.value))}
                      className="w-20 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-sky-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Classroom Assignment */}
              <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-bold text-sky-800 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-sky-600" /> เผยแพร่ไปยังห้องเรียน:
                </span>
                <select
                  value={selectedClassroomId}
                  onChange={(e) => setSelectedClassroomId(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none shadow-sm"
                >
                  {classrooms.map(c => (
                    <option key={c.id} value={c.id}>{c.classroom_name} ({c.grade_level})</option>
                  ))}
                </select>
              </div>

              {/* Questions List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-800">
                    รายการคำถาม ({questions.length} ข้อ)
                  </h4>
                  <button
                    onClick={handleAddQuestion}
                    className="flex items-center gap-1 text-xs text-sky-600 hover:text-sky-700 font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" /> เพิ่มคำถามใหม่
                  </button>
                </div>

                {questions.map((q, idx) => {
                  const isEditing = editingIndex === idx;

                  if (isEditing) {
                    return (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-50 border-2 border-sky-400 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-sky-700">แก้ไขข้อ {idx + 1}</span>
                          <button
                            onClick={() => setEditingIndex(null)}
                            className="text-xs text-slate-500 hover:text-slate-800"
                          >
                            ยกเลิก
                          </button>
                        </div>

                        <div>
                          <label className="text-xs text-slate-600">คำถาม</label>
                          <input
                            type="text"
                            value={q.question}
                            onChange={(e) => {
                              const updated = [...questions];
                              updated[idx].question = e.target.value;
                              setQuestions(updated);
                            }}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 mt-1"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {q.options.map((opt: string, optIdx: number) => (
                            <div key={optIdx} className="flex items-center gap-2">
                              <input
                                type="radio"
                                name={`correct-${idx}`}
                                checked={q.correct_answer === optIdx}
                                onChange={() => {
                                  const updated = [...questions];
                                  updated[idx].correct_answer = optIdx;
                                  setQuestions(updated);
                                }}
                              />
                              <input
                                type="text"
                                value={opt}
                                onChange={(e) => {
                                  const updated = [...questions];
                                  updated[idx].options[optIdx] = e.target.value;
                                  setQuestions(updated);
                                }}
                                className="flex-1 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700"
                              />
                            </div>
                          ))}
                        </div>

                        <div>
                          <label className="text-xs text-slate-600">คำอธิบายเฉลย</label>
                          <textarea
                            value={q.explanation}
                            onChange={(e) => {
                              const updated = [...questions];
                              updated[idx].explanation = e.target.value;
                              setQuestions(updated);
                            }}
                            rows={2}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs text-slate-700 mt-1"
                          />
                        </div>

                        <button
                          onClick={() => setEditingIndex(null)}
                          className="px-4 py-1.5 bg-sky-500 hover:bg-sky-600 rounded-xl text-xs font-bold text-white shadow-sm"
                        >
                          บันทึกข้อนี้
                        </button>
                      </div>
                    );
                  }

                  return (
                    <div key={idx} className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-sm">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 rounded-lg bg-sky-100 border border-sky-300 text-[10px] font-bold text-sky-700 flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <div>
                            <p className="text-xs sm:text-sm font-bold text-slate-800">{q.question}</p>
                            <span className="text-[10px] text-amber-600 font-semibold">คะแนน: {q.points || 10} แต้ม</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => setEditingIndex(idx)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                            title="แก้ไข"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteQuestion(idx)}
                            className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                            title="ลบ"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                        {q.options.map((opt: string, optIdx: number) => (
                          <div 
                            key={optIdx}
                            className={`px-2.5 py-1.5 rounded-xl text-xs font-medium ${
                              optIdx === q.correct_answer 
                                ? 'bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold'
                                : 'bg-slate-50 border border-slate-200 text-slate-600'
                            }`}
                          >
                            <span className="mr-1.5 font-bold">{String.fromCharCode(65 + optIdx)}.</span>
                            {opt}
                          </div>
                        ))}
                      </div>

                      <p className="text-[11px] text-slate-500 pt-1">
                        💡 <strong>คำอธิบาย:</strong> {q.explanation}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Final Save & Publish Button */}
              <div className="pt-4 flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  ยกเลิก
                </button>

                <button
                  onClick={handleSaveAndPublish}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'กำลังเผยแพร่...' : 'บันทึกและเผยแพร่เกมให้นักเรียนเล่น'}</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
