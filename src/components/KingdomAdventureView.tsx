import React, { useState, useEffect, useRef } from 'react';
import { Kingdom, User, KingdomBuilding, KingdomDefense, RivalKingdom, BuildingType } from '../types';
import { api } from '../services/api';
import confetti from 'canvas-confetti';
import { 
  Castle, Sparkles, ShoppingBag, Package, Coins, 
  ArrowUpCircle, Edit3, Trash2, CheckCircle2, 
  Info, Eye, Undo, Save, RotateCcw, Shield, Layers, Compass,
  ZoomIn, ZoomOut, Maximize2, Swords, Trophy, MapPin, 
  Clock, AlertCircle, Plus, ChevronRight, X, Lock, Flame, Crown
} from 'lucide-react';
import { KingdomBattleArenaModal } from './KingdomBattleArenaModal';

interface KingdomAdventureViewProps {
  currentUser: User;
  onRefreshUser: () => void;
  onOpenShop: () => void;
  onOpenInventory: () => void;
  onOpenWallet: () => void;
  onOpenUpgradeModal: () => void;
  animationsEnabled: boolean;
}

export const KingdomAdventureView: React.FC<KingdomAdventureViewProps> = ({
  currentUser,
  onRefreshUser,
  onOpenShop,
  onOpenInventory,
  onOpenWallet,
  onOpenUpgradeModal,
  animationsEnabled
}) => {
  // Main sub-tabs: 'my_kingdom' | 'world_rivals' | 'battle_history'
  const [activeTab, setActiveTab] = useState<'my_kingdom' | 'world_rivals' | 'battle_history'>('my_kingdom');

  // Kingdom state
  const [kingdom, setKingdom] = useState<Kingdom | null>(null);
  const [buildings, setBuildings] = useState<KingdomBuilding[]>([]);
  const [defense, setDefense] = useState<KingdomDefense | null>(null);
  const [buildingCatalog, setBuildingCatalog] = useState<any[]>([]);
  const [unlockedAreas, setUnlockedAreas] = useState<string[]>(['main']);
  const [loading, setLoading] = useState(true);

  // Spectator mode (viewing a rival's kingdom)
  const [spectatorMode, setSpectatorMode] = useState<{
    isSpectating: boolean;
    kingdomId: string;
    kingdomName: string;
    rulerName: string;
    rulerAvatar: string;
    defenseLevel: number;
    points: number;
    isShielded: boolean;
    studentId: string;
  } | null>(null);

  // Map Navigation & Zoom
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Interactive Construction / Building Inspect
  const [selectedBuilding, setSelectedBuilding] = useState<KingdomBuilding | null>(null);
  const [buildModeActive, setBuildModeActive] = useState(false);
  const [selectedTileToBuild, setSelectedTileToBuild] = useState<{ x: number; y: number } | null>(null);
  const [isBuildingActionLoading, setIsBuildingActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // World Rivals
  const [rivals, setRivals] = useState<RivalKingdom[]>([]);
  const [rivalsLoading, setRivalsLoading] = useState(false);
  const [rivalSearch, setRivalSearch] = useState('');

  // Battle Arena Modal
  const [challengeTarget, setChallengeTarget] = useState<{
    targetKingdomId: string;
    defenderId: string;
    defenderName: string;
    targetKingdomName: string;
  } | null>(null);

  // Battle History
  const [battleHistory, setBattleHistory] = useState<{
    victories: any[];
    defeats: any[];
    defenseLog: any[];
  }>({ victories: [], defeats: [], defenseLog: [] });
  const [historyTab, setHistoryTab] = useState<'victories' | 'defeats' | 'defense'>('victories');

  // Load Overview Data
  useEffect(() => {
    fetchDominationData();
  }, []);

  const fetchDominationData = async () => {
    setLoading(true);
    try {
      const data = await api.getDominationOverview();
      setKingdom(data.kingdom);
      setBuildings(data.buildings || []);
      setDefense(data.defense);
      setBuildingCatalog(data.catalog || []);
      setUnlockedAreas(data.unlocked_areas || ['main']);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRivals = async () => {
    setRivalsLoading(true);
    try {
      const data = await api.getRivalKingdoms();
      setRivals(data);
    } catch (err) {
      console.error(err);
    } finally {
      setRivalsLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const data = await api.getKingdomBattleHistory();
      setBattleHistory(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Switch Sub-tabs
  const handleTabChange = (tab: 'my_kingdom' | 'world_rivals' | 'battle_history') => {
    setActiveTab(tab);
    if (tab === 'world_rivals') fetchRivals();
    if (tab === 'battle_history') fetchHistory();
    if (tab === 'my_kingdom' && spectatorMode) {
      setSpectatorMode(null);
      fetchDominationData();
    }
  };

  // Spectate another student's kingdom
  const handleSpectateKingdom = async (rival: RivalKingdom) => {
    try {
      const data = await api.getSpectatorKingdom(rival.kingdom_id);
      setKingdom(data.kingdom);
      setBuildings(data.buildings || []);
      setDefense(data.defense);
      setUnlockedAreas(data.kingdom.unlocked_areas || ['main']);
      setSpectatorMode({
        isSpectating: true,
        kingdomId: rival.kingdom_id,
        kingdomName: rival.kingdom_name,
        rulerName: rival.ruler_name,
        rulerAvatar: rival.ruler_avatar,
        defenseLevel: rival.defense.defense_level,
        points: rival.points,
        isShielded: rival.is_shielded,
        studentId: rival.student_id
      });
      setActiveTab('my_kingdom');
    } catch (err) {
      console.error(err);
    }
  };

  // Exit spectator mode and return to own kingdom
  const handleExitSpectator = () => {
    setSpectatorMode(null);
    fetchDominationData();
  };

  // Construction
  const handleBuildNew = async (buildingType: BuildingType) => {
    if (!selectedTileToBuild) return;
    setIsBuildingActionLoading(true);
    try {
      const res = await api.buildBuilding({
        building_type: buildingType,
        position_x: selectedTileToBuild.x,
        position_y: selectedTileToBuild.y
      });
      setBuildings(prev => [...prev, res.building]);
      setSelectedTileToBuild(null);
      setBuildModeActive(false);
      onRefreshUser();
      fetchDominationData();
      showToast('success', `สร้าง ${res.building.name} สำเร็จ!`);
      if (animationsEnabled) {
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
      }
    } catch (err: any) {
      showToast('error', err.message || 'ไม่สามารถสร้างสิ่งปลูกสร้างได้');
    } finally {
      setIsBuildingActionLoading(false);
    }
  };

  // Upgrade building
  const handleUpgradeBuilding = async (buildingId: string) => {
    setIsBuildingActionLoading(true);
    try {
      const res = await api.upgradeBuilding(buildingId);
      setBuildings(prev => prev.map(b => b.id === buildingId ? res.building : b));
      setSelectedBuilding(res.building);
      onRefreshUser();
      fetchDominationData();
      showToast('success', `อัปเกรด ${res.building.name} สำเร็จ! (+15 Defense)`);
      if (animationsEnabled) {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      }
    } catch (err: any) {
      showToast('error', err.message || 'ไม่สามารถอัปเกรดสิ่งปลูกสร้างได้');
    } finally {
      setIsBuildingActionLoading(false);
    }
  };

  // Demolish building
  const handleDemolishBuilding = async (buildingId: string) => {
    if (!window.confirm('คุณแน่ใจหรือไม่ว่าต้องการรื้อถอนสิ่งปลูกสร้างนี้?')) return;
    setIsBuildingActionLoading(true);
    try {
      await api.demolishBuilding(buildingId);
      setBuildings(prev => prev.filter(b => b.id !== buildingId));
      setSelectedBuilding(null);
      fetchDominationData();
      showToast('success', 'รื้อถอนสิ่งปลูกสร้างเรียบร้อยแล้ว');
    } catch (err: any) {
      showToast('error', err.message || 'ไม่สามารถรื้อถอนสิ่งปลูกสร้างได้');
    } finally {
      setIsBuildingActionLoading(false);
    }
  };

  // Unlock Territory Expansion
  const handleUnlockTerritory = async (areaId: string, areaName: string) => {
    try {
      await api.unlockTerritory(areaId);
      setUnlockedAreas(prev => [...prev, areaId]);
      onRefreshUser();
      showToast('success', `ปลดล็อก ${areaName} สำเร็จ! พื้นที่ก่อสร้างขยายกว้างขึ้น`);
      if (animationsEnabled) {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      }
    } catch (err: any) {
      showToast('error', err.message || 'ไม่สามารถปลดล็อกพื้นที่ได้');
    }
  };

  const showToast = (type: 'success' | 'error', text: string) => {
    setActionMessage({ type, text });
    setTimeout(() => setActionMessage(null), 3500);
  };

  // Pan / Drag handlers for map
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // 12x12 Isometric Grid configuration
  const GRID_SIZE = 12;
  const TILE_WIDTH = 76;
  const TILE_HEIGHT = 38;

  // Converts grid row/col to Isometric (x, y) pixels
  const toIsometric = (col: number, row: number) => {
    const x = (col - row) * (TILE_WIDTH / 2);
    const y = (col + row) * (TILE_HEIGHT / 2);
    return { x, y };
  };

  // Check if tile is in unlocked territory
  const isTileUnlocked = (col: number, row: number) => {
    // Center: main (cols 3-8, rows 3-8)
    if (col >= 3 && col <= 8 && row >= 3 && row <= 8) return true;
    // East Farm: cols 9-11
    if (col >= 9 && unlockedAreas.includes('east_farm')) return true;
    // West River / Port: cols 0-2
    if (col <= 2 && unlockedAreas.includes('west_river')) return true;
    // North Citadel / Mountains: rows 0-2
    if (row <= 2 && unlockedAreas.includes('north_citadel')) return true;
    // South Gardens: rows 9-11
    if (row >= 9 && unlockedAreas.includes('south_garden')) return true;
    return false;
  };

  // Determine terrain visual
  const getTileType = (col: number, row: number) => {
    // Diagonal River running from top-right to bottom-left
    if (col + row === 11 || col + row === 12) {
      // Bridge at (5, 6) or (6, 5)
      if ((col === 5 && row === 6) || (col === 6 && row === 5)) return 'bridge';
      return 'water';
    }
    // Main Citadel Paved Courtyard
    if (col >= 4 && col <= 7 && row >= 4 && row <= 7) return 'cobblestone';
    // Farm soil on the east
    if (col >= 9) return 'farmland';
    return 'grass';
  };

  if (loading) {
    return (
      <div className="p-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-sky-100 border-2 border-sky-300 mx-auto flex items-center justify-center text-3xl animate-bounce shadow-md">
          🏰
        </div>
        <h2 className="text-lg font-black text-slate-800">
          กำลังเตรียมแผนที่โลก KINGDOM DOMINATION...
        </h2>
        <p className="text-xs text-sky-600 font-semibold">
          เชื่อมโยงข้อมูลสิ่งปลูกสร้าง พลังป้องกัน และพิกัด 2.5D Isometric
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-16">
      
      {/* Toast Notification */}
      {actionMessage && (
        <div className={`fixed top-20 right-6 z-50 p-4 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-bold transition-all animate-bounce ${
          actionMessage.type === 'success' 
            ? 'bg-emerald-600 text-white shadow-emerald-500/30' 
            : 'bg-rose-600 text-white shadow-rose-500/30'
        }`}>
          {actionMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Spectator Top Banner */}
      {spectatorMode && (
        <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-500 via-sky-500 to-blue-600 text-white shadow-lg flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-1 bg-white/20 rounded-2xl backdrop-blur-sm">
              {spectatorMode.rulerAvatar}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded">
                  โหมดเยี่ยมชม (Spectator Mode)
                </span>
                {spectatorMode.isShielded && (
                  <span className="text-[10px] font-bold bg-amber-400 text-slate-900 px-2 py-0.5 rounded flex items-center gap-1">
                    <Shield className="w-3 h-3" /> มีโล่ป้องกัน
                  </span>
                )}
              </div>
              <h3 className="text-base font-black">
                {spectatorMode.kingdomName} (เจ้าเมือง: {spectatorMode.rulerName})
              </h3>
              <p className="text-xs text-white/80">
                พลังป้องกัน: {spectatorMode.defenseLevel} Defense • Points สะสม: {spectatorMode.points} Points
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!spectatorMode.isShielded && (
              <button
                onClick={() => setChallengeTarget({
                  targetKingdomId: spectatorMode.kingdomId,
                  defenderId: spectatorMode.studentId,
                  defenderName: spectatorMode.rulerName,
                  targetKingdomName: spectatorMode.kingdomName
                })}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-xs shadow-md transition-all"
              >
                <Swords className="w-4 h-4" />
                <span>ท้าทายอาณาจักรนี้ (ชิง 50 Points)</span>
              </button>
            )}

            <button
              onClick={handleExitSpectator}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs backdrop-blur-sm transition-all"
            >
              <Castle className="w-4 h-4" />
              <span>กลับสู่อาณาจักรของฉัน</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Header Card & Stats */}
      {!spectatorMode && (
        <div className="card-academy p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-sky-400 via-amber-400 to-blue-500 shadow-md shadow-sky-400/20 flex items-center justify-center text-3xl">
              🏰
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-800">
                  {kingdom?.kingdom_name || 'อาณาจักรแห่งความรู้'}
                </h1>
                <span className="text-xs font-bold text-sky-700 bg-sky-100 px-2.5 py-0.5 rounded-full border border-sky-300">
                  Tier {kingdom?.kingdom_level || 1}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                สร้างเมือง วางแผนการป้องกัน และประลองปัญญาวิชาการในศึกชิงอาณาจักร
              </p>
            </div>
          </div>

          {/* Quick Stats Pills */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Defense Score */}
            <div className="px-4 py-2.5 rounded-2xl bg-sky-50 border border-sky-200 shadow-sm flex items-center gap-2.5">
              <Shield className="w-5 h-5 text-sky-600" />
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">พลังป้องกันรวม</span>
                <span className="text-sm font-black text-sky-800">{defense?.defense_level || 50} Defense</span>
              </div>
            </div>

            {/* Shield Status */}
            <div className={`px-4 py-2.5 rounded-2xl border shadow-sm flex items-center gap-2.5 ${
              defense?.shield_status 
                ? 'bg-amber-50 border-amber-300 text-amber-800' 
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}>
              <Sparkles className="w-5 h-5 text-amber-500" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider block">โล่คุ้มกันมนตรา</span>
                <span className="text-xs font-bold">
                  {defense?.shield_status ? 'กำลังเปิดใช้งาน' : 'พร้อมรับการท้าทาย'}
                </span>
              </div>
            </div>

            {/* Wallet points */}
            <button
              onClick={onOpenWallet}
              className="px-4 py-2.5 rounded-2xl bg-amber-50 border border-amber-200 hover:border-amber-300 shadow-sm flex items-center gap-2.5 transition-all"
            >
              <Coins className="w-5 h-5 text-amber-600" />
              <div className="text-left">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Points ในคลัง</span>
                <span className="text-sm font-black text-amber-800">{currentUser.points || 0}</span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Sub-Tabs Switcher */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-white border border-amber-200/80 shadow-sm text-xs font-bold">
        <button
          onClick={() => handleTabChange('my_kingdom')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all ${
            activeTab === 'my_kingdom'
              ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Castle className="w-4 h-4" />
          <span>{spectatorMode ? 'อาณาจักรที่กำลังเยี่ยมชม' : 'อาณาจักรของฉัน (World Map)'}</span>
        </button>

        <button
          onClick={() => handleTabChange('world_rivals')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all ${
            activeTab === 'world_rivals'
              ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Compass className="w-4 h-4 text-amber-400" />
          <span>ค้นหาอาณาจักรคู่แข่ง (Rivals World)</span>
        </button>

        <button
          onClick={() => handleTabChange('battle_history')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all ${
            activeTab === 'battle_history'
              ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Swords className="w-4 h-4 text-red-500" />
          <span>ประวัติศึกชิงอาณาจักร (Battle Logs)</span>
        </button>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={onOpenShop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">ร้านค้าของตกแต่ง</span>
          </button>
          <button
            onClick={onOpenUpgradeModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs transition-colors"
          >
            <ArrowUpCircle className="w-3.5 h-3.5 text-sky-600" />
            <span className="hidden sm:inline">อัปเกรดปราสาท</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: MY KINGDOM ISOMETRIC 2.5D WORLD MAP */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'my_kingdom' && (
        <div className="card-academy p-4 sm:p-6 overflow-hidden relative space-y-4">
          
          {/* Map Toolbar Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-sky-600" />
                แผนที่ 2.5D Isometric World (12x12 Grid)
              </span>

              {!spectatorMode && (
                <button
                  onClick={() => setBuildModeActive(!buildModeActive)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    buildModeActive 
                      ? 'bg-amber-500 text-white shadow-md' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{buildModeActive ? 'กำลังอยู่ในโหมดสร้าง' : 'โหมดก่อสร้าง (Build Mode)'}</span>
                </button>
              )}
            </div>

            {/* Zoom & View Controls */}
            <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-2xl border border-slate-200">
              <button
                onClick={() => setZoomLevel(prev => Math.min(prev + 0.15, 1.4))}
                className="p-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white shadow-xs"
                title="ซูมเข้า"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel(prev => Math.max(prev - 0.15, 0.7))}
                className="p-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white shadow-xs"
                title="ซูมออก"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setZoomLevel(1);
                  setPanOffset({ x: 0, y: 0 });
                }}
                className="p-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white shadow-xs text-xs font-bold px-2"
                title="รีเซ็ตมุมมอง"
              >
                100%
              </button>
            </div>
          </div>

          {/* Territory Expansion Banner */}
          {!spectatorMode && (
            <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-2xl bg-amber-50/60 border border-amber-200/60 text-xs">
              <span className="font-bold text-amber-800 flex items-center gap-1">
                <Crown className="w-3.5 h-3.5 text-amber-600" /> ขยายอาณาเขต (60 Points/เขต):
              </span>
              {[
                { id: 'east_farm', name: '🌾 ทุ่งเกษตรกรรมตะวันออก' },
                { id: 'west_river', name: '⛵ ท่าเรือสายธารตะวันตก' },
                { id: 'north_citadel', name: '⛰️ ป้อมภูผาเหนือ' },
                { id: 'south_garden', name: '🌸 สวนพฤกษาใต้' }
              ].map(area => {
                const isUnlocked = unlockedAreas.includes(area.id);
                return (
                  <button
                    key={area.id}
                    onClick={() => {
                      if (!isUnlocked) handleUnlockTerritory(area.id, area.name);
                    }}
                    disabled={isUnlocked}
                    className={`px-3 py-1 rounded-xl text-[11px] font-bold border transition-all ${
                      isUnlocked 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200 cursor-default' 
                        : 'bg-white hover:bg-amber-100 text-amber-800 border-amber-300 shadow-xs'
                    }`}
                  >
                    {isUnlocked ? `✓ ปลดล็อกแล้ว` : `🔓 ปลดล็อก ${area.name}`}
                  </button>
                );
              })}
            </div>
          )}

          {/* Isometric Canvas Container */}
          <div 
            className="w-full h-[520px] rounded-3xl bg-gradient-to-b from-sky-100/60 via-amber-50/30 to-[#FAF8F5] border-2 border-amber-200/50 overflow-hidden relative cursor-grab active:cursor-grabbing select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            {/* World Canvas positioned at center */}
            <div 
              className="absolute left-1/2 top-1/2 transition-transform duration-75"
              style={{
                transform: `translate(calc(-50% + ${panOffset.x}px), calc(-50% + ${panOffset.y}px)) scale(${zoomLevel})`
              }}
            >
              {/* Render 12x12 Isometric Grid */}
              <div className="relative" style={{ width: 900, height: 600 }}>
                {Array.from({ length: GRID_SIZE }).map((_, row) => {
                  return Array.from({ length: GRID_SIZE }).map((_, col) => {
                    const { x, y } = toIsometric(col, row);
                    const unlocked = isTileUnlocked(col, row);
                    const tileType = getTileType(col, row);
                    const buildingOnTile = buildings.find(b => b.position_x === col && b.position_y === row);

                    // Colors by tile type
                    let tileBg = '#86efac'; // lush grass
                    if (tileType === 'water') tileBg = '#38bdf8'; // river
                    if (tileType === 'cobblestone') tileBg = '#cbd5e1'; // stone path
                    if (tileType === 'farmland') tileBg = '#fde68a'; // crops
                    if (tileType === 'bridge') tileBg = '#d97706'; // wood bridge
                    if (!unlocked) tileBg = '#e2e8f0'; // locked mist

                    return (
                      <div
                        key={`${col}-${row}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!unlocked) {
                            showToast('error', 'พื้นที่นี้ยังไม่ได้รับการปลดล็อก กรุณากดปลดล็อกพื้นที่ด้านบน');
                            return;
                          }
                          if (buildingOnTile) {
                            setSelectedBuilding(buildingOnTile);
                          } else if (buildModeActive && !spectatorMode) {
                            setSelectedTileToBuild({ x: col, y: row });
                          }
                        }}
                        className={`absolute group cursor-pointer transition-all ${
                          buildingOnTile ? 'z-20' : 'z-10'
                        }`}
                        style={{
                          left: 450 + x - TILE_WIDTH / 2,
                          top: 150 + y - TILE_HEIGHT / 2,
                          width: TILE_WIDTH,
                          height: TILE_HEIGHT
                        }}
                      >
                        {/* 2.5D Isometric Diamond Tile (SVG) */}
                        <svg 
                          viewBox="0 0 100 50" 
                          className="w-full h-full overflow-visible drop-shadow-xs"
                        >
                          {/* Tile Face */}
                          <polygon
                            points="50,0 100,25 50,50 0,25"
                            fill={tileBg}
                            stroke={unlocked ? (tileType === 'water' ? '#0284c7' : '#4ade80') : '#94a3b8'}
                            strokeWidth="1.2"
                            className="transition-colors hover:fill-amber-200"
                          />
                          {/* 3D Tile Extrusion Lip */}
                          <polygon
                            points="0,25 50,50 50,56 0,31"
                            fill={tileType === 'water' ? '#0369a1' : '#15803d'}
                            opacity="0.8"
                          />
                          <polygon
                            points="50,50 100,25 100,31 50,56"
                            fill={tileType === 'water' ? '#0284c7' : '#166534'}
                            opacity="0.6"
                          />

                          {/* Water ripple animation overlay */}
                          {tileType === 'water' && (
                            <path 
                              d="M 30,22 Q 50,28 70,22" 
                              stroke="#ffffff" 
                              strokeWidth="1" 
                              fill="none" 
                              opacity="0.6"
                              className={animationsEnabled ? 'animate-pulse' : ''}
                            />
                          )}

                          {/* Lock icon on locked territories */}
                          {!unlocked && (
                            <text x="50" y="30" textAnchor="middle" fontSize="14" fill="#64748b">
                              🔒
                            </text>
                          )}
                        </svg>

                        {/* Building Rendered On Top with 2.5D Elevation */}
                        {buildingOnTile && (
                          <div 
                            className={`absolute left-1/2 -top-6 transform -translate-x-1/2 transition-transform hover:scale-110 pointer-events-none ${
                              animationsEnabled && buildingOnTile.building_type === 'castle' ? 'animate-sway-gentle' : ''
                            }`}
                          >
                            <div className="relative flex flex-col items-center">
                              {/* Building Icon / 3D Asset Token */}
                              <span className="text-4xl filter drop-shadow-md">
                                {buildingOnTile.icon}
                              </span>

                              {/* Level Badge */}
                              <span className="text-[9px] font-black bg-slate-900/80 text-white px-1.5 py-0.2 rounded-full border border-amber-300 -mt-1 shadow-xs">
                                Lv.{buildingOnTile.building_level}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Selected Tile Highlight for Building Mode */}
                        {selectedTileToBuild?.x === col && selectedTileToBuild?.y === row && (
                          <div className="absolute inset-0 border-2 border-amber-500 bg-amber-400/30 rounded-full animate-ping pointer-events-none" />
                        )}
                      </div>
                    );
                  });
                })}
              </div>
            </div>

            {/* Quick Map Overlay Helper Info */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-200 text-[11px] text-slate-600 shadow-sm pointer-events-none">
              💡 คลิกที่สิ่งปลูกสร้างเพื่อดูรายละเอียดและอัปเกรด • ลากเมาส์เพื่อเลื่อนแผนที่
            </div>
          </div>

          {/* Building Construction Palette (Pops up when empty tile is selected) */}
          {selectedTileToBuild && (
            <div className="p-5 rounded-3xl bg-amber-50/80 border-2 border-amber-300 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-amber-600" />
                    เลือกสิ่งปลูกสร้างลงในพิกัด ({selectedTileToBuild.x}, {selectedTileToBuild.y})
                  </h4>
                  <p className="text-xs text-slate-500">
                    ใช้ Points จากการเรียนเพื่อสร้างเมือง พัฒนาการป้องกันอาณาจักร
                  </p>
                </div>
                <button
                  onClick={() => setSelectedTileToBuild(null)}
                  className="p-1 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Building Choices */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-1">
                {buildingCatalog.map((cat) => {
                  const canAfford = (currentUser.points || 0) >= cat.price_points;
                  return (
                    <button
                      key={cat.type}
                      onClick={() => handleBuildNew(cat.type)}
                      disabled={isBuildingActionLoading || !canAfford}
                      className={`p-3 rounded-2xl border-2 text-center transition-all ${
                        canAfford 
                          ? 'bg-white border-amber-200 hover:border-sky-400 hover:shadow-md' 
                          : 'bg-slate-100 border-slate-200 opacity-60'
                      }`}
                    >
                      <div className="text-3xl">{cat.icon}</div>
                      <div className="text-xs font-bold text-slate-800 mt-1 truncate">{cat.name}</div>
                      <div className="text-[11px] text-sky-700 font-semibold">+{cat.base_defense} Def</div>
                      <div className="text-xs font-black text-amber-800 mt-0.5">
                        {cat.price_points > 0 ? `${cat.price_points} Pts` : 'ฟรี'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Building Inspect / Upgrade Modal */}
          {selectedBuilding && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
              <div className="w-full max-w-md bg-white border-2 border-amber-200 rounded-3xl p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl p-2 bg-amber-50 rounded-2xl border border-amber-200">
                      {selectedBuilding.icon}
                    </span>
                    <div>
                      <h3 className="text-base font-black text-slate-800">{selectedBuilding.name}</h3>
                      <span className="text-xs font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded">
                        ระดับ (Level) {selectedBuilding.building_level}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => setSelectedBuilding(null)} className="text-slate-400 hover:text-slate-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {selectedBuilding.description}
                </p>

                <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-amber-100 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px]">พลังป้องกัน</span>
                    <span className="font-bold text-sky-700">+{selectedBuilding.defense_bonus} Defense</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">พิกัดในแผนที่</span>
                    <span className="font-bold text-slate-700">({selectedBuilding.position_x}, {selectedBuilding.position_y})</span>
                  </div>
                </div>

                {!spectatorMode && (
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => handleUpgradeBuilding(selectedBuilding.id)}
                      disabled={isBuildingActionLoading || (currentUser.points || 0) < (selectedBuilding.upgrade_cost_points || 40)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
                    >
                      <ArrowUpCircle className="w-4 h-4" />
                      <span>อัปเกรด (+15 Def) ใช้ {selectedBuilding.upgrade_cost_points || 40} Pts</span>
                    </button>

                    {selectedBuilding.building_type !== 'castle' && (
                      <button
                        onClick={() => handleDemolishBuilding(selectedBuilding.id)}
                        disabled={isBuildingActionLoading}
                        className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors"
                        title="รื้อถอน"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: WORLD RIVALS FINDER (ค้นหาอาณาจักรคู่แข่ง) */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'world_rivals' && (
        <div className="space-y-4">
          <div className="card-academy p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 uppercase tracking-wide">
                Kingdom World Map
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-2">
                ค้นหาและท้าทายอาณาจักรของเพื่อนร่วมชั้น
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                เลือกอาณาจักรเป้าหมายเพื่อตอบคำถาม 10 ข้อ ชนะ 10/10 เพื่อขโมย 50 Points! (รักษาความเป็นส่วนตัว ปราศจากข้อมูลส่วนบุคคล)
              </p>
            </div>

            {/* Search */}
            <div className="w-full md:w-64">
              <input
                type="text"
                value={rivalSearch}
                onChange={(e) => setRivalSearch(e.target.value)}
                placeholder="ค้นหาชื่ออาณาจักรหรือชื่อผู้เล่น..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-sky-500 font-medium"
              />
            </div>
          </div>

          {rivalsLoading ? (
            <div className="p-12 text-center text-xs text-slate-500">
              กำลังค้นหาอาณาจักรคู่แข่งในระบบ...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rivals
                .filter(r => !rivalSearch || r.kingdom_name.toLowerCase().includes(rivalSearch.toLowerCase()) || r.ruler_name.toLowerCase().includes(rivalSearch.toLowerCase()))
                .map((rival) => {
                  return (
                    <div 
                      key={rival.kingdom_id}
                      className="card-academy p-5 flex flex-col justify-between space-y-4 hover:shadow-lg transition-all border-2 border-amber-100 hover:border-sky-300"
                    >
                      {/* Top Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl p-2 bg-amber-50 rounded-2xl border border-amber-200 shadow-xs">
                            {rival.ruler_avatar}
                          </span>
                          <div>
                            <h3 className="text-sm font-black text-slate-800 line-clamp-1">{rival.kingdom_name}</h3>
                            <div className="text-xs text-slate-600 font-semibold">{rival.ruler_name}</div>
                            <span className="text-[10px] text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                              Tier {rival.kingdom_level} • {rival.ruler_class}
                            </span>
                          </div>
                        </div>

                        {rival.is_shielded ? (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-1 rounded-full border border-amber-300 flex items-center gap-1 shrink-0">
                            <Shield className="w-3 h-3" /> โล่คุ้มครอง ({rival.shield_time_left_minutes} นาที)
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-1 rounded-full border border-emerald-300 shrink-0">
                            พร้อมท้าทาย
                          </span>
                        )}
                      </div>

                      {/* Stats Grid */}
                      <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-amber-100 grid grid-cols-3 gap-2 text-center text-xs">
                        <div>
                          <span className="text-[10px] text-slate-500 block">พลังป้องกัน</span>
                          <span className="font-black text-sky-700">{rival.defense.defense_level}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block">สิ่งปลูกสร้าง</span>
                          <span className="font-black text-slate-700">{rival.building_count} หลัง</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block">Points ที่มี</span>
                          <span className="font-black text-amber-700">{rival.points}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => handleSpectateKingdom(rival)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>เยี่ยมชม (Visit)</span>
                        </button>

                        <button
                          onClick={() => setChallengeTarget({
                            targetKingdomId: rival.kingdom_id,
                            defenderId: rival.student_id,
                            defenderName: rival.ruler_name,
                            targetKingdomName: rival.kingdom_name
                          })}
                          disabled={rival.is_shielded || !rival.can_attack}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-white font-black text-xs shadow-md transition-all ${
                            rival.is_shielded || !rival.can_attack
                              ? 'bg-slate-300 cursor-not-allowed text-slate-500 shadow-none'
                              : 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-sky-500/20'
                          }`}
                        >
                          <Swords className="w-3.5 h-3.5 text-amber-300" />
                          <span>ท้าทาย (50 Pts)</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: BATTLE HISTORY (ประวัติการรบ) */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'battle_history' && (
        <div className="space-y-4">
          <div className="card-academy p-6">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <Swords className="w-5 h-5 text-sky-600" />
              หอเกียรติยศและประวัติศึกชิงอาณาจักร
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              บันทึกทุกการประลองความรู้ ชัยชนะ ความพ่ายแพ้ และการป้องกันอาณาจักร
            </p>

            {/* History Category Selector */}
            <div className="flex items-center gap-2 mt-4 text-xs font-bold">
              <button
                onClick={() => setHistoryTab('victories')}
                className={`px-4 py-2 rounded-xl border transition-all ${
                  historyTab === 'victories' 
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' 
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                🏆 ชัยชนะ (Victories: {battleHistory.victories.length})
              </button>

              <button
                onClick={() => setHistoryTab('defeats')}
                className={`px-4 py-2 rounded-xl border transition-all ${
                  historyTab === 'defeats' 
                    ? 'bg-rose-600 text-white border-rose-600 shadow-sm' 
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                ❌ พ่ายแพ้ (Defeats: {battleHistory.defeats.length})
              </button>

              <button
                onClick={() => setHistoryTab('defense')}
                className={`px-4 py-2 rounded-xl border transition-all ${
                  historyTab === 'defense' 
                    ? 'bg-sky-600 text-white border-sky-600 shadow-sm' 
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                🛡️ ประวัติการป้องกัน (Defense Log: {battleHistory.defenseLog.length})
              </button>
            </div>
          </div>

          {/* History Lists */}
          <div className="space-y-3">
            {historyTab === 'victories' && (
              battleHistory.victories.length === 0 ? (
                <div className="card-academy p-8 text-center text-xs text-slate-500">ยังไม่มีบันทึกชัยชนะ</div>
              ) : (
                battleHistory.victories.map(btl => (
                  <div key={btl.id} className="card-academy p-4 flex items-center justify-between gap-3 text-xs border-l-4 border-l-emerald-500">
                    <div>
                      <div className="font-bold text-slate-800 text-sm">
                        พิชิตอาณาจักร: {btl.target_kingdom_name} (ตอบถูก {btl.correct_answers}/10 ข้อ)
                      </div>
                      <div className="text-slate-500 text-[11px] mt-0.5">
                        วิชา: {btl.subject} • {btl.topic} • วันที่ {new Date(btl.created_at).toLocaleDateString('th-TH')}
                      </div>
                    </div>
                    <span className="font-black text-emerald-600 text-sm bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                      +{btl.points_transferred} Points
                    </span>
                  </div>
                ))
              )
            )}

            {historyTab === 'defeats' && (
              battleHistory.defeats.length === 0 ? (
                <div className="card-academy p-8 text-center text-xs text-slate-500">ยังไม่มีบันทึกการพ่ายแพ้</div>
              ) : (
                battleHistory.defeats.map(btl => (
                  <div key={btl.id} className="card-academy p-4 flex items-center justify-between gap-3 text-xs border-l-4 border-l-rose-500">
                    <div>
                      <div className="font-bold text-slate-800 text-sm">
                        บุก {btl.target_kingdom_name} ไม่สำเร็จ (ได้ {btl.correct_answers}/10 ข้อ)
                      </div>
                      <div className="text-slate-500 text-[11px] mt-0.5">
                        วิชา: {btl.subject} • ขาดความแม่นยำ 10/10 • วันที่ {new Date(btl.created_at).toLocaleDateString('th-TH')}
                      </div>
                    </div>
                    <span className="font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-xl">
                      0 Points
                    </span>
                  </div>
                ))
              )
            )}

            {historyTab === 'defense' && (
              battleHistory.defenseLog.length === 0 ? (
                <div className="card-academy p-8 text-center text-xs text-slate-500">ยังไม่มีใครท้าทายอาณาจักรของคุณ</div>
              ) : (
                battleHistory.defenseLog.map(btl => (
                  <div key={btl.id} className="card-academy p-4 flex items-center justify-between gap-3 text-xs border-l-4 border-l-sky-500">
                    <div>
                      <div className="font-bold text-slate-800 text-sm">
                        ถูกท้าทายโดย: {btl.attacker_name} ({btl.result === 'victory' ? 'ผู้ท้าทายตอบถูก 10/10' : 'ป้องกันสำเร็จ'})
                      </div>
                      <div className="text-slate-500 text-[11px] mt-0.5">
                        วิชา: {btl.subject} • วันที่ {new Date(btl.created_at).toLocaleDateString('th-TH')}
                      </div>
                    </div>
                    <span className={`font-black text-xs px-3 py-1 rounded-xl ${
                      btl.points_transferred > 0 ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {btl.points_transferred > 0 ? `-${btl.points_transferred} Points` : 'ป้องกันเหนียวแน่น'}
                    </span>
                  </div>
                ))
              )
            )}
          </div>
        </div>
      )}

      {/* Battle Arena Modal */}
      {challengeTarget && (
        <KingdomBattleArenaModal
          currentUser={currentUser}
          targetKingdomId={challengeTarget.targetKingdomId}
          defenderId={challengeTarget.defenderId}
          defenderName={challengeTarget.defenderName}
          targetKingdomName={challengeTarget.targetKingdomName}
          onClose={() => setChallengeTarget(null)}
          onBattleFinished={() => {
            onRefreshUser();
            fetchDominationData();
            fetchRivals();
            fetchHistory();
          }}
          animationsEnabled={animationsEnabled}
        />
      )}

    </div>
  );
};
