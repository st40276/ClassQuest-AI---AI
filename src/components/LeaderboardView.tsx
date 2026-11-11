import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Trophy, Shield, Users, BookOpen, Crown, 
  Sparkles, Flame, Eye, EyeOff, Award
} from 'lucide-react';

export const LeaderboardView: React.FC = () => {
  const [boardType, setBoardType] = useState<'individual' | 'team' | 'classroom'>('individual');
  const [period, setPeriod] = useState<'all' | 'weekly' | 'monthly'>('all');
  const [useAlias, setUseAlias] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBoard();
  }, [boardType, period]);

  const fetchBoard = async () => {
    setLoading(true);
    try {
      const res = await api.getLeaderboard(boardType);
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const top3 = data.slice(0, 3);
  const rest = data.slice(3);

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="card-academy p-6 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 uppercase">
            Hall of Fame
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1.5">
            หอเกียรติยศและตารางผู้นำ (Leaderboard)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            ยกย่องความมุ่งมั่นและความเพียรพยายามของผู้กล้าทุกสายวิชา
          </p>
        </div>

        {/* Alias Privacy Toggle */}
        <button
          onClick={() => setUseAlias(!useAlias)}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
            useAlias
              ? 'bg-sky-50 border-sky-300 text-sky-800 font-bold'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          {useAlias ? <EyeOff className="w-3.5 h-3.5 text-sky-600" /> : <Eye className="w-3.5 h-3.5 text-slate-400" />}
          <span>{useAlias ? 'โหมดฉายาแฟนตาซี (เปิดอยู่)' : 'แสดงฉายาแทนชื่อจริง'}</span>
        </button>
      </div>

      {/* Type Selector Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            onClick={() => setBoardType('individual')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              boardType === 'individual'
                ? 'bg-sky-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>อันดับผู้กล้ารายบุคคล</span>
          </button>

          <button
            onClick={() => setBoardType('team')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              boardType === 'team'
                ? 'bg-sky-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>อันดับกิลด์และทีม</span>
          </button>

          <button
            onClick={() => setBoardType('classroom')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              boardType === 'classroom'
                ? 'bg-sky-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>อันดับห้องเรียน</span>
          </button>
        </div>

        {/* Time Period Filter */}
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 text-xs">
          <button
            onClick={() => setPeriod('all')}
            className={`px-3 py-1.5 rounded-lg font-bold ${period === 'all' ? 'bg-sky-50 text-sky-700' : 'text-slate-500'}`}
          >
            ตลอดกาล
          </button>
          <button
            onClick={() => setPeriod('monthly')}
            className={`px-3 py-1.5 rounded-lg font-bold ${period === 'monthly' ? 'bg-sky-50 text-sky-700' : 'text-slate-500'}`}
          >
            ประจำเดือน
          </button>
          <button
            onClick={() => setPeriod('weekly')}
            className={`px-3 py-1.5 rounded-lg font-bold ${period === 'weekly' ? 'bg-sky-50 text-sky-700' : 'text-slate-500'}`}
          >
            ประจำสัปดาห์
          </button>
        </div>
      </div>

      {/* Top 3 Podium for Individual/Team */}
      {top3.length >= 3 && boardType !== 'classroom' && (
        <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto pt-6 pb-2 items-end">
          
          {/* 2nd Place (Silver) */}
          <div className="card-academy p-4 rounded-3xl border border-slate-200 text-center flex flex-col items-center">
            <span className="w-7 h-7 rounded-full bg-slate-300 text-slate-800 text-xs font-black flex items-center justify-center mb-2 shadow-xs">
              2
            </span>
            <div className="text-3xl sm:text-4xl">{top3[1]?.avatar || top3[1]?.icon || '🥈'}</div>
            <div className="text-xs sm:text-sm font-bold text-slate-900 mt-2 truncate max-w-full">
              {useAlias ? (top3[1]?.avatar_class?.split(' ')[0] || `Hero #2`) : (top3[1]?.display_name || top3[1]?.name)}
            </div>
            <div className="text-xs font-extrabold text-sky-600 mt-0.5">
              {top3[1]?.xp?.toLocaleString()} XP
            </div>
          </div>

          {/* 1st Place (Gold) */}
          <div className="card-academy p-5 rounded-3xl bg-gradient-to-b from-amber-50 to-white border-2 border-amber-300 text-center flex flex-col items-center shadow-lg -translate-y-3">
            <Crown className="w-8 h-8 text-amber-500 fill-amber-400 mb-1" />
            <span className="w-8 h-8 rounded-full bg-amber-400 text-slate-900 text-xs font-black flex items-center justify-center mb-2 shadow-md">
              1
            </span>
            <div className="text-4xl sm:text-5xl">{top3[0]?.avatar || top3[0]?.icon || '👑'}</div>
            <div className="text-sm sm:text-base font-extrabold text-slate-900 mt-2 truncate max-w-full">
              {useAlias ? (top3[0]?.avatar_class?.split(' ')[0] || `Champion #1`) : (top3[0]?.display_name || top3[0]?.name)}
            </div>
            <div className="text-sm font-black text-amber-600 mt-0.5">
              {top3[0]?.xp?.toLocaleString()} XP
            </div>
            <div className="text-[10px] text-amber-700 font-bold mt-1">ผู้ครองอันดับ 1</div>
          </div>

          {/* 3rd Place (Bronze) */}
          <div className="card-academy p-4 rounded-3xl border border-slate-200 text-center flex flex-col items-center">
            <span className="w-7 h-7 rounded-full bg-orange-200 text-orange-900 text-xs font-black flex items-center justify-center mb-2 shadow-xs">
              3
            </span>
            <div className="text-3xl sm:text-4xl">{top3[2]?.avatar || top3[2]?.icon || '🥉'}</div>
            <div className="text-xs sm:text-sm font-bold text-slate-900 mt-2 truncate max-w-full">
              {useAlias ? (top3[2]?.avatar_class?.split(' ')[0] || `Hero #3`) : (top3[2]?.display_name || top3[2]?.name)}
            </div>
            <div className="text-xs font-extrabold text-sky-600 mt-0.5">
              {top3[2]?.xp?.toLocaleString()} XP
            </div>
          </div>

        </div>
      )}

      {/* Rankings List Table */}
      <div className="card-academy rounded-3xl overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
          <span>อันดับ & ข้อมูลผู้กล้า</span>
          <span>คะแนนและระดับ</span>
        </div>

        <div className="divide-y divide-slate-100">
          {data.map((item, idx) => {
            const rank = idx + 1;
            return (
              <div 
                key={item.id || idx}
                className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${
                    rank === 1 ? 'bg-amber-400 text-slate-900' :
                    rank === 2 ? 'bg-slate-200 text-slate-700' :
                    rank === 3 ? 'bg-orange-200 text-orange-900' :
                    'bg-slate-100 text-slate-500'
                  }`}>
                    {rank}
                  </span>

                  <span className="text-2xl sm:text-3xl">{item.avatar || item.icon || '⚔️'}</span>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {useAlias 
                        ? (item.avatar_class || `นักผจญภัยรหัส ${item.id?.substring(0, 6)}`)
                        : (item.display_name || item.name)}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {item.level_title || item.subject || `สมาชิก ${item.members_count || 1} คน`}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm sm:text-base font-extrabold text-sky-600">
                    {item.xp?.toLocaleString()} XP
                  </div>
                  {item.level && (
                    <div className="text-[10px] text-amber-600 font-bold">
                      Level {item.level}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
