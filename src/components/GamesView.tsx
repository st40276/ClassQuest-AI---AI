import React, { useState } from 'react';
import { Game, GameType } from '../types';
import { 
  Sword, Sparkles, Shield, Flame, Trophy, 
  Play, Clock, CheckCircle2, RotateCcw, Filter, Star, Coins
} from 'lucide-react';

interface GamesViewProps {
  games: Game[];
  onPlayGame: (gameId: string) => void;
  onOpenAIGenerator?: () => void;
  isTeacher?: boolean;
}

export const GamesView: React.FC<GamesViewProps> = ({
  games,
  onPlayGame,
  onOpenAIGenerator,
  isTeacher
}) => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const filteredGames = games.filter(g => {
    if (selectedType !== 'all' && g.game_type !== selectedType) return false;
    if (selectedDifficulty !== 'all' && g.difficulty !== selectedDifficulty) return false;
    return true;
  });

  const categories = [
    { id: 'all', label: 'ทั้งหมด', icon: Sparkles },
    { id: 'quiz_battle', label: '⚔️ Quiz Battle', icon: Sword },
    { id: 'team_battle', label: '🛡️ Team Battle', icon: Shield },
    { id: 'mission_quest', label: '📜 Mission Quest', icon: Star },
    { id: 'daily_challenge', label: '🔥 Daily Challenge', icon: Flame },
    { id: 'weekly_challenge', label: '👑 Weekly Challenge', icon: Trophy },
  ];

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header Banner */}
      <div className="card-academy p-6 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200 uppercase">
            ClassQuest Arena
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1.5">
            สนามประลองการเรียนรู้และเควสต์ผจญภัย
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            เลือกเควสต์ที่ท้าทาย สะสม XP & Points เพื่อก้าวสู่เลเวลใหม่และพัฒนาอาณาจักรของคุณ
          </p>
        </div>

        {isTeacher && onOpenAIGenerator && (
          <button
            onClick={onOpenAIGenerator}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-md shadow-sky-500/20 transition-all shrink-0"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>สร้างเกมใหม่ด้วย AI</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedType(cat.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedType === cat.id
                ? 'bg-sky-500 text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGames.map((game) => {
          const completed = (game as any).completed;
          const bestScore = (game as any).best_score;
          const maxScore = (game as any).max_score;

          return (
            <div
              key={game.id}
              className={`card-academy p-5 rounded-3xl border transition-all flex flex-col justify-between ${
                completed
                  ? 'border-emerald-200 bg-emerald-50/20 hover:border-emerald-300'
                  : 'border-slate-200 hover:border-sky-300 hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                    {game.subject}
                  </span>

                  <span className="text-xs font-extrabold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    +{game.reward_xp} XP • +50 Pts
                  </span>
                </div>

                <div className="mt-3">
                  <span className="text-[10px] font-bold text-slate-400 block">
                    {game.game_type === 'quiz_battle' && '⚔️ Quiz Battle'}
                    {game.game_type === 'team_battle' && '🛡️ Team Battle'}
                    {game.game_type === 'mission_quest' && '📜 Mission Quest'}
                    {game.game_type === 'daily_challenge' && '🔥 Daily Challenge'}
                    {game.game_type === 'weekly_challenge' && '👑 Weekly Challenge'}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5 line-clamp-2">
                    {game.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    หัวข้อ: {game.topic}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {game.time_limit || 30}s / ข้อ
                  </span>

                  {completed ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ผ่านแล้ว ({bestScore}/{maxScore})
                    </span>
                  ) : (
                    <span className="text-amber-600 font-semibold">ยังไม่ได้เล่น</span>
                  )}
                </div>

                <button
                  onClick={() => onPlayGame(game.id)}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all ${
                    completed
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                      : 'bg-sky-500 hover:bg-sky-600 text-white shadow-sky-500/20'
                  }`}
                >
                  {completed ? (
                    <>
                      <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                      <span>เล่นซ้ำเพื่อฝึกฝน</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>เริ่มการผจญภัย</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
