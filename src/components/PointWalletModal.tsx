import React, { useState, useEffect } from 'react';
import { PointTransaction, User } from '../types';
import { api } from '../services/api';
import { Coins, X, ArrowUpRight, ArrowDownLeft, Sparkles, HelpCircle, ShieldCheck } from 'lucide-react';

interface PointWalletModalProps {
  currentUser: User;
  onClose: () => void;
  animationsEnabled: boolean;
}

export const PointWalletModal: React.FC<PointWalletModalProps> = ({
  currentUser,
  onClose,
  animationsEnabled
}) => {
  const [transactions, setTransactions] = useState<PointTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    setLoading(true);
    try {
      const data = await api.getWallet();
      setTransactions(data.transactions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="card-academy w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl my-auto max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner">
              🪙
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black">
                  Kingdom Point Wallet
                </h2>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/20 text-white">
                  กระเป๋าพอยท์การเรียนรู้
                </span>
              </div>
              <p className="text-xs text-amber-100 mt-0.5">
                คะแนนสะสมสำหรับพัฒนาอาณาจักรและซื้อของตกแต่ง
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

        {/* Balance Card */}
        <div className="p-5 bg-amber-50/60 border-b border-amber-200/60 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-800">ยอด Points คงเหลือ</span>
            <div className="text-3xl font-black text-amber-600 mt-0.5 flex items-center gap-2">
              <Coins className={`w-7 h-7 text-amber-500 ${animationsEnabled ? 'animate-coin' : ''}`} />
              <span>{currentUser.points?.toLocaleString() || 0}</span>
              <span className="text-xs font-bold text-amber-700">Points</span>
            </div>
          </div>

          <div className="text-right text-xs bg-white px-3.5 py-2 rounded-2xl border border-amber-200 shadow-sm">
            <span className="text-slate-500 block">ระดับผู้กล้า</span>
            <span className="font-extrabold text-sky-600">Level {currentUser.level} ({currentUser.xp} XP)</span>
          </div>
        </div>

        {/* Informative Note: XP vs Points */}
        <div className="p-4 mx-6 my-4 bg-sky-50 border border-sky-200 rounded-2xl flex items-start gap-2.5 text-xs text-sky-900">
          <HelpCircle className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <div>
            <strong>ข้อควรรู้:</strong> <strong>XP</strong> ใช้เพิ่มระดับ Level ของตัวละคร ส่วน <strong>Points</strong> เป็นเงินตราสำหรับซื้อของตกแต่งและอัปเกรดอาณาจักรในฝัน!
          </div>
        </div>

        {/* Transactions List */}
        <div className="px-6 pb-6 overflow-y-auto flex-1 space-y-3">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            ประวัติการทำรายการ Points ล่าสุด
          </h3>

          {loading ? (
            <div className="py-8 text-center text-xs text-slate-400">
              กำลังโหลดประวัติธุรกรรม...
            </div>
          ) : transactions.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              ยังไม่มีประวัติการทำรายการ
            </div>
          ) : (
            <div className="space-y-2">
              {transactions.map(tx => (
                <div
                  key={tx.id}
                  className="card-academy p-3 rounded-2xl border border-slate-200 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      tx.transaction_type === 'earned'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-rose-100 text-rose-700'
                    }`}>
                      {tx.transaction_type === 'earned' ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>

                    <div>
                      <div className="font-bold text-slate-900">{tx.source}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {new Date(tx.created_at).toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' })}
                      </div>
                    </div>
                  </div>

                  <div className={`text-sm font-black ${
                    tx.transaction_type === 'earned' ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {tx.transaction_type === 'earned' ? `+${tx.amount}` : `-${tx.amount}`} Pts
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
