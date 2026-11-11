import React, { useState } from 'react';
import { User, Game, Mission, Badge, Classroom } from '../types';
import { 
  Sparkles, Sword, Trophy, Flame, Shield, ArrowRight, 
  Play, CheckCircle2, Clock, BookOpen, Star, Plus, ChevronRight, Zap,
  Castle, Coins, ShoppingBag, Eye
} from 'lucide-react';

interface StudentDashboardProps {
  user: User & { nextLevelXp?: number; prevLevelXp?: number };
  games: Game[];
  missions: (Mission & { progress?: any })[];
  badges: Badge[];
  classrooms: Classroom[];
  onPlayGame: (gameId: string) => void;
  onJoinClassroom: () => void;
  onNavigateTab: (tab: string) => void;
  onClaimMission: (missionId: string) => void;
  onUpdateAvatar: (avatar: string, avatarClass: string) => void;
  animationsEnabled: boolean;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  user,
  games,
  missions,
  badges,
  classrooms,
  onPlayGame,
  onJoinClassroom,
  onNavigateTab,
  onClaimMission,
  onUpdateAvatar,
  animationsEnabled
}) => {
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  // Avatar presets
  const avatarPresets = [
    { icon: '⚔️', title: 'อัศวินดาบมังกร (Dragon Knight)', desc: 'ผู้กล้าแห่งการโจมตีและการคิดคำนวณที่เฉียบคม' },
    { icon: '🔮', title: 'นักปราชญ์เวทมนตร์ (Mystic Mage)', desc: 'ผู้แสวงหาศาสตร์ความรู้ลึกซึ้งและทฤษฎีรอบด้าน' },
    { icon: '🏹', title: 'พรานเงาพิทักษ์ (Shadow Ranger)', desc: 'ผู้มีความว่องไว สมาธิสูง และจับจุดสำคัญได้อย่างแม่นยำ' },
    { icon: '✨', title: 'ผู้เยียวยาประกายดาว (Radiant Cleric)', desc: 'ผู้คอยเกื้อหนุนทีม เติมพลัง และสร้างบรรยากาศแห่งปัญญา' },
    { icon: '🛡️', title: 'การ์เดียนศิลาพันปี (Titan Guardian)', desc: 'ผู้มีความอดทนสูง พร้อมลุยทุกอุปสรรคและโจทย์ยาก' }
  ];

  // Level progress calculation
  const prevXp = user.prevLevelXp || 0;
  const nextXp = user.nextLevelXp || (user.xp + 500);
  const currentLevelProgress = Math.min(
    Math.max(Math.round(((user.xp - prevXp) / Math.max(nextXp - prevXp, 1)) * 100), 0),
    100
  );

  const activeMissions = missions.filter(m => m.progress?.status !== 'completed');
  const completedMissions = missions.filter(m => m.progress?.status === 'completed');
  const unlockedBadges = badges.filter(b => (b as any).unlocked);

  return (
    <div className="space-y-6 pb-16">
      
      {/* 1. Bright Fantasy Academy Hero & Character Card */}
      <div className="card-academy relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-white via-sky-50/40 to-amber-50/40 border border-slate-200/90 shadow-md">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-sky-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-32 -bottom-20 w-52 h-52 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          
          {/* Avatar and Welcome Info */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative group cursor-pointer" onClick={() => setShowAvatarPicker(true)}>
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-sky-400 via-indigo-400 to-amber-300 p-1 shadow-lg shadow-sky-500/10 group-hover:scale-105 transition-all">
                <div className="w-full h-full bg-white rounded-[20px] flex items-center justify-center text-4xl sm:text-5xl shadow-inner">
                  {user.avatar || '⚔️'}
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-sky-500 text-white text-[10px] font-bold border border-white shadow">
                เปลี่ยน
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-sky-800 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                  {user.grade || 'มัธยมศึกษาปีที่ 3'}
                </span>
                <span className="text-xs font-bold text-orange-800 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-orange-500" />
                  Streak {user.daily_streak} วัน
                </span>
                <span className="text-xs font-extrabold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                  <Coins className={`w-3.5 h-3.5 text-amber-500 ${animationsEnabled ? 'animate-coin' : ''}`} />
                  {user.points?.toLocaleString() || 0} Points
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                ยินดีต้อนรับ, {user.display_name}!
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                ฉายา: <span className="font-bold text-sky-700">{user.avatar_class || user.level_title}</span>
              </p>
            </div>
          </div>

          {/* Level & XP Gauge */}
          <div className="w-full md:w-80 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className="text-amber-600 flex items-center gap-1 font-extrabold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                เลเวล {user.level}: {user.level_title.split(' ')[0]}
              </span>
              <span className="text-sky-600 font-extrabold">
                {user.xp.toLocaleString()} XP
              </span>
            </div>

            {/* Animated Progress Bar */}
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
              <div 
                className="h-full bg-gradient-to-r from-sky-400 via-indigo-400 to-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${currentLevelProgress}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1.5">
              <span>ความคืบหน้าระดับ: {currentLevelProgress}%</span>
              <span>อีก {Math.max(nextXp - user.xp, 0).toLocaleString()} XP เพื่อเลเวลอัป</span>
            </div>
          </div>

        </div>
      </div>

      {/* Avatar Picker Modal */}
      {showAvatarPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="card-academy rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-sky-500" /> เลือกคลาสและอวตารตัวละคร
              </h3>
              <button 
                onClick={() => setShowAvatarPicker(false)}
                className="text-slate-400 hover:text-slate-700 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {avatarPresets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onUpdateAvatar(preset.icon, preset.title);
                    setShowAvatarPicker(false);
                  }}
                  className={`w-full flex items-start gap-3 p-3 rounded-2xl border text-left transition-all ${
                    user.avatar === preset.icon
                      ? 'bg-sky-50 border-sky-400 ring-2 ring-sky-200 text-slate-900 font-bold'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="text-3xl p-1 bg-slate-50 rounded-xl border border-slate-100">{preset.icon}</span>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{preset.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{preset.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Kingdom Domination Banner Highlight */}
      <div 
        onClick={() => onNavigateTab('kingdom')}
        className="card-academy p-5 rounded-3xl bg-gradient-to-r from-sky-500 via-sky-600 to-blue-700 text-white cursor-pointer hover:shadow-lg transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner shrink-0">
            🏰
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-400 text-slate-900">
                ระบบใหม่ล่าสุด
              </span>
              <h3 className="text-base font-black">KINGDOM DOMINATION: ศึกชิงอาณาจักรแห่งความรู้</h3>
            </div>
            <p className="text-xs text-sky-100 mt-1">
              สร้างเมือง พัฒนาแนวป้องกัน ขยายอาณาเขต และท้าทายอาณาจักรคู่แข่งด้วยข้อสอบ 10 ข้อเพื่อขโมย 50 Points!
            </p>
          </div>
        </div>

        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-sky-700 font-black text-xs shadow-sm shrink-0">
          <span>เข้าสู่ศึกชิงอาณาจักร</span>
          <ArrowRight className="w-3.5 h-3.5 text-sky-600" />
        </button>
      </div>

      {/* 3. Quick Stat Overview Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div 
          onClick={() => onNavigateTab('kingdom')}
          className="card-academy p-4 rounded-2xl hover:border-sky-300 hover:shadow-md cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">อาณาจักรของฉัน</span>
            <Castle className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">Tier 2</div>
          <div className="text-[11px] text-sky-600 font-bold mt-0.5 flex items-center gap-1">
            <span>เข้าจัดการ</span> <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab('games')}
          className="card-academy p-4 rounded-2xl hover:border-sky-300 hover:shadow-md cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">เควสต์พร้อมเล่น</span>
            <Sword className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">{games.length}</div>
          <div className="text-[11px] text-indigo-600 font-bold mt-0.5 flex items-center gap-1">
            <span>เริ่มเล่นเควสต์</span> <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab('badges')}
          className="card-academy p-4 rounded-2xl hover:border-sky-300 hover:shadow-md cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">เหรียญตราที่ได้</span>
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {unlockedBadges.length} <span className="text-xs text-slate-400 font-normal">/ {badges.length}</span>
          </div>
          <div className="text-[11px] text-amber-600 font-bold mt-0.5">ปลดล็อกแล้ว</div>
        </div>

        <div 
          onClick={() => onNavigateTab('leaderboard')}
          className="card-academy p-4 rounded-2xl hover:border-sky-300 hover:shadow-md cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">ตารางผู้นำ</span>
            <Shield className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">#3</div>
          <div className="text-[11px] text-emerald-600 font-bold mt-0.5">ในห้องเรียน ม.3/1</div>
        </div>
      </div>

      {/* 4. Main Columns: Recommended Games & Active Missions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Recommended Games */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sword className="w-5 h-5 text-sky-500" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900">เกมและเควสต์ที่แนะนำ</h2>
            </div>
            <button 
              onClick={() => onNavigateTab('games')}
              className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
            >
              ดูทั้งหมด ({games.length}) <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {games.slice(0, 4).map((game) => (
              <div 
                key={game.id}
                className="card-academy p-4 rounded-2xl border border-slate-200/90 hover:border-sky-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                      {game.subject}
                    </span>
                    <span className="text-xs font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      +{game.reward_xp} XP • +50 Pts
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mt-2 line-clamp-2">
                    {game.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                    หัวข้อ: {game.topic}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {game.time_limit || 30}s / ข้อ
                  </span>

                  <button
                    onClick={() => onPlayGame(game.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-sm transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>เริ่มเล่น</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Enrolled Classrooms Section */}
          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-500" />
                <h2 className="text-base sm:text-lg font-bold text-slate-900">ห้องเรียนที่เข้าร่วม</h2>
              </div>
              <button 
                onClick={onJoinClassroom}
                className="flex items-center gap-1 px-3 py-1 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-700 text-xs font-bold transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>เข้าร่วมด้วยรหัส</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {classrooms.map((c) => (
                <div 
                  key={c.id}
                  className="card-academy p-4 rounded-2xl border border-slate-200 flex items-center justify-between hover:border-slate-300 transition-all"
                >
                  <div>
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                      {c.subject} ({c.grade_level})
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1.5">{c.classroom_name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">ครูผู้สอน: {c.teacher_name || 'ครูประจำวิชา'}</p>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <span className="text-[10px] text-slate-400">รหัสห้อง</span>
                    <div className="text-xs font-mono font-bold text-sky-700 bg-sky-50 px-2 py-1 rounded-md border border-sky-200 mt-0.5">
                      {c.join_code}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Active Missions & Badges Preview */}
        <div className="space-y-6">
          
          {/* Active Quests & Missions */}
          <div className="card-academy p-5 rounded-3xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                ภารกิจที่กำลังทำ ({activeMissions.length})
              </h3>
              <span className="text-[11px] text-slate-500">
                สำเร็จแล้ว {completedMissions.length}
              </span>
            </div>

            <div className="space-y-3">
              {missions.slice(0, 4).map((m) => {
                const isCompleted = m.progress?.status === 'completed';
                const currentCount = m.progress?.current_count || 0;
                const target = m.requirement_target;
                const percent = Math.min(Math.round((currentCount / target) * 100), 100);

                return (
                  <div 
                    key={m.id}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isCompleted 
                        ? 'bg-emerald-50/70 border-emerald-200' 
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-sky-600 uppercase">
                          {m.mission_type === 'daily' ? 'ภารกิจประจำวัน' : m.mission_type === 'weekly' ? 'ภารกิจสัปดาห์' : 'เควสต์หลัก'}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 mt-0.5">{m.title}</h4>
                      </div>
                      <span className="text-xs font-extrabold text-amber-600 shrink-0">
                        +{m.reward_xp} XP
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      {m.description}
                    </p>

                    {/* Progress Bar for Mission */}
                    <div className="mt-2.5">
                      <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                        <span>ความคืบหน้า</span>
                        <span>{currentCount} / {target}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${isCompleted ? 'bg-emerald-500' : 'bg-sky-500'}`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    {isCompleted && (
                      <div className="mt-2 flex items-center justify-end">
                        <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> รับรางวัลแล้ว
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Badges Preview Widget */}
          <div className="card-academy p-5 rounded-3xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                ตราเกียรติยศ ({unlockedBadges.length}/{badges.length})
              </h3>
              <button
                onClick={() => onNavigateTab('badges')}
                className="text-xs text-sky-600 hover:text-sky-700 font-bold"
              >
                ดูทั้งหมด
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {badges.slice(0, 6).map((badge) => {
                const unlocked = (badge as any).unlocked;
                return (
                  <div
                    key={badge.id}
                    title={`${badge.name_th}: ${badge.description}`}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      unlocked
                        ? 'bg-amber-50/50 border-amber-200 shadow-xs'
                        : 'bg-slate-50 border-slate-200 opacity-40'
                    }`}
                  >
                    <div className="text-2xl">{badge.icon}</div>
                    <div className="text-[11px] font-bold text-slate-700 mt-1 truncate">
                      {badge.name_th}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
