import { 
  User, Classroom, Game, Mission, Badge, Team, 
  Notification, LearningAnalytics, AIQuestGenerationParams,
  Kingdom, ShopItem, InventoryItem, PointTransaction, RivalKingdom
} from '../types';

export const api = {
  // Kingdom Adventure
  async getKingdom(): Promise<Kingdom & { castleItem?: ShopItem }> {
    const res = await fetch('/api/kingdom');
    if (!res.ok) throw new Error('Failed to fetch kingdom');
    return res.json();
  },

  async saveKingdomLayout(data: { kingdom_name?: string; castle_id?: string; terrain?: string; decorations: any[] }): Promise<{ success: boolean; kingdom: Kingdom }> {
    const res = await fetch('/api/kingdom/layout', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const resData = await res.json();
    if (!res.ok) throw new Error(resData.error || 'Failed to save kingdom layout');
    return resData;
  },

  async upgradeKingdom(): Promise<{ success: boolean; kingdom: Kingdom; remainingPoints: number }> {
    const res = await fetch('/api/kingdom/upgrade', {
      method: 'POST'
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to upgrade kingdom');
    return data;
  },

  // Shop & Inventory
  async getShopItems(): Promise<ShopItem[]> {
    const res = await fetch('/api/shop/items');
    return res.json();
  },

  async buyShopItem(item_id: string): Promise<{ success: boolean; item: ShopItem; remainingPoints: number }> {
    const res = await fetch('/api/shop/buy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item_id })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to buy item');
    return data;
  },

  async getInventory(): Promise<InventoryItem[]> {
    const res = await fetch('/api/inventory');
    return res.json();
  },

  async getWallet(): Promise<{ points: number; transactions: PointTransaction[] }> {
    const res = await fetch('/api/wallet');
    return res.json();
  },
  // Auth & Profile
  async getMe(): Promise<User & { nextLevelXp: number; prevLevelXp: number }> {
    const res = await fetch('/api/auth/me');
    if (!res.ok) throw new Error('Failed to fetch user');
    return res.json();
  },

  async getUsers(): Promise<User[]> {
    const res = await fetch('/api/auth/users');
    return res.json();
  },

  async switchUser(userId: string): Promise<{ success: boolean; user: User }> {
    const res = await fetch('/api/auth/switch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    return res.json();
  },

  async login(username: string): Promise<{ success: boolean; user: User }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    return data;
  },

  async register(data: { username: string; display_name: string; role: 'student' | 'teacher'; grade?: string; school?: string; avatar?: string }): Promise<{ success: boolean; user: User }> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const resData = await res.json();
    if (!res.ok) throw new Error(resData.error || 'Register failed');
    return resData;
  },

  async updateProfile(data: { display_name?: string; avatar?: string; avatar_class?: string }): Promise<{ success: boolean; user: User }> {
    const res = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Classrooms
  async getClassrooms(): Promise<Classroom[]> {
    const res = await fetch('/api/classrooms');
    return res.json();
  },

  async getClassroom(id: string): Promise<Classroom & { members: any[]; games: Game[] }> {
    const res = await fetch(`/api/classrooms/${id}`);
    return res.json();
  },

  async createClassroom(data: { classroom_name: string; subject: string; grade_level: string }): Promise<{ success: boolean; classroom: Classroom }> {
    const res = await fetch('/api/classrooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const resData = await res.json();
    if (!res.ok) throw new Error(resData.error || 'Failed to create classroom');
    return resData;
  },

  async joinClassroom(join_code: string): Promise<{ success: boolean; classroom: Classroom }> {
    const res = await fetch('/api/classrooms/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ join_code })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to join classroom');
    return data;
  },

  async removeStudentFromClassroom(classroomId: string, studentId: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/classrooms/${classroomId}/members/${studentId}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // Games
  async getGames(classroomId?: string, gameType?: string): Promise<Game[]> {
    const params = new URLSearchParams();
    if (classroomId) params.append('classroom_id', classroomId);
    if (gameType) params.append('game_type', gameType);
    const res = await fetch(`/api/games?${params.toString()}`);
    return res.json();
  },

  async getGame(id: string): Promise<Game & { questions: any[]; previousAttempt?: any }> {
    const res = await fetch(`/api/games/${id}`);
    return res.json();
  },

  async createGame(data: any): Promise<{ success: boolean; game: Game }> {
    const res = await fetch('/api/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const resData = await res.json();
    if (!res.ok) throw new Error(resData.error || 'Failed to create game');
    return resData;
  },

  async submitGameAnswers(gameId: string, answers: { question_id: string; selected_option: number; time_spent_seconds?: number }[]): Promise<any> {
    const res = await fetch(`/api/games/${gameId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to submit game answers');
    return data;
  },

  // Missions
  async getMissions(): Promise<Mission[]> {
    const res = await fetch('/api/missions');
    return res.json();
  },

  async claimMission(id: string): Promise<any> {
    const res = await fetch(`/api/missions/${id}/claim`, {
      method: 'POST'
    });
    return res.json();
  },

  // Badges
  async getBadges(): Promise<Badge[]> {
    const res = await fetch('/api/badges');
    return res.json();
  },

  // Teams
  async getTeams(): Promise<Team[]> {
    const res = await fetch('/api/teams');
    return res.json();
  },

  async joinTeam(teamId: string): Promise<{ success: boolean; team: Team }> {
    const res = await fetch(`/api/teams/${teamId}/join`, {
      method: 'POST'
    });
    return res.json();
  },

  // Leaderboard
  async getLeaderboard(type: 'individual' | 'team' | 'classroom' | 'weekly' = 'individual'): Promise<any[]> {
    const res = await fetch(`/api/leaderboard?type=${type}`);
    return res.json();
  },

  // Analytics
  async getTeacherAnalytics(): Promise<LearningAnalytics> {
    const res = await fetch('/api/analytics/teacher');
    return res.json();
  },

  // AI Quest Generator
  async generateAIQuest(params: AIQuestGenerationParams): Promise<any> {
    const res = await fetch('/api/ai/generate-quest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'AI generation failed');
    return data.data;
  },

  // AI Learning Assistant
  async askAILearningAssistant(payload: { question: string; options: string[]; userAnswer?: string; correctAnswer?: string; topic?: string; subject?: string }): Promise<string> {
    const res = await fetch('/api/ai/learning-assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    return data.explanation;
  },

  // Notifications
  async getNotifications(): Promise<Notification[]> {
    const res = await fetch('/api/notifications');
    return res.json();
  },

  async markNotificationRead(id: string): Promise<void> {
    await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
  },

  // -------------------------------------------------------------
  // Kingdom Domination
  // -------------------------------------------------------------
  async getDominationOverview(): Promise<any> {
    const res = await fetch('/api/kingdom/domination/overview');
    if (!res.ok) throw new Error('Failed to load kingdom domination overview');
    return res.json();
  },

  async getBuildingCatalog(): Promise<any[]> {
    const res = await fetch('/api/kingdom/domination/catalog');
    return res.json();
  },

  async buildBuilding(data: { building_type: string; position_x: number; position_y: number }): Promise<any> {
    const res = await fetch('/api/kingdom/domination/build', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const resData = await res.json();
    if (!res.ok) throw new Error(resData.error || 'Failed to construct building');
    return resData;
  },

  async upgradeBuilding(building_id: string): Promise<any> {
    const res = await fetch('/api/kingdom/domination/upgrade-building', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ building_id })
    });
    const resData = await res.json();
    if (!res.ok) throw new Error(resData.error || 'Failed to upgrade building');
    return resData;
  },

  async demolishBuilding(building_id: string): Promise<any> {
    const res = await fetch('/api/kingdom/domination/demolish-building', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ building_id })
    });
    const resData = await res.json();
    if (!res.ok) throw new Error(resData.error || 'Failed to demolish building');
    return resData;
  },

  async unlockTerritory(area_id: string): Promise<any> {
    const res = await fetch('/api/kingdom/domination/unlock-territory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ area_id })
    });
    const resData = await res.json();
    if (!res.ok) throw new Error(resData.error || 'Failed to unlock territory');
    return resData;
  },

  async getRivalKingdoms(): Promise<RivalKingdom[]> {
    const res = await fetch('/api/kingdom/domination/rivals');
    return res.json();
  },

  async getSpectatorKingdom(kingdomId: string): Promise<any> {
    const res = await fetch(`/api/kingdom/domination/kingdom/${kingdomId}`);
    if (!res.ok) throw new Error('Failed to load spectator kingdom');
    return res.json();
  },

  async startKingdomBattle(defender_id: string, subject?: string): Promise<any> {
    const res = await fetch('/api/kingdom/domination/battle/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ defender_id, subject })
    });
    const resData = await res.json();
    if (!res.ok) throw new Error(resData.error || 'Failed to start battle');
    return resData;
  },

  async submitKingdomBattle(battle_id: string, answers: number[]): Promise<any> {
    const res = await fetch('/api/kingdom/domination/battle/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ battle_id, answers })
    });
    const resData = await res.json();
    if (!res.ok) throw new Error(resData.error || 'Failed to submit battle answers');
    return resData;
  },

  async getKingdomBattleHistory(): Promise<any> {
    const res = await fetch('/api/kingdom/domination/battle/history');
    return res.json();
  }
};
