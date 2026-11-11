export type UserRole = 'student' | 'teacher';

export type StudentLevelTitle = 
  | 'Beginner (ผู้เริ่มต้น)'
  | 'Explorer (นักสำรวจ)'
  | 'Adventurer (นักผจญภัย)'
  | 'Scholar (ผู้คงแก่เรียน)'
  | 'Master (ปรมาจารย์)'
  | 'Legend (ตำนานแห่งเควสต์)';

export interface User {
  id: string;
  username: string;
  display_name: string;
  role: UserRole;
  avatar: string; // Avatar identifier or emoji/icon style
  avatar_class?: string; // Character class: เช่น นักรบเวท, จอมปราชญ์, ผู้พิทักษ์
  xp: number;
  points: number; // Currency points for kingdom decorations
  level: number;
  level_title: StudentLevelTitle;
  school?: string;
  grade?: string;
  daily_streak: number;
  last_active?: string;
  created_at: string;
}

export type KingdomTier = 1 | 2 | 3 | 4 | 5;

export interface Kingdom {
  id: string;
  student_id: string;
  kingdom_name: string;
  kingdom_level: KingdomTier; // 1: Tiny, 2: Growing, 3: Royal, 4: Fantasy, 5: Legendary
  castle_id: string;
  layout_data: {
    terrain: string; // 'grass' | 'lake' | 'mystic' | 'stone' | 'snow'
    decorations: KingdomDecoration[];
    buildings?: KingdomBuilding[];
  };
  unlocked_areas: string[]; // e.g. ['main', 'garden', 'village', 'tower', 'lake', 'east_farm', 'north_citadel']
  created_at: string;
  updated_at: string;
}

export type BuildingType = 
  | 'castle' 
  | 'wall' 
  | 'tower' 
  | 'house' 
  | 'farm' 
  | 'market' 
  | 'storage' 
  | 'garden' 
  | 'gate' 
  | 'bridge'
  | 'academy_monument';

export interface KingdomBuilding {
  id: string;
  kingdom_id: string;
  building_id: string;
  building_type: BuildingType;
  name: string;
  position_x: number;
  position_y: number;
  building_level: number;
  defense_bonus: number;
  icon: string;
  description: string;
  upgrade_cost_points: number;
  resource_yield?: string;
  width?: number;
  height?: number;
}

export interface KingdomDefense {
  id: string;
  kingdom_id: string;
  shield_status: boolean;
  shield_expires_at: string | null;
  defense_level: number;
  wall_level: number;
  tower_count: number;
  total_defenses: number;
  last_attacked_at?: string | null;
}

export interface KingdomBattle {
  id: string;
  attacker_id: string;
  attacker_name: string;
  defender_id: string;
  defender_name: string;
  target_kingdom_id: string;
  target_kingdom_name: string;
  subject: string;
  topic: string;
  questions_count: number;
  correct_answers: number;
  result: 'victory' | 'defeat';
  points_transferred: number;
  created_at: string;
  questions?: any[];
}

export interface KingdomBattleQuestion {
  id: string;
  battle_id: string;
  question_id: string;
  selected_answer: number;
  correct_answer: number;
  is_correct: boolean;
}

export interface KingdomBattleCooldown {
  id: string;
  attacker_id: string;
  defender_id: string;
  next_available_at: string;
}

export interface RivalKingdom {
  kingdom_id: string;
  student_id: string;
  kingdom_name: string;
  ruler_name: string;
  ruler_avatar: string;
  ruler_class: string;
  kingdom_level: KingdomTier;
  points: number;
  defense: KingdomDefense;
  building_count: number;
  is_shielded: boolean;
  shield_time_left_minutes: number;
  can_attack: boolean;
  cooldown_until?: string | null;
}

export interface PointTransaction {
  id: string;
  student_id: string;
  transaction_type: 'earned' | 'spent';
  amount: number;
  source: string;
  reference_id?: string;
  created_at: string;
}

export type ItemCategory = 'castle' | 'decoration' | 'landscape' | 'special';
export type ItemRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface ShopItem {
  id: string;
  item_name: string;
  item_type: string;
  item_category: ItemCategory;
  price_points: number;
  rarity: ItemRarity;
  image_url: string; // emoji or custom SVG icon token
  unlock_level: number;
  description: string;
  dimensions?: { width: number; height: number };
}

export interface InventoryItem {
  id: string;
  student_id: string;
  item_id: string;
  quantity: number;
  purchased_at: string;
  item?: ShopItem;
}

export interface KingdomDecoration {
  id: string;
  kingdom_id: string;
  item_id: string;
  position_x: number; // grid x coordinate
  position_y: number; // grid y coordinate
  rotation: number; // 0, 90, 180, 270
  scale: number;
  item?: ShopItem;
  created_at?: string;
}

