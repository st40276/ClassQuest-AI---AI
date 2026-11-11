import React from 'react';
import { LearningAnalytics } from '../types';
import { 
  Sparkles, AlertTriangle, CheckCircle2, BookOpen, 
  TrendingUp, BarChart3, HelpCircle, ArrowRight, Wand2
} from 'lucide-react';

interface AnalyticsViewProps {
  analytics: LearningAnalytics | null;
  onOpenAIGenerator: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ analytics, onOpenAIGenerator }) => {
  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="card-academy p-6 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200 uppercase">
            Learning Analytics Engine
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1.5">
            ระบบวิเคราะห์ผลการเรียนรู้เชิงลึก (AI Learning Analytics)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            วิเคราะห์ความเข้าใจของนักเรียน ข้อที่ตอบผิดบ่อย และข้อเสนอแนะเชิงวิชาการเพื่อพัฒนาผู้เรียน
          </p>
        </div>

        <button
          onClick={onOpenAIGenerator}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-md shadow-sky-500/20 transition-all shrink-0"
        >
          <Wand2 className="w-4 h-4 text-amber-300" />
          <span>สร้างเควสต์ซ่อมเสริมด้วย AI</span>
        </button>
      </div>

      {/* 1. Frequent Misconceptions & Pitfalls Analysis */}
      <div className="card-academy p-6 rounded-3xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              ข้อที่นักเรียนตอบผิดบ่อย & ความเข้าใจที่คลาดเคลื่อน (Common Misconceptions)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              ระบบตรวจจับจากประวัติการตอบคำถามในทุกเกมและเควสต์
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {(analytics?.frequentMistakes || []).map((mistake, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/80 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-200 w-fit">
                  หัวข้อ: {mistake.topic}
                </span>
                <span className="text-xs font-extrabold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 w-fit">
                  ตอบผิดสูงถึง {mistake.wrongChoiceRatio}% ของผู้เล่น
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900">{mistake.questionText}</h4>

              <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs space-y-1">
                <div className="text-amber-800 font-semibold">
                  ⚠️ ข้อผิดพลาดที่พบบ่อย: <span className="font-normal text-slate-700">{mistake.commonWrongAnswer}</span>
                </div>
                <div className="text-sky-800 font-semibold">
                  💡 คำแนะนำสำหรับครู: <span className="font-normal text-slate-700">{mistake.explanationTip}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Topic Mastery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Mastered Topics */}
        <div className="card-academy p-6 rounded-3xl border border-emerald-200 space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            หัวข้อที่นักเรียนมีความเข้าใจดีเยี่ยม (Mastered Topics)
          </h3>

          <div className="space-y-3">
            {analytics?.topicMastery.filter(t => t.status === 'mastered').map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-900">{item.topic}</span>
                  <span className="text-emerald-600">{item.accuracyPercentage}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mt-2">
                  <div 
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${item.accuracyPercentage}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-500 mt-1">วิชา {item.subject} • ทำแบบทดสอบ {item.attemptsCount} ครั้ง</div>
              </div>
            ))}
          </div>
        </div>

        {/* Topics Needing Reinforcement */}
        <div className="card-academy p-6 rounded-3xl border border-amber-200 space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            หัวข้อที่ควรฝึกฝนเพิ่มเติม (Needs Practice)
          </h3>

          <div className="space-y-3">
            {analytics?.topicMastery.filter(t => t.status !== 'mastered').map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-900">{item.topic}</span>
                  <span className="text-amber-600">{item.accuracyPercentage}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mt-2">
                  <div 
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${item.accuracyPercentage}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-500 mt-1">วิชา {item.subject} • แนะนำให้ส่งเควสต์ทบทวน</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 3. AI Teaching Action Plan */}
      <div className="card-academy p-6 rounded-3xl bg-gradient-to-r from-sky-50/80 via-white to-indigo-50/80 border border-slate-200 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-sky-500" />
          <h3 className="text-base font-bold text-slate-900">แผนกลยุทธ์เสริมสร้างการเรียนรู้จาก AI (AI Action Plan)</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5">
            <span className="font-bold text-sky-700">1. การจัดกิจกรรมในห้องเรียนคาบถัดไป:</span>
            <p className="text-slate-600 leading-relaxed">
              เน้นกิจกรรมกลุ่มย่อย (Small-group quest) ที่ให้เพื่อนช่วยอธิบายเรื่องกระบวนการสังเคราะห์ด้วยแสงและการทดสอบแป้ง ช่วยลดอัตราการตอบผิดลงได้เฉลี่ย 30%
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5">
            <span className="font-bold text-sky-700">2. การใช้เกมกระตุ้นแรงจูงใจ:</span>
            <p className="text-slate-600 leading-relaxed">
              จัด Team Battle ในวิชาคณิตศาสตร์เรื่องรูปสามเหลี่ยมมุมฉาก โดยให้นักเรียนแต่ละกิลด์ส่งตัวแทนสลับกันตอบคำถามสร้างความมั่นใจ
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
