import React, { useState, useEffect } from 'react';
import { ShopItem, ItemCategory, User } from '../types';
import { api } from '../services/api';
import confetti from 'canvas-confetti';
import { 
  ShoppingBag, Coins, Sparkles, X, CheckCircle2, 
  Lock, Castle, Trees, Layers, Star, AlertCircle
} from 'lucide-react';

interface KingdomShopModalProps {
  currentUser: User;
  onClose: () => void;
  onRefreshUser: () => void;
  animationsEnabled: boolean;
}

export const KingdomShopModal: React.FC<KingdomShopModalProps> = ({
  currentUser,
  onClose,
  onRefreshUser,
  animationsEnabled
}) => {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [isBuying, setIsBuying] = useState<string | null>(null);
  const [buySuccessItem, setBuySuccessItem] = useState<ShopItem | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchShopItems();
  }, []);

  const fetchShopItems = async () => {
    setLoading(true);
    try {
      const data = await api.getShopItems();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async (item: ShopItem) => {
    if (currentUser.points < item.price_points) {
      setErrorMsg(`Points ของคุณไม่เพียงพอ (ต้องการ ${item.price_points} Points มีอยู่ ${currentUser.points} Points)`);
      return;
    }

    if (currentUser.level < item.unlock_level) {
      setErrorMsg(`ต้องมีระดับ Level ${item.unlock_level} ขึ้นไปเพื่อปลดล็อกสินค้านี้`);
      return;
    }

    setIsBuying(item.id);
    setErrorMsg('');
    try {
      await api.buyShopItem(item.id);
      setBuySuccessItem(item);

      if (animationsEnabled) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      }

      onRefreshUser();
      fetchShopItems();
      setTimeout(() => setBuySuccessItem(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'การซื้อสินค้าล้มเหลว');
    } finally {
      setIsBuying(null);
    }
  };

  const filteredItems = items.filter(item => {
    if (selectedCategory !== 'all' && item.item_category !== selectedCategory) return false;
    return true;
  });

  const categories = [
    { id: 'all', label: 'ทั้งหมด', icon: Sparkles },
    { id: 'castle', label: '🏰 ปราสาท (Castles)', icon: Castle },
    { id: 'decoration', label: '🌸 ของตกแต่ง (Decorations)', icon: Trees },
    { id: 'landscape', label: '🌱 ภูมิทัศน์ (Landscape)', icon: Layers },
  ];

  const rarityBadges: Record<string, { label: string; style: string }> = {
    common: { label: 'ทั่วไป', style: 'bg-slate-100 text-slate-700 border-slate-200' },
    rare: { label: 'หายาก', style: 'bg-sky-50 text-sky-700 border-sky-200' },
    epic: { label: 'มหากาพย์', style: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    legendary: { label: 'ตำนาน', style: 'bg-amber-50 text-amber-800 border-amber-300' }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="card-academy w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-sky-500 via-sky-600 to-indigo-600 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner">
              🛍️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black">
                  Kingdom Decoration Shop
                </h2>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/20 text-white">
                  ร้านค้าตกแต่งอาณาจักร
                </span>
              </div>
              <p className="text-xs text-sky-100 mt-0.5">
                ใช้ Points ที่ได้จากการทำภารกิจเพื่อเนรมิตอาณาจักรในฝัน
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/20 backdrop-blur-md font-extrabold text-xs sm:text-sm text-yellow-300 shadow-inner">
              <Coins className={`w-4 h-4 text-yellow-300 ${animationsEnabled ? 'animate-coin' : ''}`} />
              <span>{currentUser.points?.toLocaleString() || 0} Points</span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <span className="text-xs font-medium text-slate-500">
            แสดง {filteredItems.length} รายการ
          </span>
        </div>

        {/* Alerts & Messages */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {buySuccessItem && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>ซื้อ "{buySuccessItem.item_name}" สำเร็จแล้ว! สินค้าถูกเพิ่มเข้าสู่คลังของคุณทันที</span>
          </div>
        )}

        {/* Shop Items Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              กำลังจัดเตรียมสินค้าในร้านค้า...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredItems.map(item => {
                const isLocked = currentUser.level < item.unlock_level;
                const canAfford = currentUser.points >= item.price_points;
                const ownedCount = (item as any).owned_quantity || 0;
                const rarity = rarityBadges[item.rarity] || rarityBadges.common;

                return (
                  <div
                    key={item.id}
                    className={`card-academy p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                      isLocked ? 'opacity-65 bg-slate-50' : 'hover:shadow-md'
                    }`}
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-1 mb-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${rarity.style}`}>
                          {rarity.label}
                        </span>

                        {isLocked ? (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Lv.{item.unlock_level}
                          </span>
                        ) : ownedCount > 0 ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> มี {ownedCount} ชิ้น
                          </span>
                        ) : null}
                      </div>

                      {/* Item Visual */}
                      <div className="w-full aspect-square max-h-32 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center text-5xl mb-3 shadow-inner">
                        <span className={animationsEnabled && !isLocked ? 'animate-float' : ''}>
                          {item.image_url}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                        {item.item_name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Price and Buy Button */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-amber-600 font-extrabold text-sm">
                        <Coins className="w-4 h-4 text-amber-500" />
                        <span>{item.price_points === 0 ? 'ฟรี' : `${item.price_points} Pts`}</span>
                      </div>

                      <button
                        onClick={() => handleBuy(item)}
                        disabled={isLocked || isBuying === item.id || (!canAfford && item.price_points > 0)}
                        className={`px-4 py-1.5 rounded-xl text-xs font-bold shadow-sm transition-all ${
                          isLocked
                            ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                            : !canAfford && item.price_points > 0
                            ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                            : 'bg-sky-500 hover:bg-sky-600 text-white shadow-sky-500/20'
                        }`}
                      >
                        {isBuying === item.id
                          ? 'กำลังซื้อ...'
                          : isLocked
                          ? `ล็อก (Lv.${item.unlock_level})`
                          : !canAfford && item.price_points > 0
                          ? 'Points ไม่พอ'
                          : 'ซื้อสินค้า'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
