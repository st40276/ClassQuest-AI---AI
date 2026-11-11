import React, { useState } from 'react';
import { User, KingdomTier } from '../types';
import { api } from '../services/api';
import confetti from 'canvas-confetti';
import { 
  Castle, Sparkles, CheckCircle2, Lock, ArrowUpCircle, 
  X, Coins, Star, AlertCircle, Shield
} from 'lucide-react';

interface CastleUpgradeModalProps {
  currentUser: User;
  currentKingdomLevel: KingdomTier;
  onClose: () => void;
  onRefresh: () => void;
  animationsEnabled: boolean;
}

export const CastleUpgradeModal: React.FC<CastleUpgradeModalProps> = ({
  currentUser,
  currentKingdomLevel,
  onClose,
  onRefresh,
  animationsEnabled
}) => {
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const tiers = [
    {
      level: 1,
      title: 'Tiny Kingdom',
      titleTh: 'อาณาจักรแห่งการเริ่มต้น',
      icon: '🏰',
      desc: 'พื้นที่เริ่มต้น พร้อมปราสาทไม้และพื้นที่สวนขนาดกะทัดรัด',
      unlockArea: 'ลานปราสาทหลัก',
      reqLevel: 1,
      costPoints: 0
    },
    {
      level: 2,
      title: 'Growing Kingdom',
      titleTh: 'อาณาจักรผลิบาน',
      icon: '🏯',
      desc: 'ปลดล็อกพื้นที่สวนดอกไม้ ขยายขอบเขตอาณาจักร และปลดล็อกของตกแต่งระดับ Rare',
      unlockArea: 'สวนดอกไม้หลวง & ทะเลสาบ',
      reqLevel: 2,
      costPoints: 100
    },
    {
      level: 3,
      title: 'Royal Kingdom',
      titleTh: 'อาณาจักรราชวงศ์',
      icon: '🏛️',
      desc: 'ปลดล็อกปราสาทราชวงศ์หินอ่อน หอคอยดาราศาสตร์ และพื้นที่หมู่บ้านช่างฝีมือ',
      unlockArea: 'หมู่บ้านช่างฝีมือ & หอคอย',
      reqLevel: 3,
      costPoints: 200
    },
    {
      level: 4,
      title: 'Fantasy Empire',
      titleTh: 'จักรวรรดิแฟนตาซี',
      icon: '🌌',
      desc: 'ปลดล็อกปราสาทมนตราลอยน้ำ ดินแดนหิมะ และสัตว์เลี้ยงแฟนตาซีระดับ Epic',
      unlockArea: 'ป่าเวทมนตร์ & ลานเหมันต์',
      reqLevel: 4,
      costPoints: 350
    },
    {
      level: 5,
      title: 'Legendary Empire',
      titleTh: 'มหาจักรวรรดินิรันดร์',
      icon: '👑',
      desc: 'ระดับสูงสุดแห่ง ClassQuest พระราชวังมังกรนิรันดร์และแสงออโรราสีทอง',
      unlockArea: 'ดินแดนแสงนิรันดร์ (Legendary)',
      reqLevel: 5,
      costPoints: 500
    }
  ];

  const nextTier = tiers.find(t => t.level === currentKingdomLevel + 1);

  const handleUpgrade = async () => {
    if (!nextTier) return;

    if (currentUser.level < nextTier.reqLevel) {
      setErrorMsg(`ต้องมีระดับ Level ${nextTier.reqLevel} ขึ้นไปเพื่อเลื่อนขั้น (ปัจจุบัน Level ${currentUser.level})`);
      return;
    }

    if (currentUser.points < nextTier.costPoints) {
      setErrorMsg(`Points ไม่เพียงพอ (ต้องการ ${nextTier.costPoints} Points มีอยู่ ${currentUser.points} Points)`);
      return;
    }

    setIsUpgrading(true);
    setErrorMsg('');
    try {
      await api.upgradeKingdom();
      setSuccessMsg(`ยินดีด้วย! อาณาจักรของคุณก้าวสู่ขั้น ${nextTier.title} (${nextTier.titleTh}) แล้ว!`);
      
      if (animationsEnabled) {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 }
        });
      }

      onRefresh();
      setTimeout(() => {
        onClose();
      }, 2500);
    } catch (err: any) {
      setErrorMsg(err.message || 'การเลื่อนขั้นอาณาจักรล้มเหลว');
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="card-academy w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-sky-500 via-indigo-500 to-indigo-600 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner">
              🏰
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black">
                  Kingdom Tier & Castle Upgrade
                </h2>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/20 text-white">
                  ระดับการพัฒนาอาณาจักร
                </span>
              </div>
              <p className="text-xs text-sky-100 mt-0.5">
                ปลดล็อกขอบเขตใหม่ ขยายพื้นที่ และครอบครองปราสาทระดับสูง
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Status Bar */}
        <div className="p-4 bg-sky-50/60 border-b border-sky-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-bold text-sky-900">
            <span>ระดับปัจจุบัน:</span>
            <span className="bg-sky-500 text-white px-2.5 py-0.5 rounded-full text-xs">
              Tier {currentKingdomLevel}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-600">Points ของคุณ:</span>
            <span className="font-extrabold text-amber-600 flex items-center gap-1">
              <Coins className="w-3.5 h-3.5 text-amber-500" />
              {currentUser.points} Pts
            </span>
          </div>
        </div>

        {/* Messages */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Progression Steps Timeline */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3">
          {tiers.map((tier) => {
            const isUnlocked = tier.level <= currentKingdomLevel;
            const isCurrent = tier.level === currentKingdomLevel;
            const isNext = tier.level === currentKingdomLevel + 1;

            return (
              <div
                key={tier.level}
                className={`card-academy p-4 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'border-sky-400 ring-2 ring-sky-200 bg-sky-50/40 shadow-md'
                    : isUnlocked
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : isNext
                    ? 'border-amber-300 bg-amber-50/20 shadow-sm'
                    : 'border-slate-200 bg-slate-50 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl p-2 bg-white rounded-2xl border border-slate-200 shadow-sm">
                      {tier.icon}
                    </span>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-sky-700">Tier {tier.level}</span>
                        <h4 className="text-sm font-black text-slate-900">{tier.title}</h4>
                        <span className="text-xs text-slate-500 font-medium">({tier.titleTh})</span>
                      </div>

                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {tier.desc}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] font-bold">
                        <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200 text-slate-600">
                          🗺️ ปลดล็อก: {tier.unlockArea}
                        </span>
                        {tier.costPoints > 0 && (
                          <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md border border-amber-200">
                            🪙 {tier.costPoints} Points
                          </span>
                        )}
                        <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-md border border-indigo-200">
                          ⭐ Level {tier.reqLevel}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isCurrent ? (
                      <span className="text-xs font-extrabold text-sky-700 bg-sky-100 px-3 py-1 rounded-full border border-sky-300">
                        ระดับปัจจุบัน
                      </span>
                    ) : isUnlocked ? (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> สำเร็จแล้ว
                      </span>
                    ) : isNext ? (
                      <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                        ขั้นถัดไป
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> ล็อกอยู่
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Action */}
        {nextTier && (
          <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div className="text-xs text-slate-600">
              เลื่อนขั้นเป็น <strong>Tier {nextTier.level} ({nextTier.title})</strong> ใช้ <strong>{nextTier.costPoints} Points</strong>
            </div>

            <button
              onClick={handleUpgrade}
              disabled={isUpgrading || currentUser.level < nextTier.reqLevel || currentUser.points < nextTier.costPoints}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-extrabold shadow-md transition-all flex items-center justify-center gap-2 ${
                currentUser.level < nextTier.reqLevel || currentUser.points < nextTier.costPoints
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20'
              }`}
            >
              <ArrowUpCircle className="w-4 h-4" />
              <span>{isUpgrading ? 'กำลังพัฒนาอาณาจักร...' : 'อัปเกรดอาณาจักรทันที'}</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