export interface Classroom {
  id: string;
  classroom_name: string;
  subject: string;
  grade_level: string;
  teacher_id: string;
  teacher_name?: string;
  join_code: string;
  banner_color?: string;
  student_count?: number;
  created_at: string;
}

export interface ClassroomMember {
  id: string;
  classroom_id: string;
  student_id: string;
  joined_at: string;
  student?: User;
}

export type GameType = 'quiz_battle' | 'team_battle' | 'mission_quest' | 'daily_challenge' | 'weekly_challenge';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type QuestionStyle = 'multiple_choice' | 'true_false' | 'analytical' | 'scenario';

export interface Question {
  id: string;
  game_id: string;
  question: string;
  options: string[];
  correct_answer: number; // 0-based index
  explanation: string;
  difficulty: DifficultyLevel;
  question_style?: QuestionStyle;
  points: number;
  time_limit?: number; // seconds
}

export interface Game {
  id: string;
  title: string;
  subject: string;
  topic: string;
  difficulty: DifficultyLevel;
  game_type: GameType;
  teacher_id: string;
  classroom_id: string;
  classroom_name?: string;
  status: 'draft' | 'published';
  reward_xp: number;
  time_limit?: number; // total or per-question seconds
  start_date?: string;
  end_date?: string;
  questions?: Question[];
  created_at: string;
}

export interface GameAttempt {
  id: string;
  student_id: string;
  student_name?: string;
  game_id: string;
  game_title?: string;
  score: number;
  max_score: number;
  xp_earned: number;
  answers: {
    question_id: string;
    selected_option: number;
    is_correct: boolean;
    time_spent_seconds?: number;
  }[];
  completed_at: string;
}

export type MissionType = 'daily' | 'weekly' | 'quest' | 'special';
export type MissionStatus = 'available' | 'in_progress' | 'completed';

export interface Mission {
  id: string;
  title: string;
  description: string;
  mission_type: MissionType;
  reward_xp: number;
  requirement_type: 'play_games' | 'perfect_score' | 'team_assist' | 'study_topic' | 'daily_streak';
  requirement_target: number;
  classroom_id?: string;
  start_date: string;
  end_date: string;
}

export interface MissionProgress {
  id: string;
  student_id: string;
  mission_id: string;
  current_count: number;
  status: MissionStatus;
  completed_at?: string;
}

export interface Badge {
  id: string;
  badge_name: string;
  name_th: string;
  description: string;
  condition: string;
  icon: string;
  color: string;
  category: 'quest' | 'quiz' | 'team' | 'streak' | 'mastery';
}

export interface StudentBadge {
  id: string;
  student_id: string;
  badge_id: string;
  badge?: Badge;
  earned_at: string;
}

export interface Team {
  id: string;
  team_name: string;
  classroom_id: string;
  color: string;
  icon: string;
  total_xp: number;
  members_count?: number;
}

export interface TeamMember {
  id: string;
  team_id: string;
  student_id: string;
  student?: User;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'achievement' | 'quest' | 'classroom' | 'system';
  read_status: boolean;
  created_at: string;
}

export interface AIQuestGenerationParams {
  subject: string;
  topic: string;
  gradeLevel: string;
  questionCount: number;
  difficulty: DifficultyLevel;
  gameType: GameType;
  questionStyle: QuestionStyle;
}

export interface AIExplanationRequest {
  question: string;
  options: string[];
  userAnswer?: string;
  correctAnswer?: string;
  topic: string;
  subject: string;
}

export interface LearningAnalytics {
  totalStudents: number;
  totalClassrooms: number;
  totalGames: number;
  totalAttempts: number;
  averageScorePercentage: number;
  missionCompletionRate: number;
  topicMastery: {
    topic: string;
    subject: string;
    accuracyPercentage: number;
    attemptsCount: number;
    status: 'mastered' | 'needs_practice' | 'struggling';
  }[];
  frequentMistakes: {
    questionText: string;
    topic: string;
    wrongChoiceRatio: number;
    commonWrongAnswer: string;
    explanationTip: string;
  }[];
  weeklyActivity: {
    day: string;
    activeStudents: number;
    xpEarned: number;
  }[];
  studentPerformances: {
    studentId: string;
    displayName: string;
    avatar: string;
    xp: number;
    level: number;
    attemptsCount: number;
    avgScore: number;
    attendanceRate: number;
  }[];
  aiPedagogicalAdvice?: {
    strengths: string[];
    priorityReviews: string[];
    suggestedGameFocus: string;
    encouragementMessage: string;
  };
}
