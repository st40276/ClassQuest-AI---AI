import React, { useState, useEffect } from 'react';
import { InventoryItem, ItemCategory } from '../types';
import { api } from '../services/api';
import { Package, X, Castle, Trees, Layers, Star, Calendar, ArrowRight } from 'lucide-react';

interface InventoryModalProps {
  onClose: () => void;
  onGoToEditor: () => void;
  animationsEnabled: boolean;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({
  onClose,
  onGoToEditor,
  animationsEnabled
}) => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'all'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const data = await api.getInventory();
      setInventory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = inventory.filter(inv => {
    if (selectedCategory !== 'all' && inv.item?.item_category !== selectedCategory) return false;
    return true;
  });

  const categories = [
    { id: 'all', label: 'ทั้งหมด' },
    { id: 'castle', label: '🏰 ปราสาท' },
    { id: 'decoration', label: '🌸 ของตกแต่ง' },
    { id: 'landscape', label: '🌱 ภูมิทัศน์' },
    { id: 'special', label: '✨ ไอเทมพิเศษ' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="card-academy w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl my-auto max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner">
              🎒
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black">
                  Kingdom Inventory
                </h2>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/20 text-white">
                  คลังสิ่งของของคุณ
                </span>
              </div>
              <p className="text-xs text-emerald-100 mt-0.5">
                รวมของตกแต่ง ปราสาท และพื้นดินที่คุณครอบครองทั้งหมด
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

        {/* Category Tabs & Quick Action */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              onClose();
              onGoToEditor();
            }}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
          >
            <span>ไปจัดวางในอาณาจักร</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Items Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              กำลังเปิดคลังสิ่งของ...
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              ยังไม่มีสิ่งของในหมวดหมู่นี้
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {filteredItems.map(inv => (
                <div
                  key={inv.id}
                  className="card-academy p-3.5 rounded-2xl border border-slate-200 flex flex-col justify-between hover:shadow-md transition-all text-center"
                >
                  <div>
                    <div className="w-full aspect-square bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center text-4xl mb-2 shadow-inner">
                      <span className={animationsEnabled ? 'animate-float' : ''}>
                        {inv.item?.image_url || '📦'}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {inv.item?.item_name || 'สิ่งของ'}
                    </h4>
                    <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                      {inv.item?.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      จำนวน: {inv.quantity}
                    </span>
                    <span className="text-slate-400">
                      {new Date(inv.purchased_at).toLocaleDateString('th-TH', { month: 'short', day: 'numeric' })}
                    </span>
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
