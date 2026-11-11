import React, { useState } from 'react';
import { Classroom, User } from '../types';
import { api } from '../services/api';
import { 
  BookOpen, Plus, Key, Users, CheckCircle2, 
  Trash2, ArrowRight, Shield, Award, Calendar
} from 'lucide-react';

interface ClassroomsViewProps {
  currentUser: User | null;
  classrooms: Classroom[];
  onRefreshClassrooms: () => void;
  onSelectGame: (gameId: string) => void;
}

export const ClassroomsView: React.FC<ClassroomsViewProps> = ({
  currentUser,
  classrooms,
  onRefreshClassrooms,
  onSelectGame
}) => {
  const isTeacher = currentUser?.role === 'teacher';
  const [selectedClassroom, setSelectedClassroom] = useState<(Classroom & { members?: any[]; games?: any[] }) | null>(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [joinError, setJoinError] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  // New classroom state
  const [newClassName, setNewClassName] = useState('');
  const [newSubject, setNewSubject] = useState('วิทยาศาสตร์');
  const [newGrade, setNewGrade] = useState('มัธยมศึกษาปีที่ 3');
  const [isCreating, setIsCreating] = useState(false);

  const handleOpenClassroom = async (id: string) => {
    try {
      const details = await api.getClassroom(id);
      setSelectedClassroom(details);
    } catch (err) {
      console.error(err);
    }
  };

  const handleJoinClassroom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCodeInput.trim()) return;

    setIsJoining(true);
    setJoinError('');
    try {
      await api.joinClassroom(joinCodeInput.trim());
      setShowJoinModal(false);
      setJoinCodeInput('');
      onRefreshClassrooms();
    } catch (err: any) {
      setJoinError(err.message || 'ไม่สามารถเข้าร่วมห้องเรียนได้');
    } finally {
      setIsJoining(false);
    }
  };

  const handleCreateClassroom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    setIsCreating(true);
    try {
      await api.createClassroom({
        classroom_name: newClassName.trim(),
        subject: newSubject,
        grade_level: newGrade
      });
      setShowCreateModal(false);
      setNewClassName('');
      onRefreshClassrooms();
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleRemoveStudent = async (studentId: string) => {
    if (!selectedClassroom) return;
    if (!confirm('คุณต้องการนำนักเรียนคนนี้ออกจากห้องเรียนหรือไม่?')) return;

    try {
      await api.removeStudentFromClassroom(selectedClassroom.id, studentId);
      handleOpenClassroom(selectedClassroom.id);
      onRefreshClassrooms();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* View Header */}
      <div className="card-academy p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
              {isTeacher ? 'ระบบจัดการวิชาและนักเรียน' : 'ห้องเรียนและวิชาของฉัน'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1.5">
            {isTeacher ? 'จัดการห้องเรียน (Classrooms)' : 'ห้องเรียนที่เข้าร่วม'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isTeacher 
              ? 'สร้างห้องเรียน แจกรหัส Join Code และจัดการรายชื่อนักเรียน' 
              : 'ค้นหาบทเรียนและเควสต์ที่ครูผู้สอนมอบหมายในแต่ละรายวิชา'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isTeacher ? (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-md shadow-sky-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>สร้างห้องเรียนใหม่</span>
            </button>
          ) : (
            <button
              onClick={() => setShowJoinModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all"
            >
              <Key className="w-4 h-4" />
              <span>เข้าร่วมด้วยรหัสห้อง</span>
            </button>
          )}
        </div>
      </div>

      {/* Classroom Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classrooms.map((c) => (
          <div
            key={c.id}
            className="card-academy p-5 rounded-3xl border border-slate-200 hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200 uppercase">
                  {c.subject} - {c.grade_level}
                </span>
                <div className="flex items-center gap-1 text-xs font-mono font-bold text-sky-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                  <Key className="w-3 h-3 text-sky-500" />
                  <span>{c.join_code}</span>
                </div>
              </div>

              <h3 className="text-base font-bold text-slate-900 mt-3 line-clamp-2">
                {c.classroom_name}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                ครูผู้สอน: {c.teacher_name || 'ครูวิภาดา พรสวรรค์'}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-indigo-500" />
                {c.student_count || 4} นักเรียน
              </span>

              <button
                onClick={() => handleOpenClassroom(c.id)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
              >
                <span>ดูรายละเอียด</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Classroom Detail Modal */}
      {selectedClassroom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="card-academy rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-6 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-sky-600 uppercase">
                  {selectedClassroom.subject} ({selectedClassroom.grade_level})
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                  {selectedClassroom.classroom_name}
                </h2>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                  <span>รหัสเข้าร่วมห้อง:</span>
                  <span className="font-mono font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                    {selectedClassroom.join_code}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedClassroom(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            {/* Games in this classroom */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-sky-500" /> เควสต์และเกมในห้องเรียน ({selectedClassroom.games?.length || 0})
              </h4>
              <div className="space-y-2">
                {selectedClassroom.games?.map((g: any) => (
                  <div key={g.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900">{g.title}</div>
                      <div className="text-[10px] text-amber-600 font-bold mt-0.5">รางวัล: +{g.reward_xp} XP</div>
                    </div>
                    {!isTeacher && (
                      <button
                        onClick={() => {
                          setSelectedClassroom(null);
                          onSelectGame(g.id);
                        }}
                        className="px-3.5 py-1.5 bg-sky-500 hover:bg-sky-600 rounded-xl text-xs font-bold text-white shadow-xs"
                      >
                        เข้าเล่น
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Students Roster */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-500" /> รายชื่อนักเรียน ({selectedClassroom.members?.length || 0} คน)
              </h4>
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {selectedClassroom.members?.map((m: any) => (
                  <div key={m.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{m.student?.avatar || '⚔️'}</span>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{m.student?.display_name}</div>
                        <div className="text-[10px] text-sky-600 font-semibold">
                          Lv.{m.student?.level || 1} • {m.student?.xp || 0} XP
                        </div>
                      </div>
                    </div>

                    {isTeacher && (
                      <button
                        onClick={() => handleRemoveStudent(m.student_id)}
                        className="text-xs text-rose-500 hover:text-rose-700 p-1"
                        title="นำออกจากห้อง"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Join Classroom Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="card-academy rounded-3xl max-w-sm w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-2">
              <Key className="w-5 h-5 text-emerald-500" /> เข้าร่วมห้องเรียนด้วยรหัส
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              กรอกรหัสห้องเรียนที่ได้รับจากคุณครู เช่น <code className="text-sky-600 font-bold">SCI-301</code> หรือ <code className="text-sky-600 font-bold">MATH-204</code>
            </p>

            <form onSubmit={handleJoinClassroom} className="space-y-3">
              <input
                type="text"
                value={joinCodeInput}
                onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                placeholder="กรอกรหัส เช่น SCI-301"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-center font-mono font-bold text-sm tracking-wider text-sky-700 focus:outline-none focus:border-sky-500 uppercase"
              />

              {joinError && (
                <p className="text-xs text-rose-500 font-semibold">{joinError}</p>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="flex-1 py-2 bg-slate-100 rounded-xl text-xs font-semibold text-slate-600"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isJoining}
                  className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-xs font-bold text-white shadow-xs"
                >
                  {isJoining ? 'กำลังเข้าร่วม...' : 'เข้าร่วมทันที'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Classroom Modal (Teacher) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="card-academy rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-sky-500" /> สร้างห้องเรียนใหม่
            </h3>

            <form onSubmit={handleCreateClassroom} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-600 font-semibold block mb-1">ชื่อห้องเรียน</label>
                <input
                  type="text"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="เช่น ม.3/2 วิทยาศาสตร์โลกและการสำรวจ"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs font-medium focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div>
                <label className="text-slate-600 font-semibold block mb-1">กลุ่มสาระการเรียนรู้ (วิชา)</label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs font-medium focus:outline-none focus:border-sky-500"
                >
                  <option value="วิทยาศาสตร์">วิทยาศาสตร์และเทคโนโลยี</option>
                  <option value="คณิตศาสตร์">คณิตศาสตร์</option>
                  <option value="ภาษาอังกฤษ">ภาษาต่างประเทศ (ภาษาอังกฤษ)</option>
                  <option value="ภาษาไทย">ภาษาไทย</option>
                  <option value="สังคมศึกษา">สังคมศึกษา ศาสนา และวัฒนธรรม</option>
                  <option value="สุขศึกษา">สุขศึกษาและพลศึกษา</option>
                </select>
              </div>

              <div>
                <label className="text-slate-600 font-semibold block mb-1">ระดับชั้น</label>
                <select
                  value={newGrade}
                  onChange={(e) => setNewGrade(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs font-medium focus:outline-none focus:border-sky-500"
                >
                  <option value="มัธยมศึกษาปีที่ 1">มัธยมศึกษาปีที่ 1</option>
                  <option value="มัธยมศึกษาปีที่ 2">มัธยมศึกษาปีที่ 2</option>
                  <option value="มัธยมศึกษาปีที่ 3">มัธยมศึกษาปีที่ 3</option>
                  <option value="มัธยมศึกษาปีที่ 4">มัธยมศึกษาปีที่ 4</option>
                  <option value="มัธยมศึกษาปีที่ 5">มัธยมศึกษาปีที่ 5</option>
                  <option value="มัธยมศึกษาปีที่ 6">มัธยมศึกษาปีที่ 6</option>
                </select>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2 bg-slate-100 rounded-xl font-semibold text-slate-600"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 py-2 bg-sky-500 hover:bg-sky-600 rounded-xl font-bold text-white shadow-xs"
                >
                  {isCreating ? 'กำลังสร้าง...' : 'สร้างห้องเรียน'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
