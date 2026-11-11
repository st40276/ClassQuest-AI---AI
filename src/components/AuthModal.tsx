import React, { useState } from 'react';
import { User } from '../types';
import { api } from '../services/api';
import { 
  Sparkles, Sword, BookOpen, Shield, 
  LogIn, UserPlus, X, CheckCircle2 
} from 'lucide-react';

interface AuthModalProps {
  users: User[];
  currentUser: User | null;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  users,
  currentUser,
  onClose,
  onSuccess
}) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  
  // Login form
  const [usernameInput, setUsernameInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Register form
  const [regUsername, setRegUsername] = useState('');
  const [regDisplayName, setRegDisplayName] = useState('');
  const [regRole, setRegRole] = useState<'student' | 'teacher'>('student');
  const [regGrade, setRegGrade] = useState('มัธยมศึกษาปีที่ 3');
  const [regSchool, setRegSchool] = useState('โรงเรียนสาธิตวิทยาคมราชพฤกษ์');
  const [regAvatar, setRegAvatar] = useState('⚔️');
  const [regError, setRegError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;

    setIsSubmitting(true);
    setLoginError('');
    try {
      const res = await api.login(usernameInput.trim());
      onSuccess(res.user);
      onClose();
    } catch (err: any) {
      setLoginError(err.message || 'เข้าสู่ระบบไม่สำเร็จ');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regUsername.trim() || !regDisplayName.trim()) {
      setRegError('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    setIsSubmitting(true);
    setRegError('');
    try {
      const res = await api.register({
        username: regUsername.trim(),
        display_name: regDisplayName.trim(),
        role: regRole,
        grade: regGrade,
        school: regSchool,
        avatar: regAvatar
      });
      onSuccess(res.user);
      onClose();
    } catch (err: any) {
      setRegError(err.message || 'ลงทะเบียนไม่สำเร็จ');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white border-2 border-amber-100 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-6 my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-200/50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-400 to-blue-500 flex items-center justify-center shadow-md shadow-sky-500/20 text-white">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-800">
                ระบบสมาชิก ClassQuest AI
              </h2>
              <p className="text-[11px] text-slate-500">เข้าสู่ระบบผจญภัยหรือลงทะเบียนผู้ใช้ใหม่</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-amber-50/70 rounded-2xl border border-amber-200/60 text-xs font-bold">
          <button
            onClick={() => setTab('login')}
            className={`py-2 rounded-xl transition-all ${
              tab === 'login' ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            เข้าสู่ระบบ (Login)
          </button>
          <button
            onClick={() => setTab('register')}
            className={`py-2 rounded-xl transition-all ${
              tab === 'register' ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            สมัครสมาชิกใหม่ (Register)
          </button>
        </div>

        {/* Tab 1: Login */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="text-slate-700 font-semibold block mb-1">
                ชื่อผู้ใช้งาน (Username)
              </label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="เช่น panupong, kru.wiphada, kanda"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-medium focus:outline-none focus:border-sky-500"
                required
              />
            </div>

            {loginError && <p className="text-rose-600 font-medium">{loginError}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold text-sm shadow-lg shadow-sky-500/25 transition-all"
            >
              {isSubmitting ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบผจญภัย'}
            </button>

            {/* Quick Demo Logins */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                บัญชีสาธิตพร้อมใช้งาน (คลิกเพื่อเข้าสู่ระบบทันที):
              </span>
              <div className="space-y-1.5">
                {users.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={async () => {
                      const res = await api.switchUser(u.id);
                      onSuccess(res.user);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl bg-amber-50/50 hover:bg-sky-50 border border-amber-200/60 hover:border-sky-300 text-left transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{u.avatar}</span>
                      <div>
                        <div className="font-bold text-slate-800">{u.display_name}</div>
                        <div className="text-[10px] text-sky-700">username: {u.username}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-sky-700 bg-sky-100 px-2 py-0.5 rounded border border-sky-300">
                      {u.role === 'teacher' ? 'ครูผู้สอน' : 'นักเรียน'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </form>
        )}

        {/* Tab 2: Register */}
        {tab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
            <div>
              <label className="text-slate-700 font-semibold block mb-1">
                บทบาท (Role)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setRegRole('student');
                    setRegAvatar('⚔️');
                  }}
                  className={`p-2.5 rounded-xl border text-center font-bold ${
                    regRole === 'student'
                      ? 'bg-sky-50 border-sky-400 text-sky-800'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  ⚔️ นักเรียน (Student)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRegRole('teacher');
                    setRegAvatar('🧙‍♀️');
                  }}
                  className={`p-2.5 rounded-xl border text-center font-bold ${
                    regRole === 'teacher'
                      ? 'bg-sky-50 border-sky-400 text-sky-800'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  🧙‍♀️ ครูผู้สอน (Teacher)
                </button>
              </div>
            </div>

            <div>
              <label className="text-slate-700 font-semibold block mb-1">
                ชื่อผู้ใช้ (Username ภาษาอังกฤษ)
              </label>
              <input
                type="text"
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
                placeholder="เช่น somchai_hero"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-none focus:border-sky-500"
                required
              />
            </div>

            <div>
              <label className="text-slate-700 font-semibold block mb-1">
                ชื่อ-นามสกุล ที่แสดงในระบบ
              </label>
              <input
                type="text"
                value={regDisplayName}
                onChange={(e) => setRegDisplayName(e.target.value)}
                placeholder="เช่น สมชาย ใจมั่น"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-none focus:border-sky-500"
                required
              />
            </div>

            <div>
              <label className="text-slate-700 font-semibold block mb-1">
                {regRole === 'student' ? 'ระดับชั้น' : 'ตำแหน่ง / กลุ่มสาระ'}
              </label>
              <input
                type="text"
                value={regGrade}
                onChange={(e) => setRegGrade(e.target.value)}
                placeholder="เช่น มัธยมศึกษาปีที่ 3/1"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-none focus:border-sky-500"
              />
            </div>

            {regError && <p className="text-rose-600 font-medium">{regError}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold text-sm shadow-lg shadow-sky-500/25 transition-all mt-2"
            >
              {isSubmitting ? 'กำลังสร้างบัญชี...' : 'ลงทะเบียนและเริ่มใช้งาน'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
