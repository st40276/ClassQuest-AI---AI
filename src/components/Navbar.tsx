import React, { useState } from 'react';
import { User, Notification } from '../types';
import { 
  Sparkles, Sword, Trophy, Users, BookOpen, 
  BarChart3, Bell, Menu, X, ChevronDown, 
  Flame, Shield, LogOut, Wand2, FileText, CheckCircle2,
  Castle, Coins, Film
} from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  users: User[];
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onSwitchUser: (userId: string) => void;
  onOpenAuth: () => void;
  onOpenWallet: () => void;
  notifications: Notification[];
  onMarkNotificationRead: (id: string) => void;
  animationsEnabled: boolean;
  onToggleAnimations: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  users,
  currentTab,
  setCurrentTab,
  onSwitchUser,
  onOpenAuth,
  onOpenWallet,
  notifications,
  onMarkNotificationRead,
  animationsEnabled,
  onToggleAnimations
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.read_status);
  const isTeacher = currentUser?.role === 'teacher';

  interface NavTab {
    id: string;
    label: string;
    icon: any;
    highlight?: boolean;
    badge?: string;
  }

  const studentTabs: NavTab[] = [
    { id: 'dashboard', label: 'หน้าหลัก', icon: Sword },
    { id: 'kingdom', label: 'ศึกชิงอาณาจักร', icon: Castle, highlight: true, badge: 'Domination' },
    { id: 'games', label: 'เควสต์และเกม', icon: Sparkles },
    { id: 'classrooms', label: 'ห้องเรียน', icon: BookOpen },
    { id: 'teams', label: 'กิลด์และทีม', icon: Users },
    { id: 'badges', label: 'ตราเกียรติยศ', icon: Trophy },
    { id: 'leaderboard', label: 'ตารางผู้นำ', icon: Shield },
    { id: 'reports', label: 'รายงานของฉัน', icon: FileText },
  ];

  const teacherTabs: NavTab[] = [
    { id: 'teacher_dashboard', label: 'แดชบอร์ดครู', icon: BarChart3 },
    { id: 'classrooms', label: 'จัดการห้องเรียน', icon: BookOpen },
    { id: 'ai_generator', label: 'AI สร้างเควสต์', icon: Wand2, highlight: true },
    { id: 'analytics', label: 'วิเคราะห์การเรียนรู้', icon: Sparkles },
    { id: 'leaderboard', label: 'อันดับนักเรียน', icon: Trophy },
    { id: 'reports', label: 'รายงานและส่งออก CSV', icon: FileText },
  ];

  const tabs = isTeacher ? teacherTabs : studentTabs;

  return (
    <>
      {/* Desktop & Tablet Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo & Brand */}
            <div 
              className="flex items-center gap-3 cursor-pointer" 
              onClick={() => setCurrentTab(isTeacher ? 'teacher_dashboard' : 'dashboard')}
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 via-sky-400 to-amber-300 p-0.5 shadow-md shadow-sky-500/20 flex items-center justify-center">
                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                  <Castle className="w-5 h-5 text-sky-500" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-sky-600 via-indigo-600 to-amber-500 bg-clip-text text-transparent">
                    ClassQuest AI
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                    {isTeacher ? 'Teacher' : 'Academy'}
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = currentTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setCurrentTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/20'
                        : tab.highlight
                        ? 'text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : tab.highlight ? 'text-sky-500' : 'text-slate-500'}`} />
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-900 shadow-xs">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Controls: Stats, Points, Notifications, Profile Switcher */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Student Points & XP Badges */}
              {currentUser && !isTeacher && (
                <div className="hidden sm:flex items-center gap-2">
                  {/* Points Wallet Button */}
                  <button
                    onClick={onOpenWallet}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold hover:bg-amber-100 transition-colors shadow-xs"
                    title="คลิกเพื่อดูกระเป๋า Points"
                  >
                    <Coins className={`w-3.5 h-3.5 text-amber-500 ${animationsEnabled ? 'animate-coin' : ''}`} />
                    <span>{currentUser.points?.toLocaleString() || 0} Pts</span>
                  </button>

                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-semibold">
                    <Flame className="w-3.5 h-3.5 text-orange-500" />
                    <span>{currentUser.daily_streak} วัน</span>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs font-bold text-sky-800">
                    <span className="text-amber-600 font-extrabold">Lv.{currentUser.level}</span>
                    <span className="text-slate-300">|</span>
                    <span className="text-sky-600">{currentUser.xp.toLocaleString()} XP</span>
                  </div>
                </div>
              )}

              {/* Animation Toggle */}
              <button
                onClick={onToggleAnimations}
                className={`p-2 rounded-xl text-xs font-bold transition-all border ${
                  animationsEnabled
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : 'bg-slate-100 border-slate-200 text-slate-500'
                }`}
                title={animationsEnabled ? 'แอนิเมชันเปิดอยู่ (คลิกเพื่อปิดเพื่อประหยัดพลังงาน)' : 'แอนิเมชันปิดอยู่ (คลิกเพื่อเปิด)'}
              >
                <Film className="w-4 h-4" />
              </button>

              {/* Notifications Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setNotifDropdownOpen(!notifDropdownOpen);
                    setUserDropdownOpen(false);
                  }}
                  className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  title="การแจ้งเตือน"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifs.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-sky-500 ring-2 ring-white animate-pulse" />
                  )}
                </button>

                {notifDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl card-academy shadow-2xl p-4 z-50 animate-in fade-in">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
                      <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <Bell className="w-4 h-4 text-sky-500" /> การแจ้งเตือน
                      </span>
                      <span className="text-xs text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200 font-semibold">
                        {unreadNotifs.length} ข้อความใหม่
                      </span>
                    </div>

                    <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                      {notifications.length === 0 ? (
                        <div className="text-center py-6 text-slate-400 text-xs">
                          ยังไม่มีการแจ้งเตือนใหม่
                        </div>
                      ) : (
                        notifications.slice(0, 6).map((n) => (
                          <div
                            key={n.id}
                            onClick={() => onMarkNotificationRead(n.id)}
                            className={`p-3 rounded-2xl text-xs transition-all cursor-pointer ${
                              n.read_status
                                ? 'bg-slate-50 text-slate-600 border border-slate-100'
                                : 'bg-sky-50/70 text-slate-800 border border-sky-200 font-medium'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-bold text-sky-900">{n.title}</span>
                              {!n.read_status && (
                                <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0 mt-1" />
                              )}
                            </div>
                            <p className="mt-1 text-slate-600 leading-relaxed">{n.message}</p>
                            <div className="mt-1.5 text-[10px] text-slate-400">
                              {new Date(n.created_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile Switcher */}
              <div className="relative">
                <button
                  onClick={() => {
                    setUserDropdownOpen(!userDropdownOpen);
                    setNotifDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 p-1.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 transition-all text-left shadow-xs"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-base shadow-inner">
                    {currentUser?.avatar || '⚔️'}
                  </div>
                  <div className="hidden md:block pr-1 text-xs">
                    <div className="font-bold text-slate-900 truncate max-w-[120px]">
                      {currentUser?.display_name || 'ผู้ใช้งาน'}
                    </div>
                    <div className="text-[10px] text-sky-600 font-medium">
                      {isTeacher ? 'ครูผู้สอน' : `Lv.${currentUser?.level} ${currentUser?.level_title.split(' ')[0]}`}
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 rounded-3xl card-academy shadow-2xl p-4 z-50 animate-in fade-in">
                    <div className="pb-3 border-b border-slate-100 mb-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">บัญชีปัจจุบัน</p>
                      <p className="text-sm font-black text-slate-900 mt-0.5">{currentUser?.display_name}</p>
                      <p className="text-xs text-sky-600 mt-0.5">{currentUser?.school}</p>
                    </div>

                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      สลับบทบาททดสอบ (Quick Switch)
                    </p>
                    <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                      {users.map((u) => (
                        <button
                          key={u.id}
                          onClick={() => {
                            onSwitchUser(u.id);
                            setUserDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-all ${
                            u.id === currentUser?.id
                              ? 'bg-sky-50 text-sky-900 border border-sky-300 font-bold'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="text-base">{u.avatar}</span>
                            <div className="text-left truncate">
                              <div className="font-semibold truncate">{u.display_name}</div>
                              <div className="text-[10px] text-slate-500">
                                {u.role === 'teacher' ? 'ครูผู้สอน' : `นักเรียน Lv.${u.level}`}
                              </div>
                            </div>
                          </div>
                          {u.id === currentUser?.id && (
                            <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0 ml-1" />
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-100 mt-2">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenAuth();
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <LogOut className="w-3.5 h-3.5 text-slate-500" /> สมัครสมาชิก / เข้าสู่ระบบ
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-1 animate-in fade-in">
            {currentUser && !isTeacher && (
              <div className="flex items-center justify-between p-3 rounded-2xl bg-sky-50 border border-sky-100 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{currentUser.avatar}</span>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{currentUser.display_name}</div>
                    <div className="text-[10px] text-sky-700">{currentUser.level_title}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-extrabold text-amber-600">🪙 {currentUser.points || 0} Pts</div>
                  <div className="text-[10px] text-sky-600 font-semibold">{currentUser.xp} XP</div>
                </div>
              </div>
            )}

            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setCurrentTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-sky-500 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge && (
                    <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-900">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Mobile Bottom Navigation Bar (Appears on small screens for app-like experience) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-1.5 flex items-center justify-around shadow-lg">
        {isTeacher ? (
          <>
            <button
              onClick={() => setCurrentTab('teacher_dashboard')}
              className={`flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-bold ${
                currentTab === 'teacher_dashboard' ? 'text-sky-600' : 'text-slate-500'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span>แดชบอร์ด</span>
            </button>
            <button
              onClick={() => setCurrentTab('classrooms')}
              className={`flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-bold ${
                currentTab === 'classrooms' ? 'text-sky-600' : 'text-slate-500'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span>ห้องเรียน</span>
            </button>
            <button
              onClick={() => setCurrentTab('ai_generator')}
              className={`flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-bold ${
                currentTab === 'ai_generator' ? 'text-sky-600' : 'text-slate-500'
              }`}
            >
              <Wand2 className="w-5 h-5 text-amber-500" />
              <span>AI สร้าง</span>
            </button>
            <button
              onClick={() => setCurrentTab('analytics')}
              className={`flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-bold ${
                currentTab === 'analytics' ? 'text-sky-600' : 'text-slate-500'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              <span>วิเคราะห์</span>
            </button>
            <button
              onClick={() => setCurrentTab('reports')}
              className={`flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-bold ${
                currentTab === 'reports' ? 'text-sky-600' : 'text-slate-500'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span>รายงาน</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-bold ${
                currentTab === 'dashboard' ? 'text-sky-600' : 'text-slate-500'
              }`}
            >
              <Sword className="w-5 h-5" />
              <span>หน้าหลัก</span>
            </button>
            <button
              onClick={() => setCurrentTab('kingdom')}
              className={`flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-bold relative ${
                currentTab === 'kingdom' ? 'text-sky-600' : 'text-slate-500'
              }`}
            >
              <Castle className="w-5 h-5 text-sky-500" />
              <span>อาณาจักร</span>
              <span className="absolute -top-1 right-2 w-2 h-2 rounded-full bg-amber-400" />
            </button>
            <button
              onClick={() => setCurrentTab('games')}
              className={`flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-bold ${
                currentTab === 'games' ? 'text-sky-600' : 'text-slate-500'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              <span>เควสต์</span>
            </button>
            <button
              onClick={() => setCurrentTab('leaderboard')}
              className={`flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-bold ${
                currentTab === 'leaderboard' ? 'text-sky-600' : 'text-slate-500'
              }`}
            >
              <Shield className="w-5 h-5" />
              <span>ผู้นำ</span>
            </button>
            <button
              onClick={() => setCurrentTab('badges')}
              className={`flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-bold ${
                currentTab === 'badges' ? 'text-sky-600' : 'text-slate-500'
              }`}
            >
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>รางวัล</span>
            </button>
          </>
        )}
      </nav>
    </>
  );
};
