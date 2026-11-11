/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  User, Classroom, Game, Mission, Badge, Notification, LearningAnalytics, KingdomTier 
} from './types';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { StudentDashboard } from './components/StudentDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { KingdomAdventureView } from './components/KingdomAdventureView';
import { KingdomShopModal } from './components/KingdomShopModal';
import { InventoryModal } from './components/InventoryModal';
import { PointWalletModal } from './components/PointWalletModal';
import { CastleUpgradeModal } from './components/CastleUpgradeModal';
import { GamePlayModal } from './components/GamePlayModal';
import { AIQuestGeneratorModal } from './components/AIQuestGeneratorModal';
import { AILearningAssistantModal } from './components/AILearningAssistantModal';
import { ClassroomsView } from './components/ClassroomsView';
import { GamesView } from './components/GamesView';
import { LeaderboardView } from './components/LeaderboardView';
import { BadgesView } from './components/BadgesView';
import { TeamsView } from './components/TeamsView';
import { AnalyticsView } from './components/AnalyticsView';
import { ReportsView } from './components/ReportsView';
import { AuthModal } from './components/AuthModal';
import { Bot, Sparkles } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<(User & { nextLevelXp?: number; prevLevelXp?: number }) | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [analytics, setAnalytics] = useState<LearningAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  // Animations toggle (persisted in localStorage)
  const [animationsEnabled, setAnimationsEnabled] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('cq_animations_enabled');
      return stored !== 'false';
    } catch {
      return true;
    }
  });

  const toggleAnimations = () => {
    setAnimationsEnabled(prev => {
      const next = !prev;
      try {
        localStorage.setItem('cq_animations_enabled', String(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  // Modals
  const [activeGame, setActiveGame] = useState<(Game & { questions?: any[] }) | null>(null);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [aiAssistantData, setAiAssistantData] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showShopModal, setShowShopModal] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Initial load
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [userData, usersList, classList, gamesList, missionsList, badgesList, notifsList] = await Promise.all([
        api.getMe(),
        api.getUsers(),
        api.getClassrooms(),
        api.getGames(),
        api.getMissions(),
        api.getBadges(),
        api.getNotifications()
      ]);

      setCurrentUser(userData);
      setUsers(usersList);
      setClassrooms(classList);
      setGames(gamesList);
      setMissions(missionsList);
      setBadges(badgesList);
      setNotifications(notifsList);

      if (userData.role === 'teacher') {
        setCurrentTab('teacher_dashboard');
        const anData = await api.getTeacherAnalytics();
        setAnalytics(anData);
      } else {
        setCurrentTab('dashboard');
      }
    } catch (err) {
      console.error('Initialization error:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshUserData = async () => {
    try {
      const userData = await api.getMe();
      setCurrentUser(userData);
      const [gamesList, missionsList, badgesList, notifsList] = await Promise.all([
        api.getGames(),
        api.getMissions(),
        api.getBadges(),
        api.getNotifications()
      ]);
      setGames(gamesList);
      setMissions(missionsList);
      setBadges(badgesList);
      setNotifications(notifsList);

      if (userData.role === 'teacher') {
        const anData = await api.getTeacherAnalytics();
        setAnalytics(anData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSwitchUser = async (userId: string) => {
    try {
      await api.switchUser(userId);
      const freshUser = await api.getMe();
      setCurrentUser(freshUser);
      const isTeacher = freshUser.role === 'teacher';
      setCurrentTab(isTeacher ? 'teacher_dashboard' : 'dashboard');
      
      const [classList, gamesList, missionsList, badgesList, notifsList] = await Promise.all([
        api.getClassrooms(),
        api.getGames(),
        api.getMissions(),
        api.getBadges(),
        api.getNotifications()
      ]);
      setClassrooms(classList);
      setGames(gamesList);
      setMissions(missionsList);
      setBadges(badgesList);
      setNotifications(notifsList);

      if (isTeacher) {
        const anData = await api.getTeacherAnalytics();
        setAnalytics(anData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartGame = async (gameId: string) => {
    try {
      const fullGame = await api.getGame(gameId);
      setActiveGame(fullGame);
    } catch (err) {
      console.error('Failed to load game:', err);
    }
  };

  const handleClaimMission = async (missionId: string) => {
    try {
      await api.claimMission(missionId);
      refreshUserData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateAvatar = async (avatar: string, avatarClass: string) => {
    try {
      await api.updateProfile({ avatar, avatar_class: avatarClass });
      refreshUserData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadReport = () => {
    window.location.href = '/api/reports/csv';
  };

  const handleMarkNotificationRead = async (id: string) => {
    await api.markNotificationRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read_status: true } : n));
  };

  // Role guard: enforce that students cannot access teacher-only views
  const isTeacher = currentUser?.role === 'teacher';
  let safeTab = currentTab;
  if (!isTeacher && ['teacher_dashboard', 'ai_generator', 'analytics'].includes(currentTab)) {
    safeTab = 'dashboard';
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center text-slate-800">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-sky-400 via-amber-400 to-emerald-400 p-1 animate-pulse shadow-xl">
          <div className="w-full h-full bg-white rounded-[20px] flex items-center justify-center text-2xl shadow-inner">
            🏰
          </div>
        </div>
        <h2 className="text-lg font-black text-slate-800 mt-4">
          กำลังเตรียมห้องเรียนผจญภัย ClassQuest AI...
        </h2>
        <p className="text-xs text-sky-600 font-medium mt-1">ยินดีต้อนรับสู่สถาบันการเรียนรู้แฟนตาซี</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#FAF8F5] text-slate-800 flex flex-col selection:bg-sky-500 selection:text-white ${!animationsEnabled ? 'no-animations' : ''}`}>
      
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        users={users}
        currentTab={safeTab}
        setCurrentTab={(tab) => {
          if (tab === 'ai_generator') {
            setShowAIGenerator(true);
          } else {
            setCurrentTab(tab);
          }
        }}
        onSwitchUser={handleSwitchUser}
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenWallet={() => setShowWalletModal(true)}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        animationsEnabled={animationsEnabled}
        onToggleAnimations={toggleAnimations}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 sm:pb-8">
        {/* Student Dashboard */}
        {safeTab === 'dashboard' && currentUser && (
          <StudentDashboard
            user={currentUser}
            games={games}
            missions={missions}
            badges={badges}
            classrooms={classrooms}
            onPlayGame={handleStartGame}
            onJoinClassroom={() => setCurrentTab('classrooms')}
            onNavigateTab={setCurrentTab}
            onClaimMission={handleClaimMission}
            onUpdateAvatar={handleUpdateAvatar}
            animationsEnabled={animationsEnabled}
          />
        )}

        {/* Kingdom Adventure */}
        {safeTab === 'kingdom' && currentUser && (
          <KingdomAdventureView
            currentUser={currentUser}
            onRefreshUser={refreshUserData}
            onOpenShop={() => setShowShopModal(true)}
            onOpenInventory={() => setShowInventoryModal(true)}
            onOpenWallet={() => setShowWalletModal(true)}
            onOpenUpgradeModal={() => setShowUpgradeModal(true)}
            animationsEnabled={animationsEnabled}
          />
        )}

        {/* Teacher Views */}
        {safeTab === 'teacher_dashboard' && isTeacher && (
          <TeacherDashboard
            analytics={analytics}
            classrooms={classrooms}
            games={games}
            students={users.filter(u => u.role === 'student')}
            onOpenAIGenerator={() => setShowAIGenerator(true)}
            onCreateClassroom={() => setCurrentTab('classrooms')}
            onNavigateTab={setCurrentTab}
            onDownloadReport={handleDownloadReport}
          />
        )}

        {/* Shared / Route Views */}
        {safeTab === 'games' && (
          <GamesView
            games={games}
            onPlayGame={handleStartGame}
            onOpenAIGenerator={() => setShowAIGenerator(true)}
            isTeacher={isTeacher}
          />
        )}

        {safeTab === 'classrooms' && (
          <ClassroomsView
            currentUser={currentUser}
            classrooms={classrooms}
            onRefreshClassrooms={async () => {
              const freshClass = await api.getClassrooms();
              setClassrooms(freshClass);
            }}
            onSelectGame={handleStartGame}
          />
        )}

        {safeTab === 'teams' && (
          <TeamsView
            currentUser={currentUser}
            onRefreshUser={refreshUserData}
          />
        )}

        {safeTab === 'badges' && (
          <BadgesView badges={badges} />
        )}

        {safeTab === 'leaderboard' && (
          <LeaderboardView />
        )}

        {safeTab === 'analytics' && isTeacher && (
          <AnalyticsView
            analytics={analytics}
            onOpenAIGenerator={() => setShowAIGenerator(true)}
          />
        )}

        {safeTab === 'reports' && (
          <ReportsView
            currentUser={currentUser}
            classrooms={classrooms}
            analytics={analytics}
            games={games}
            onDownloadCSV={handleDownloadReport}
          />
        )}
      </main>

      {/* Floating AI Mentor Button */}
      <button
        onClick={() => {
          setAiAssistantData(null);
          setShowAIAssistant(true);
        }}
        className={`fixed bottom-20 sm:bottom-6 right-5 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-xs sm:text-sm shadow-xl shadow-sky-500/30 hover:scale-105 active:scale-95 transition-all glow-sky ${
          animationsEnabled ? 'animate-float' : ''
        }`}
        title="ถามผู้ช่วยการเรียนรู้ ClassQuest AI Mentor"
      >
        <Bot className="w-5 h-5 text-amber-300" />
        <span className="hidden sm:inline">AI Learning Mentor</span>
      </button>

      {/* Interactive Gameplay Modal */}
      {activeGame && (
        <GamePlayModal
          game={activeGame}
          onClose={() => setActiveGame(null)}
          onGameCompleted={() => {
            refreshUserData();
          }}
          onOpenAIAssistant={(data) => {
            setAiAssistantData(data);
            setShowAIAssistant(true);
          }}
          animationsEnabled={animationsEnabled}
        />
      )}

      {/* AI Quest Generator Modal (Teacher) */}
      {showAIGenerator && (
        <AIQuestGeneratorModal
          classrooms={classrooms}
          onClose={() => setShowAIGenerator(false)}
          onGameCreated={() => {
            refreshUserData();
            setCurrentTab('games');
          }}
        />
      )}

      {/* AI Learning Assistant Modal */}
      {showAIAssistant && (
        <AILearningAssistantModal
          initialData={aiAssistantData}
          onClose={() => {
            setShowAIAssistant(false);
            setAiAssistantData(null);
          }}
        />
      )}

      {/* Auth / Switch Account Modal */}
      {showAuthModal && (
        <AuthModal
          users={users}
          currentUser={currentUser}
          onClose={() => setShowAuthModal(false)}
          onSuccess={(user) => {
            handleSwitchUser(user.id);
          }}
        />
      )}

      {/* Kingdom Shop Modal */}
      {showShopModal && currentUser && (
        <KingdomShopModal
          currentUser={currentUser}
          onClose={() => setShowShopModal(false)}
          onRefreshUser={refreshUserData}
          animationsEnabled={animationsEnabled}
        />
      )}

      {/* Inventory Modal */}
      {showInventoryModal && (
        <InventoryModal
          onClose={() => setShowInventoryModal(false)}
          onGoToEditor={() => {
            setShowInventoryModal(false);
            setCurrentTab('kingdom');
          }}
          animationsEnabled={animationsEnabled}
        />
      )}

      {/* Points Wallet Modal */}
      {showWalletModal && currentUser && (
        <PointWalletModal
          currentUser={currentUser}
          onClose={() => setShowWalletModal(false)}
          animationsEnabled={animationsEnabled}
        />
      )}

      {/* Castle Upgrade Modal */}
      {showUpgradeModal && currentUser && (
        <CastleUpgradeModal
          currentUser={currentUser}
          currentKingdomLevel={1 as KingdomTier}
          onClose={() => setShowUpgradeModal(false)}
          onRefresh={refreshUserData}
          animationsEnabled={animationsEnabled}
        />
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-amber-200/50 bg-white/80 backdrop-blur-sm py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-black text-slate-800">ClassQuest AI</span>
            <span>•</span>
            <span>ห้องเรียนผจญภัยด้วย AI และ Gamification เพื่อการศึกษาไทย</span>
          </div>
          <div className="text-[11px] text-slate-500">
            มาตรฐานหลักสูตรแกนกลาง • Gemini 3.8 Flash Engine • Kingdom Adventure v2.0
          </div>
        </div>
      </footer>

    </div>
  );
}
