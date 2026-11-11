import React, { useState, useEffect } from 'react';
import { Team, User } from '../types';
import { api } from '../services/api';
import { Shield, Users, Trophy, Award, CheckCircle2, ArrowRight } from 'lucide-react';

interface TeamsViewProps {
  currentUser: User | null;
  onRefreshUser: () => void;
}

export const TeamsView: React.FC<TeamsViewProps> = ({ currentUser, onRefreshUser }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const res = await api.getTeams();
      setTeams(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTeam = async (teamId: string) => {
    setIsJoining(true);
    try {
      await api.joinTeam(teamId);
      fetchTeams();
      onRefreshUser();
    } catch (err) {
      console.error(err);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="card-academy p-6 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200 uppercase">
            Guild Alliances
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1.5">
            กิลด์พันธมิตรและสงครามทีม (Guild & Teams)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            เข้าร่วมกิลด์ รวมพลังกับเพื่อนในห้องเรียน ทำเควสต์สะสมแต้มรวมเพื่อชิงอันดับสูงสุด
          </p>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {teams.map((team, idx) => {
          const isMember = (team as any).members?.some((m: any) => m.id === currentUser?.id);

          return (
            <div
              key={team.id}
              className={`card-academy p-6 rounded-3xl border transition-all flex flex-col justify-between ${
                isMember
                  ? 'border-sky-400 ring-2 ring-sky-200 bg-sky-50/20 shadow-md'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-4xl p-2 bg-slate-50 rounded-2xl border border-slate-100 shadow-xs">
                    {team.icon}
                  </span>

                  {isMember ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" /> สมาชิกกิลด์
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                      อันดับ #{idx + 1}
                    </span>
                  )}
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-black text-slate-900">
                    {team.team_name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-xs">
                    <span className="text-amber-600 font-extrabold text-sm">
                      {team.total_xp.toLocaleString()} XP รวม
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500">
                      {(team as any).members_count || 0} สมาชิก
                    </span>
                  </div>
                </div>

                {/* Team Members List */}
                <div className="mt-5 space-y-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    สหายร่วมกิลด์
                  </div>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {(team as any).members?.map((member: any) => (
                      <div key={member.id} className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span>{member.avatar}</span>
                          <span className="font-semibold text-slate-800">{member.display_name}</span>
                        </div>
                        <span className="text-sky-600 font-bold">{member.xp} XP</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                {currentUser?.role === 'student' && (
                  <button
                    disabled={isMember || isJoining}
                    onClick={() => handleJoinTeam(team.id)}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all ${
                      isMember
                        ? 'bg-slate-100 text-slate-500 cursor-default'
                        : 'bg-sky-500 hover:bg-sky-600 text-white shadow-md shadow-sky-500/20'
                    }`}
                  >
                    {isMember ? 'คุณอยู่ในกิลด์นี้แล้ว' : 'เข้าร่วมสังกัดกิลด์นี้'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
