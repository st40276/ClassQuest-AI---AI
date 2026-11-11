import React from 'react';
import { Badge } from '../types';
import { Trophy, Lock, CheckCircle2, Sparkles, Award } from 'lucide-react';

interface BadgesViewProps {
  badges: Badge[];
}

export const BadgesView: React.FC<BadgesViewProps> = ({ badges }) => {
  const unlockedCount = badges.filter(b => (b as any).unlocked).length;

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="card-academy p-6 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 uppercase">
            Trophy Room
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1.5">
            หอเกียรติยศและตราสัญลักษณ์ (Badges & Rewards)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            สะสมตราสัญลักษณ์จากการพิชิตเควสต์ ความเพียร และผลการเรียนรู้ที่ยอดเยี่ยม
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-bold">
            ปลดล็อกแล้ว {unlockedCount} / {badges.length} ตรา
          </span>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {badges.map((badge) => {
          const unlocked = (badge as any).unlocked;
          const earnedAt = (badge as any).earned_at;

          return (
            <div
              key={badge.id}
              className={`card-academy p-6 rounded-3xl border transition-all flex flex-col justify-between ${
                unlocked
                  ? 'border-amber-200 bg-gradient-to-br from-white to-amber-50/40 shadow-sm'
                  : 'border-slate-200 bg-slate-50 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-xs ${
                    unlocked ? 'bg-amber-100 border border-amber-200' : 'bg-slate-100 border border-slate-200'
                  }`}>
                    {badge.icon}
                  </div>

                  {unlocked ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> ปลดล็อกแล้ว
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                      <Lock className="w-3 h-3" /> ล็อกอยู่
                    </span>
                  )}
                </div>

                <div className="mt-4">
                  <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider">
                    {badge.badge_name}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                    {badge.name_th}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {badge.description}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 text-[11px] space-y-1">
                <div className="text-slate-500">
                  <strong className="text-slate-700">เงื่อนไข:</strong> {badge.condition}
                </div>
                {unlocked && earnedAt && (
                  <div className="text-sky-600 font-semibold">
                    ปลดล็อกเมื่อ: {new Date(earnedAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
