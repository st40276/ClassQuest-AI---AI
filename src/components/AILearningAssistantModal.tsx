import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Bot, Sparkles, X, Send, Lightbulb, BookOpen, 
  HelpCircle, CheckCircle2, RotateCcw
} from 'lucide-react';

interface AILearningAssistantModalProps {
  initialData?: {
    question: string;
    options: string[];
    userAnswer?: string;
    correctAnswer?: string;
    topic?: string;
    subject?: string;
  } | null;
  onClose: () => void;
}

export const AILearningAssistantModal: React.FC<AILearningAssistantModalProps> = ({
  initialData,
  onClose
}) => {
  const [explanation, setExplanation] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [customQuestion, setCustomQuestion] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([]);

  useEffect(() => {
    if (initialData) {
      fetchExplanation(initialData);
    } else {
      // General mentor greeting
      setMessages([
        {
          sender: 'ai',
          text: `🧙‍♂️ สวัสดีผู้กล้าแห่งสถาบันแฟนตาซี! ข้าคือ **ClassQuest AI Mentor** ผู้พิทักษ์แห่งการเรียนรู้\n\nเจ้าสงสัยในบทเรียนข้อไหน หรืออยากให้ข้าช่วยอธิบายเนื้อหาใดเพิ่มเติม ไม่ว่าจะเป็น วิทยาศาสตร์, คณิตศาสตร์, ภาษา หรือ ประวัติศาสตร์ สามารถพิมพ์ถามข้าได้ทันทีเลยนะ!`
        }
      ]);
    }
  }, [initialData]);

  const fetchExplanation = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await api.askAILearningAssistant(data);
      setExplanation(res);
      setMessages([
        {
          sender: 'ai',
          text: res
        }
      ]);
    } catch (err) {
      console.error('Failed to load AI explanation:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim() || isLoading) return;

    const userText = customQuestion.trim();
    setCustomQuestion('');
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setIsLoading(true);

    try {
      const reply = await api.askAILearningAssistant({
        question: userText,
        options: [],
        topic: initialData?.topic || 'คำถามนักเรียน',
        subject: initialData?.subject || 'การศึกษา'
      });

      setMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    } catch (err) {
      setMessages(prev => [
        ...prev, 
        { 
          sender: 'ai', 
          text: 'ขออภัยด้วยผู้กล้า ดูเหมือนการเชื่อมต่อกับหอคอยเวทมนตร์จะขัดข้องชั่วคราว ลองถามใหม่อีกครั้งนะ!' 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white border-2 border-amber-100 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-sky-50 via-white to-amber-50 border-b border-amber-200/50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-400 to-blue-500 shadow-md shadow-sky-500/20 flex items-center justify-center text-white">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-800">
                  ClassQuest AI Mentor
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-100 px-2 py-0.5 rounded border border-sky-300">
                  ผู้ช่วยส่วนตัว
                </span>
              </div>
              <p className="text-xs text-slate-500">อธิบายเข้าใจง่าย ยกตัวอย่างชัดเจน และเสริมกำลังใจ</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Question Context Pill if opened from question */}
        {initialData && (
          <div className="px-5 py-3 bg-amber-50/70 border-b border-amber-200/60 shrink-0">
            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
              โจทย์ที่กำลังปรึกษา
            </span>
            <p className="text-xs font-semibold text-slate-800 truncate mt-0.5">
              "{initialData.question}"
            </p>
          </div>
        )}

        {/* Message Thread */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 bg-[#FAF8F5]">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0 ${
                msg.sender === 'user' 
                  ? 'bg-sky-500 text-white shadow-sm' 
                  : 'bg-white border border-amber-200 text-sky-600 shadow-sm'
              }`}>
                {msg.sender === 'user' ? '👤' : <Bot className="w-4 h-4 text-sky-600" />}
              </div>

              <div className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-sky-500 text-white font-medium rounded-tr-none shadow-md shadow-sky-500/20'
                  : 'bg-white border border-amber-100 text-slate-800 rounded-tl-none whitespace-pre-line shadow-sm'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white border border-amber-200 flex items-center justify-center">
                <Bot className="w-4 h-4 text-sky-500 animate-pulse" />
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-amber-100 text-xs text-slate-600 flex items-center gap-2 shadow-sm">
                <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
                <span>AI Mentor กำลังเรียบเรียงคำอธิบายเชิงผจญภัย...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200 shrink-0 flex items-center gap-2">
          <input
            type="text"
            value={customQuestion}
            onChange={(e) => setCustomQuestion(e.target.value)}
            placeholder="พิมพ์ถามเนื้อหา เช่น ทำไมถึงตอบข้อนี้ หรือ ขอตัวอย่างเพิ่ม..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-sky-500 font-medium"
          />
          <button
            type="submit"
            disabled={!customQuestion.trim() || isLoading}
            className="p-2.5 rounded-2xl bg-sky-500 hover:bg-sky-600 disabled:opacity-40 text-white font-bold transition-all shadow-md shadow-sky-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
