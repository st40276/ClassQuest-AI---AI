import React, { useState } from 'react';
import { User, Classroom, LearningAnalytics, Game } from '../types';
import { 
  FileText, Download, Filter, Search, CheckCircle2, 
  BarChart3, UserCheck, Calendar, ArrowDownToLine, Trophy
} from 'lucide-react';

interface ReportsViewProps {
  currentUser: User | null;
  classrooms: Classroom[];
  analytics: LearningAnalytics | null;
  games: Game[];
  onDownloadCSV: () => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  currentUser,
  classrooms,
  analytics,
  games,
  onDownloadCSV
}) => {
  const isTeacher = currentUser?.role === 'teacher';
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedClassroom, setSelectedClassroom] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const students = analytics?.studentPerformances || [];
  const filteredStudents = students.filter(s => {
    if (searchQuery && !s.displayName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="card-academy p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-sky-700 bg-sky-100 px-3 py-1 rounded-full border border-sky-300 uppercase tracking-wide">
            Official Reports
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 mt-2">
            {isTeacher ? 'รายงานผลสัมฤทธิ์และสถิติห้องเรียน' : 'รายงานผลการเรียนรู้ส่วนบุคคล'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {isTeacher 
              ? 'สรุปผลการทำแบบทดสอบ อัตราการเข้าร่วม และดาวน์โหลดข้อมูล CSV สำหรับระบบงานวิชาการ'
              : 'สถิติการเล่นเกม คะแนน และประวัติการทำภารกิจของคุณ'}
          </p>
        </div>

        {/* CSV Download Button */}
        <button
          onClick={onDownloadCSV}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all shrink-0"
        >
          <ArrowDownToLine className="w-4 h-4" />
          <span>ดาวน์โหลดรายงานสรุป CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="card-academy p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาชื่อนักเรียน..."
              className="bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-slate-800 focus:outline-none focus:border-sky-500 w-44 sm:w-56"
            />
          </div>

          <select
            value={selectedClassroom}
            onChange={(e) => setSelectedClassroom(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none"
          >
            <option value="all">ทุกห้องเรียน</option>
            {classrooms.map(c => (
              <option key={c.id} value={c.id}>{c.classroom_name}</option>
            ))}
          </select>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none"
          >
            <option value="all">ทุกรายวิชา</option>
            <option value="วิทยาศาสตร์">วิทยาศาสตร์</option>
            <option value="คณิตศาสตร์">คณิตศาสตร์</option>
            <option value="ภาษาอังกฤษ">ภาษาอังกฤษ</option>
          </select>
        </div>

        <span className="text-slate-500 font-semibold">
          แสดงผล {filteredStudents.length} รายการ
        </span>
      </div>

      {/* Table: Individual Student Deep Dive */}
      <div className="card-academy overflow-hidden">
        <div className="p-4 bg-amber-50/50 border-b border-amber-200/50 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-sky-600" />
            {isTeacher ? 'รายชื่อและผลการเรียนรายบุคคล' : 'ประวัติและผลงานของคุณ'}
          </h3>
          <span className="text-[11px] text-sky-700 font-semibold">
            เกณฑ์คะแนนเฉลี่ยอิงผลจริง
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-3.5 pl-5">นักเรียน</th>
                <th className="p-3.5">เลเวล & ฉายา</th>
                <th className="p-3.5">XP รวม</th>
                <th className="p-3.5">รอบเกมที่เล่น</th>
                <th className="p-3.5">คะแนนเฉลี่ย</th>
                <th className="p-3.5">อัตราการมีส่วนร่วม</th>
                <th className="p-3.5 text-right pr-5">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((st) => (
                <tr key={st.studentId} className="hover:bg-amber-50/30 transition-colors">
                  <td className="p-3.5 pl-5 font-bold text-slate-800 flex items-center gap-2.5">
                    <span className="text-lg">{st.avatar}</span>
                    <span>{st.displayName}</span>
                  </td>
                  <td className="p-3.5 text-sky-700 font-semibold">
                    Level {st.level}
                  </td>
                  <td className="p-3.5 font-bold text-amber-600">
                    {st.xp.toLocaleString()} XP
                  </td>
                  <td className="p-3.5 text-slate-600">
                    {st.attemptsCount} รอบ
                  </td>
                  <td className="p-3.5">
                    <span className={`font-bold ${
                      st.avgScore >= 80 ? 'text-emerald-600' : st.avgScore >= 60 ? 'text-amber-600' : 'text-rose-600'
                    }`}>
                      {st.avgScore}%
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-600">
                    {st.attendanceRate}%
                  </td>
                  <td className="p-3.5 text-right pr-5">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-300">
                      <CheckCircle2 className="w-3 h-3" /> ปกติ
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
