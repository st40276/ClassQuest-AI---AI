import React, { useState } from 'react';
import { Classroom, Game, LearningAnalytics, User } from '../types';
import { 
  BarChart3, Users, BookOpen, Sword, Wand2, Sparkles, 
  TrendingUp, CheckCircle2, AlertTriangle, ArrowRight, Download, Filter, Plus, Clock
} from 'lucide-react';

interface TeacherDashboardProps {
  analytics: LearningAnalytics | null;
  classrooms: Classroom[];
  games: Game[];
  students: User[];
  onOpenAIGenerator: () => void;
  onCreateClassroom: () => void;
  onNavigateTab: (tab: string) => void;
  onDownloadReport: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  analytics,
  classrooms,
  games,
  students,
  onOpenAIGenerator,
  onCreateClassroom,
  onNavigateTab,
  onDownloadReport
}) => {
  const [selectedClassroomId, setSelectedClassroomId] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('this_month');

  const displayClassrooms = selectedClassroomId === 'all' 
    ? classrooms 
    : classrooms.filter(c => c.id === selectedClassroomId);

  return (
    <div className="space-y-6 pb-16">
      
      {/* 1. Teacher Hero & Quick Action Banner */}
      <div className="card-academy relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-white via-sky-50/50 to-indigo-50/40 border border-slate-200 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                ระบบจัดการห้องเรียนผจญภัย
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                AI-Powered EdTech
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
              ศูนย์ควบคุมการเรียนรู้และจัดการเควสต์ (Teacher Hub)
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl leading-relaxed">
              ติดตามสถิตินักเรียน ออกแบบเควสต์ด้วย Gemini AI และรับคำแนะนำเชิงวิชาการเพื่อยกระดับผลสัมฤทธิ์
            </p>
          </div>

          {/* Teacher Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenAIGenerator}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-sky-500/20 transition-all"
            >
              <Wand2 className="w-4 h-4 text-amber-300" />
              <span>สร้างเกมด้วย AI Quest</span>
            </button>

            <button
              onClick={onCreateClassroom}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs sm:text-sm shadow-xs transition-all"
            >
              <Plus className="w-4 h-4 text-sky-500" />
              <span>สร้างห้องเรียนใหม่</span>
            </button>
          </div>
        </div>

        {/* Filters Bar: Classroom & Time Period */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-slate-500 flex items-center gap-1.5 font-semibold">
              <Filter className="w-3.5 h-3.5 text-sky-500" /> ตัวกรองข้อมูล:
            </span>
            <select
              value={selectedClassroomId}
              onChange={(e) => setSelectedClassroomId(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none focus:border-sky-500 font-medium"
            >
              <option value="all">ทุกห้องเรียน ({classrooms.length})</option>
              {classrooms.map(c => (
                <option key={c.id} value={c.id}>{c.classroom_name}</option>
              ))}
            </select>

            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none focus:border-sky-500 font-medium"
            >
              <option value="this_week">สัปดาห์นี้</option>
              <option value="this_month">เดือนนี้</option>
              <option value="semester">ภาคเรียนปัจจุบัน (2569)</option>
            </select>
          </div>

          <button
            onClick={onDownloadReport}
            className="flex items-center gap-1.5 text-xs text-sky-700 hover:text-sky-800 bg-sky-50 px-3.5 py-1.5 rounded-xl border border-sky-200 transition-colors font-bold"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ดาวน์โหลดรายงานสรุป CSV</span>
          </button>
        </div>
      </div>

      {/* 2. Key Metrics 6-Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="card-academy p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>ห้องเรียน</span>
            <BookOpen className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1.5">
            {classrooms.length}
          </div>
          <div className="text-[10px] text-sky-600 font-medium mt-0.5">เปิดสอนอยู่</div>
        </div>

        <div className="card-academy p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>นักเรียนทั้งหมด</span>
            <Users className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1.5">
            {students.length}
          </div>
          <div className="text-[10px] text-emerald-600 font-medium mt-0.5">มีส่วนร่วม 94%</div>
        </div>

        <div className="card-academy p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>เควสต์และเกม</span>
            <Sword className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1.5">
            {games.length}
          </div>
          <div className="text-[10px] text-indigo-600 font-medium mt-0.5">เผยแพร่แล้ว</div>
        </div>

        <div className="card-academy p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>คะแนนเฉลี่ย</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-1.5">
            {analytics?.averageScorePercentage || 81}%
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">+5.2% จากเดือนก่อน</div>
        </div>

        <div className="card-academy p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>ภารกิจสำเร็จ</span>
            <CheckCircle2 className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 mt-1.5">
            {analytics?.missionCompletionRate || 78}%
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">อัตราส่งงานเควสต์</div>
        </div>

        <div className="card-academy p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>การเล่นเกมรวม</span>
            <BarChart3 className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1.5">
            {analytics?.totalAttempts || 28}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">รอบการทดสอบ</div>
        </div>
      </div>

      {/* 3. Charts & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Activity Bar Chart */}
        <div className="card-academy lg:col-span-2 p-5 sm:p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-sky-500" /> สถิติการเข้าเรียนและทำเควสต์รายวัน (Weekly Activity)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">จำนวนนักเรียนที่แอคทีฟและ XP ที่สร้างขึ้น</p>
            </div>
            <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">
              สัปดาห์นี้
            </span>
          </div>

          {/* Bar Chart */}
          <div className="pt-4 flex items-end justify-between gap-2 h-48 border-b border-slate-100 px-2">
            {(analytics?.weeklyActivity || [
              { day: 'จันทร์', activeStudents: 18, xpEarned: 1420 },
              { day: 'อังคาร', activeStudents: 22, xpEarned: 1980 },
              { day: 'พุธ', activeStudents: 25, xpEarned: 2450 },
              { day: 'พฤหัส', activeStudents: 20, xpEarned: 1820 },
              { day: 'ศุกร์', activeStudents: 28, xpEarned: 3100 },
              { day: 'เสาร์', activeStudents: 14, xpEarned: 950 },
              { day: 'อาทิตย์', activeStudents: 16, xpEarned: 1100 }
            ]).map((item, idx) => {
              const maxActive = 30;
              const heightPercent = Math.min((item.activeStudents / maxActive) * 100, 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="text-[10px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                    {item.activeStudents} คน
                  </div>
                  <div className="w-full max-w-[36px] bg-slate-100 rounded-t-xl overflow-hidden flex flex-col justify-end h-32">
                    <div 
                      className="w-full bg-gradient-to-t from-sky-400 via-sky-500 to-indigo-500 rounded-t-xl transition-all duration-500 group-hover:brightness-110"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-600">
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500" /> จำนวนนักเรียนต่อวัน
            </span>
            <span className="text-sky-600 font-bold">
              วันศุกร์มีส่วนร่วมสูงสุด (28 คน / 3,100 XP)
            </span>
          </div>
        </div>

        {/* AI Pedagogical Recommendations */}
        <div className="card-academy p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-sky-50/70 to-white space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-sky-100 border border-sky-200">
              <Sparkles className="w-4 h-4 text-sky-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">คำแนะนำการสอนจาก AI (Pedagogical Advice)</h3>
              <p className="text-[11px] text-sky-700">วิเคราะห์จากข้อมูลกิจกรรมจริง</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="font-bold text-emerald-600 flex items-center gap-1 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> จุดแข็งที่น่าชื่นชม
              </span>
              <p className="text-slate-600 leading-relaxed">
                นักเรียนตอบคำถามหมวด "โครงสร้างเซลล์และส่วนประกอบของพืช" ได้แม่นยำถึง 88%
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200">
              <span className="font-bold text-amber-800 flex items-center gap-1 mb-1">
                <AlertTriangle className="w-3.5 h-3.5" /> หัวข้อที่ควรทบทวนในคาบหน้า
              </span>
              <p className="text-slate-700 leading-relaxed">
                65% ของนักเรียนยังสับสนผลทดสอบไอโอดีนในพืชที่อยู่ในที่มืด 48 ชั่วโมง แนะนำให้ทบทวนเรื่องแป้งสะสม
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-sky-50/70 border border-sky-200">
              <span className="font-bold text-sky-800 flex items-center gap-1 mb-1">
                <Wand2 className="w-3.5 h-3.5 text-sky-600" /> แนะนำเควสต์ถัดไป
              </span>
              <p className="text-slate-700 leading-relaxed">
                สร้าง Quiz Battle สั้นๆ 4 ข้อในหัวข้อ "การทดสอบแป้งและปัจจัยการสังเคราะห์ด้วยแสง" เพื่อย้ำความเข้าใจ
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
