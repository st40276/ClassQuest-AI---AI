import { 
  User, Classroom, ClassroomMember, Game, Question, GameAttempt, 
  Mission, MissionProgress, Badge, StudentBadge, Team, TeamMember, 
  Notification, StudentLevelTitle, Kingdom, PointTransaction, 
  ShopItem, InventoryItem, KingdomDecoration, KingdomTier
} from '../src/types';

export function getLevelAndTitle(xp: number): { level: number; title: StudentLevelTitle; nextLevelXp: number; prevLevelXp: number } {
  if (xp >= 3501) {
    return { level: 6, title: 'Legend (ตำนานแห่งเควสต์)', nextLevelXp: 5000, prevLevelXp: 3500 };
  } else if (xp >= 2001) {
    return { level: 5, title: 'Master (ปรมาจารย์)', nextLevelXp: 3500, prevLevelXp: 2000 };
  } else if (xp >= 1001) {
    return { level: 4, title: 'Scholar (ผู้คงแก่เรียน)', nextLevelXp: 2000, prevLevelXp: 1000 };
  } else if (xp >= 501) {
    return { level: 3, title: 'Adventurer (นักผจญภัย)', nextLevelXp: 1000, prevLevelXp: 500 };
  } else if (xp >= 201) {
    return { level: 2, title: 'Explorer (นักสำรวจ)', nextLevelXp: 500, prevLevelXp: 200 };
  } else {
    return { level: 1, title: 'Beginner (ผู้เริ่มต้น)', nextLevelXp: 200, prevLevelXp: 0 };
  }
}

// In-Memory persistent data store initialized with rich Thai high school scenario + Kingdom Adventure
class DatabaseStore {
  users: User[] = [
    {
      id: 'u-teacher-1',
      username: 'kru.wiphada',
      display_name: 'ครูวิภาดา พรสวรรค์',
      role: 'teacher',
      avatar: '🧙‍♀️',
      avatar_class: 'จอมมหาเวทผู้ชี้นำ (Grand Mentor)',
      xp: 12500,
      points: 2500,
      level: 10,
      level_title: 'Legend (ตำนานแห่งเควสต์)',
      school: 'โรงเรียนสาธิตวิทยาคมราชพฤกษ์',
      grade: 'ครูผู้สอน ม.ต้น & ม.ปลาย',
      daily_streak: 24,
      created_at: '2026-01-10T08:00:00Z',
    },
    {
      id: 'u-student-1',
      username: 'panupong',
      display_name: 'ภานุพงศ์ ใจกล้า',
      role: 'student',
      avatar: '⚔️',
      avatar_class: 'อัศวินดาบมังกร (Dragon Knight)',
      xp: 820,
      points: 380,
      level: 3,
      level_title: 'Adventurer (นักผจญภัย)',
      school: 'โรงเรียนสาธิตวิทยาคมราชพฤกษ์',
      grade: 'มัธยมศึกษาปีที่ 3/1',
      daily_streak: 5,
      created_at: '2026-02-01T08:00:00Z',
    },
    {
      id: 'u-student-2',
      username: 'kanda',
      display_name: 'กานดา สายลมพฤกษ์',
      role: 'student',
      avatar: '🔮',
      avatar_class: 'นักปราชญ์เวทมนตร์ (Mystic Mage)',
      xp: 1680,
      points: 620,
      level: 4,
      level_title: 'Scholar (ผู้คงแก่เรียน)',
      school: 'โรงเรียนสาธิตวิทยาคมราชพฤกษ์',
      grade: 'มัธยมศึกษาปีที่ 3/1',
      daily_streak: 8,
      created_at: '2026-02-01T08:30:00Z',
    },
    {
      id: 'u-student-3',
      username: 'teepakorn',
      display_name: 'ธีปกร รัตนชัย',
      role: 'student',
      avatar: '🏹',
      avatar_class: 'พรานเงาพิทักษ์ (Shadow Ranger)',
      xp: 430,
      points: 210,
      level: 2,
      level_title: 'Explorer (นักสำรวจ)',
      school: 'โรงเรียนสาธิตวิทยาคมราชพฤกษ์',
      grade: 'มัธยมศึกษาปีที่ 3/1',
      daily_streak: 3,
      created_at: '2026-02-03T09:00:00Z',
    },
    {
      id: 'u-student-4',
      username: 'nichapa',
      display_name: 'ณิชาภา แสงทอง',
      role: 'student',
      avatar: '✨',
      avatar_class: 'ผู้เยียวยาประกายดาว (Radiant Cleric)',
      xp: 2450,
      points: 890,
      level: 5,
      level_title: 'Master (ปรมาจารย์)',
      school: 'โรงเรียนสาธิตวิทยาคมราชพฤกษ์',
      grade: 'มัธยมศึกษาปีที่ 3/1',
      daily_streak: 14,
      created_at: '2026-01-15T10:00:00Z',
    }
  ];

  classrooms: Classroom[] = [
    {
      id: 'c-1',
      classroom_name: 'ม.3/1 วิทยาศาสตร์ผจญภัย (Science Explorer)',
      subject: 'วิทยาศาสตร์',
      grade_level: 'ม.3',
      teacher_id: 'u-teacher-1',
      teacher_name: 'ครูวิภาดา พรสวรรค์',
      join_code: 'SCI-301',
      banner_color: 'from-sky-500 to-indigo-600',
      created_at: '2026-02-01T08:00:00Z',
    },
    {
      id: 'c-2',
      classroom_name: 'ม.2/4 ปริศนาคณิตศาสตร์พีทาโกรัส (Math Quest)',
      subject: 'คณิตศาสตร์',
      grade_level: 'ม.2',
      teacher_id: 'u-teacher-1',
      teacher_name: 'ครูวิภาดา พรสวรรค์',
      join_code: 'MATH-204',
      banner_color: 'from-amber-400 to-orange-500',
      created_at: '2026-02-05T09:00:00Z',
    },
    {
      id: 'c-3',
      classroom_name: 'ม.4/2 ล่าสมบัติไวยากรณ์สากล (English Quest)',
      subject: 'ภาษาอังกฤษ',
      grade_level: 'ม.4',
      teacher_id: 'u-teacher-1',
      teacher_name: 'ครูวิภาดา พรสวรรค์',
      join_code: 'ENG-402',
      banner_color: 'from-emerald-400 to-teal-600',
      created_at: '2026-02-10T10:00:00Z',
    }
  ];

  classroomMembers: ClassroomMember[] = [
    { id: 'cm-1', classroom_id: 'c-1', student_id: 'u-student-1', joined_at: '2026-02-01T08:15:00Z' },
    { id: 'cm-2', classroom_id: 'c-1', student_id: 'u-student-2', joined_at: '2026-02-01T08:35:00Z' },
    { id: 'cm-3', classroom_id: 'c-1', student_id: 'u-student-3', joined_at: '2026-02-03T09:10:00Z' },
    { id: 'cm-4', classroom_id: 'c-1', student_id: 'u-student-4', joined_at: '2026-02-01T09:00:00Z' },
    { id: 'cm-5', classroom_id: 'c-2', student_id: 'u-student-1', joined_at: '2026-02-05T09:30:00Z' },
    { id: 'cm-6', classroom_id: 'c-2', student_id: 'u-student-3', joined_at: '2026-02-05T09:35:00Z' }
  ];

  badges: Badge[] = [
    {
      id: 'b-1',
      badge_name: 'First Quest',
      name_th: 'ภารกิจแรกสู่เส้นทาง',
      description: 'ทำภารกิจหรือเล่นเกมสำเร็จเป็นครั้งแรกใน ClassQuest AI',
      condition: 'เล่นเกมหรือทำภารกิจสำเร็จอย่างน้อย 1 ครั้ง',
      icon: '🛡️',
      color: 'border-sky-300 bg-sky-50 text-sky-700',
      category: 'quest'
    },
    {
      id: 'b-2',
      badge_name: 'Quiz Master',
      name_th: 'เซียนควิซยอดอัจฉริยะ',
      description: 'ตอบคำถามใน Quiz Battle ถูกต้องรวมกันมากกว่า 15 ข้อ',
      condition: 'สะสมคำตอบถูกต้อง 15 ข้อขึ้นไป',
      icon: '⚡',
      color: 'border-amber-300 bg-amber-50 text-amber-700',
      category: 'quiz'
    },
    {
      id: 'b-3',
      badge_name: 'Team Player',
      name_th: 'พลังแห่งทีมผจญภัย',
      description: 'เข้าร่วมแข่งขันในโหมด Team Battle และช่วยทีมเก็บแต้ม',
      condition: 'ลงแข่งขันใน Team Battle สำเร็จอย่างน้อย 1 เกม',
      icon: '🤝',
      color: 'border-emerald-300 bg-emerald-50 text-emerald-700',
      category: 'team'
    },
    {
      id: 'b-4',
      badge_name: 'Streak Hero',
      name_th: 'ยอดนักสู้ต่อเนื่อง',
      description: 'เข้าทำภารกิจหรือแบบทดสอบติดต่อกันครบ 5 วัน',
      condition: 'มี Streak ต่อเนื่อง 5 วันขึ้นไป',
      icon: '🔥',
      color: 'border-orange-300 bg-orange-50 text-orange-700',
      category: 'streak'
    },
    {
      id: 'b-5',
      badge_name: 'Knowledge Explorer',
      name_th: 'ผู้แสวงหาปัญญา',
      description: 'เข้าร่วมเรียนรู้และทำเควสต์ครบ 3 วิชาที่แตกต่างกัน',
      condition: 'ผ่านเกมในวิชาวิทยาศาสตร์ คณิตศาสตร์ และภาษาอังกฤษ',
      icon: '📜',
      color: 'border-teal-300 bg-teal-50 text-teal-700',
      category: 'mastery'
    },
    {
      id: 'b-6',
      badge_name: 'Perfect Score',
      name_th: 'สมบูรณ์แบบไร้ที่ติ',
      description: 'ทำคะแนนเต็ม 100% ในเกม Quiz Battle หรือ Challenge',
      condition: 'ตอบถูกทุกข้อในการเล่นเกม 1 รอบเต็ม',
      icon: '👑',
      color: 'border-yellow-300 bg-yellow-50 text-yellow-700',
      category: 'quiz'
    }
  ];

  studentBadges: StudentBadge[] = [
    { id: 'sb-1', student_id: 'u-student-1', badge_id: 'b-1', earned_at: '2026-02-02T10:00:00Z' },
    { id: 'sb-2', student_id: 'u-student-1', badge_id: 'b-3', earned_at: '2026-02-04T14:30:00Z' },
    { id: 'sb-3', student_id: 'u-student-1', badge_id: 'b-4', earned_at: '2026-02-06T16:00:00Z' },
    { id: 'sb-4', student_id: 'u-student-2', badge_id: 'b-1', earned_at: '2026-02-01T11:00:00Z' },
    { id: 'sb-5', student_id: 'u-student-2', badge_id: 'b-2', earned_at: '2026-02-05T12:00:00Z' },
    { id: 'sb-6', student_id: 'u-student-2', badge_id: 'b-6', earned_at: '2026-02-05T12:00:00Z' },
    { id: 'sb-7', student_id: 'u-student-4', badge_id: 'b-1', earned_at: '2026-01-20T09:00:00Z' },
    { id: 'sb-8', student_id: 'u-student-4', badge_id: 'b-2', earned_at: '2026-01-25T15:00:00Z' },
    { id: 'sb-9', student_id: 'u-student-4', badge_id: 'b-4', earned_at: '2026-02-02T10:00:00Z' },
    { id: 'sb-10', student_id: 'u-student-4', badge_id: 'b-6', earned_at: '2026-02-03T11:20:00Z' },
  ];

  teams: Team[] = [
    {
      id: 't-1',
      team_name: 'ทีมมังกรอัคคี (Flame Dragons)',
      classroom_id: 'c-1',
      color: 'from-orange-500 to-amber-500',
      icon: '🐉',
      total_xp: 3270,
    },
    {
      id: 't-2',
      team_name: 'ทีมฟีนิกซ์สายฟ้า (Thunder Phoenix)',
      classroom_id: 'c-1',
      color: 'from-amber-400 to-yellow-400',
      icon: '🦅',
      total_xp: 4130,
    },
    {
      id: 't-3',
      team_name: 'ทีมโกเลมศิลา (Titan Golems)',
      classroom_id: 'c-1',
      color: 'from-emerald-500 to-teal-500',
      icon: '🗿',
      total_xp: 2890,
    }
  ];

  teamMembers: TeamMember[] = [
    { id: 'tm-1', team_id: 't-1', student_id: 'u-student-1' },
    { id: 'tm-2', team_id: 't-2', student_id: 'u-student-2' },
    { id: 'tm-3', team_id: 't-1', student_id: 'u-student-3' },
    { id: 'tm-4', team_id: 't-2', student_id: 'u-student-4' },
  ];

  games: Game[] = [
    {
      id: 'g-1',
      title: 'ศึกล่าคลอโรพลาสต์: กระบวนการสังเคราะห์ด้วยแสง',
      subject: 'วิทยาศาสตร์',
      topic: 'การสังเคราะห์ด้วยแสงและการลำเลียงสารในพืช',
      difficulty: 'medium',
      game_type: 'quiz_battle',
      teacher_id: 'u-teacher-1',
      classroom_id: 'c-1',
      classroom_name: 'ม.3/1 วิทยาศาสตร์ผจญภัย',
      status: 'published',
      reward_xp: 150,
      time_limit: 30, // seconds per question
      created_at: '2026-02-02T10:00:00Z'
    },
    {
      id: 'g-2',
      title: 'ศึกประลองปัญญากิลด์: สามเหลี่ยมมุมฉากและพีทาโกรัส',
      subject: 'คณิตศาสตร์',
      topic: 'ทฤษฎีบทพีทาโกรัสและสมบัติรูปสามเหลี่ยม',
      difficulty: 'medium',
      game_type: 'team_battle',
      teacher_id: 'u-teacher-1',
      classroom_id: 'c-1',
      classroom_name: 'ม.3/1 วิทยาศาสตร์ผจญภัย',
      status: 'published',
      reward_xp: 220,
      time_limit: 45,
      created_at: '2026-02-03T11:00:00Z'
    },
    {
      id: 'g-3',
      title: 'ภารกิจลับ: ไขรหัส Tenses & Conditionals ในปราสาทเวทมนตร์',
      subject: 'ภาษาอังกฤษ',
      topic: 'Past Simple, Present Perfect & Passive Voice',
      difficulty: 'hard',
      game_type: 'mission_quest',
      teacher_id: 'u-teacher-1',
      classroom_id: 'c-1',
      classroom_name: 'ม.3/1 วิทยาศาสตร์ผจญภัย',
      status: 'published',
      reward_xp: 300,
      time_limit: 60,
      created_at: '2026-02-04T09:00:00Z'
    },
    {
      id: 'g-4',
      title: 'ภารกิจประจำวัน: สมดุลห่วงโซ่อาหารและสายใยอาหาร',
      subject: 'วิทยาศาสตร์',
      topic: 'ระบบนิเวศและพลังงานในสิ่งมีชีวิต',
      difficulty: 'easy',
      game_type: 'daily_challenge',
      teacher_id: 'u-teacher-1',
      classroom_id: 'c-1',
      classroom_name: 'ม.3/1 วิทยาศาสตร์ผจญภัย',
      status: 'published',
      reward_xp: 100,
      time_limit: 25,
      created_at: '2026-02-06T00:00:00Z'
    },
    {
      id: 'g-5',
      title: 'มหาศึกประจำสัปดาห์: ถอดรหัสศิลาจารึกสุโขทัยและการสถาปนาอาณาจักร',
      subject: 'สังคมศึกษาและประวัติศาสตร์',
      topic: 'ประวัติศาสตร์สุโขทัยและการปกครองแบบพ่อปกครองลูก',
      difficulty: 'hard',
      game_type: 'weekly_challenge',
      teacher_id: 'u-teacher-1',
      classroom_id: 'c-1',
      classroom_name: 'ม.3/1 วิทยาศาสตร์ผจญภัย',
      status: 'published',
      reward_xp: 450,
      time_limit: 40,
      created_at: '2026-02-01T00:00:00Z'
    }
  ];

  questions: Question[] = [
    {
      id: 'q-1-1',
      game_id: 'g-1',
      question: 'ในกระบวนการสังเคราะห์ด้วยแสงของพืช แก๊สใดเป็นวัตถุดิบสำคัญที่พืชดูดกลืนเข้ามาทางปากใบ?',
      options: [
        'แก๊สออกซิเจน (O₂)',
        'แก๊สคาร์บอนไดออกไซด์ (CO₂)',
        'แก๊สไนโตรเจน (N₂)',
        'แก๊สมีเทน (CH₄)'
      ],
      correct_answer: 1,
      explanation: 'พืชใช้แก๊สคาร์บอนไดออกไซด์ (CO₂) ร่วมกับน้ำ (H₂O) และพลังงานแสงอาทิตย์ในการสร้างน้ำตาลกลูโคส และปล่อยแก๊สออกซิเจน (O₂) ออกมา',
      difficulty: 'easy',
      points: 10,
      time_limit: 30
    },
    {
      id: 'q-1-2',
      game_id: 'g-1',
      question: 'สารสีชนิดใดที่ทำหน้าที่ดูดซับพลังงานแสงได้อย่างมีประสิทธิภาพมากที่สุดในคลอโรพลาสต์?',
      options: [
        'แคโรทีนอยด์ (Carotenoid)',
        'แอนโทไซยานิน (Anthocyanin)',
        'คลอโรฟิลล์ (Chlorophyll)',
        'แซนโทฟิลล์ (Xanthophyll)'
      ],
      correct_answer: 2,
      explanation: 'คลอโรฟิลล์เป็นรงควัตถุหลักสีเขียวที่อยู่ในเยื่อไทลาคอยด์ของคลอโรพลาสต์ ทำหน้าที่ดูดกลืนแสงสีน้ำเงินและแดงเพื่อใช้ในปฏิกิริยาแสง',
      difficulty: 'medium',
      points: 15,
      time_limit: 30
    },
    {
      id: 'q-1-3',
      game_id: 'g-1',
      question: 'ผลผลิตขั้นสุดท้ายของปฏิกิริยาการสังเคราะห์ด้วยแสงที่สะสมไว้ในเนื้อเยื่อพืชคือสารชนิดใด?',
      options: [
        'แป้ง (Starch)',
        'โปรตีน (Protein)',
        'ไขมัน (Lipid)',
        'กรดอะมิโน (Amino Acid)'
      ],
      correct_answer: 0,
      explanation: 'พืชจะสังเคราะห์น้ำตาลกลูโคสก่อน จากนั้นจะรวมตัวและเปลี่ยนรูปกลายเป็นแป้งเพื่อเก็บสะสมไว้ในส่วนต่างๆ ของพืช เช่น ใบ หัว หรือลำต้น',
      difficulty: 'medium',
      points: 15,
      time_limit: 30
    },
    {
      id: 'q-1-4',
      game_id: 'g-1',
      question: 'หากนำพืชไปไว้ในที่มืดสนิทเป็นเวลา 48 ชั่วโมง แล้วนำใบมาทดสอบด้วยสารละลายไอโอดีน ผลการทดลองจะเป็นอย่างไร?',
      options: [
        'สารละลายไอโอดีนเปลี่ยนเป็นสีน้ำเงินเข้ม',
        'สารละลายไอโอดีนยังคงเป็นสีน้ำตาลอมเหลือง ไม่เปลี่ยนสี',
        'ใบพืชกลายเป็นสีชมพูประกาย',
        'สารละลายไอโอดีนเกิดฟองแก๊สฟู่'
      ],
      correct_answer: 1,
      explanation: 'เมื่อพืชอยู่ในที่มืด ไม่สามารถสังเคราะห์ด้วยแสงได้ และแป้งสะสมเดิมถูกนำไปใช้จนหมด จึงไม่พบแป้งในใบ สารละลายไอโอดีนจึงคงสีน้ำตาลเดิม',
      difficulty: 'hard',
      points: 20,
      time_limit: 35
    },
    {
      id: 'q-2-1',
      game_id: 'g-2',
      question: 'รูปสามเหลี่ยมมุมฉากรูปหนึ่ง มีความยาวด้านประกอบมุมฉากเท่ากับ 3 เซนติเมตร และ 4 เซนติเมตร จงหาความยาวของด้านตรงข้ามมุมฉาก?',
      options: [
        '5 เซนติเมตร',
        '6 เซนติเมตร',
        '7 เซนติเมตร',
        '8 เซนติเมตร'
      ],
      correct_answer: 0,
      explanation: 'ตามทฤษฎีบทพีทาโกรัส c² = a² + b² = 3² + 4² = 9 + 16 = 25 ดังนั้น c = √25 = 5 เซนติเมตร',
      difficulty: 'easy',
      points: 10,
      time_limit: 30
    },
    {
      id: 'q-2-2',
      game_id: 'g-2',
      question: 'บันไดยาว 13 เมตร พาดอยู่กับกำแพงตึก โดยโคนบันไดอยู่ห่างจากกำแพง 5 เมตร ปลายบันไดด้านบนจะแตะกำแพงที่ความสูงกี่เมตร?',
      options: [
        '10 เมตร',
        '11 เมตร',
        '12 เมตร',
        '14 เมตร'
      ],
      correct_answer: 2,
      explanation: 'ความยาวบันไดคือด้านตรงข้ามมุมฉาก c = 13, ฐาน a = 5; หา b จาก b² = c² - a² = 13² - 5² = 169 - 25 = 144 -> b = 12 เมตร',
      difficulty: 'medium',
      points: 15,
      time_limit: 40
    },
    {
      id: 'q-2-3',
      game_id: 'g-2',
      question: 'ชุดตัวเลขใดต่อไปนี้ "ไม่ใช่" ความยาวด้านของรูปสามเหลี่ยมมุมฉาก?',
      options: [
        '5, 12, 13',
        '8, 15, 17',
        '7, 24, 25',
        '6, 9, 12'
      ],
      correct_answer: 3,
      explanation: 'สำหรับชุด (6, 9, 12): 6² + 9² = 36 + 81 = 117 แต่ 12² = 144 ซึ่งไม่เท่ากัน จึงไม่ใช่สามเหลี่ยมมุมฉาก',
      difficulty: 'hard',
      points: 20,
      time_limit: 45
    },
    {
      id: 'q-3-1',
      game_id: 'g-3',
      question: 'Choose the correct sentence in Present Perfect tense:',
      options: [
        'She has already finished her homework.',
        'She already finish her homework.',
        'She is finishing her homework yesterday.',
        'She was finished her homework.'
      ],
      correct_answer: 0,
      explanation: 'โครงสร้าง Present Perfect คือ Subject + has/have + V.3 ประธานเอกพจน์ She ใช้ has และตามด้วย V.3 (finished)',
      difficulty: 'medium',
      points: 15,
      time_limit: 30
    },
    {
      id: 'q-3-2',
      game_id: 'g-3',
      question: 'Transform to Passive Voice: "The brave adventurer defeated the dungeon monster."',
      options: [
        'The dungeon monster was defeated by the brave adventurer.',
        'The dungeon monster is defeating by the brave adventurer.',
        'The brave adventurer was defeated the monster.',
        'The dungeon monster has defeated the brave adventurer.'
      ],
      correct_answer: 0,
      explanation: 'ประโยคเดิมเป็น Past Simple เมื่อเปลี่ยนเป็น Passive Voice จะใช้ was/were + V.3 -> was defeated by...',
      difficulty: 'medium',
      points: 20,
      time_limit: 35
    },
    {
      id: 'q-4-1',
      game_id: 'g-4',
      question: 'ในสายใยอาหาร สิ่งมีชีวิตประเภทใดทำหน้าที่เปลี่ยนสารอินทรีย์ของซากพืชซากสัตว์ให้กลับเป็นแร่ธาตุคืนสู่ดิน?',
      options: [
        'ผู้บริโภคอันดับที่หนึ่ง',
        'ผู้ผลิต (Producers)',
        'ผู้ย่อยสลายสารอินทรีย์ (Decomposers)',
        'ผู้ล่าสูงสุด (Apex Predators)'
      ],
      correct_answer: 2,
      explanation: 'ผู้ย่อยสลาย เช่น แบคทีเรียและเห็ดรา ย่อยสลายซากสิ่งมีชีวิตให้เป็นธาตุอาหารกลับคืนสู่วัฏจักรธรรมชาติ',
      difficulty: 'easy',
      points: 25,
      time_limit: 25
    },
    {
      id: 'q-5-1',
      game_id: 'g-5',
      question: 'ลักษณะการปกครองในสมัยสุโขทัยตอนต้นมักได้รับการอธิบายว่ามีลักษณะอย่างไร?',
      options: [
        'สมบูรณาญาสิทธิราชย์แบบเข้มงวด',
        'พ่อปกครองลูก (ปิตุราชา)',
        'เทวราชาตามคติพราหมณ์-ฮินดู',
        'ประชาธิปไตยแบบรัฐสภา'
      ],
      correct_answer: 1,
      explanation: 'สมัยสุโขทัยตอนต้น กษัตริย์ทรงมีความใกล้ชิดกับราษฎร เปรียบเสมือนพ่อดูแลลูก ดั่งปรากฏในศิลาจารึกหลักที่ 1',
      difficulty: 'medium',
      points: 30,
      time_limit: 35
    }
  ];

  gameAttempts: GameAttempt[] = [
    {
      id: 'ga-1',
      student_id: 'u-student-1',
      student_name: 'ภานุพงศ์ ใจกล้า',
      game_id: 'g-1',
      game_title: 'ศึกล่าคลอโรพลาสต์: กระบวนการสังเคราะห์ด้วยแสง',
      score: 50,
      max_score: 60,
      xp_earned: 130,
      answers: [
        { question_id: 'q-1-1', selected_option: 1, is_correct: true, time_spent_seconds: 12 },
        { question_id: 'q-1-2', selected_option: 2, is_correct: true, time_spent_seconds: 18 },
        { question_id: 'q-1-3', selected_option: 0, is_correct: true, time_spent_seconds: 14 },
        { question_id: 'q-1-4', selected_option: 0, is_correct: false, time_spent_seconds: 22 }
      ],
      completed_at: '2026-02-04T15:20:00Z'
    },
    {
      id: 'ga-2',
      student_id: 'u-student-2',
      student_name: 'กานดา สายลมพฤกษ์',
      game_id: 'g-1',
      game_title: 'ศึกล่าคลอโรพลาสต์: กระบวนการสังเคราะห์ด้วยแสง',
      score: 60,
      max_score: 60,
      xp_earned: 150,
      answers: [
        { question_id: 'q-1-1', selected_option: 1, is_correct: true, time_spent_seconds: 8 },
        { question_id: 'q-1-2', selected_option: 2, is_correct: true, time_spent_seconds: 11 },
        { question_id: 'q-1-3', selected_option: 0, is_correct: true, time_spent_seconds: 9 },
        { question_id: 'q-1-4', selected_option: 1, is_correct: true, time_spent_seconds: 15 }
      ],
      completed_at: '2026-02-05T12:00:00Z'
    },
    {
      id: 'ga-3',
      student_id: 'u-student-3',
      student_name: 'ธีปกร รัตนชัย',
      game_id: 'g-1',
      game_title: 'ศึกล่าคลอโรพลาสต์: กระบวนการสังเคราะห์ด้วยแสง',
      score: 25,
      max_score: 60,
      xp_earned: 80,
      answers: [
        { question_id: 'q-1-1', selected_option: 1, is_correct: true, time_spent_seconds: 20 },
        { question_id: 'q-1-2', selected_option: 0, is_correct: false, time_spent_seconds: 25 },
        { question_id: 'q-1-3', selected_option: 1, is_correct: false, time_spent_seconds: 24 },
        { question_id: 'q-1-4', selected_option: 0, is_correct: false, time_spent_seconds: 30 }
      ],
      completed_at: '2026-02-04T16:10:00Z'
    },
    {
      id: 'ga-4',
      student_id: 'u-student-4',
      student_name: 'ณิชาภา แสงทอง',
      game_id: 'g-1',
      game_title: 'ศึกล่าคลอโรพลาสต์: กระบวนการสังเคราะห์ด้วยแสง',
      score: 60,
      max_score: 60,
      xp_earned: 150,
      answers: [
        { question_id: 'q-1-1', selected_option: 1, is_correct: true, time_spent_seconds: 6 },
        { question_id: 'q-1-2', selected_option: 2, is_correct: true, time_spent_seconds: 10 },
        { question_id: 'q-1-3', selected_option: 0, is_correct: true, time_spent_seconds: 7 },
        { question_id: 'q-1-4', selected_option: 1, is_correct: true, time_spent_seconds: 12 }
      ],
      completed_at: '2026-02-03T11:20:00Z'
    }
  ];

  missions: Mission[] = [
    {
      id: 'm-1',
      title: 'ก้าวแรกสู่วิถีผู้กล้าแห่งการเรียนรู้',
      description: 'เล่นและพิชิตเกมแบบทดสอบใดก็ได้ 1 เกมให้จบสมบูรณ์',
      mission_type: 'daily',
      reward_xp: 80,
      requirement_type: 'play_games',
      requirement_target: 1,
      classroom_id: 'c-1',
      start_date: '2026-02-01T00:00:00Z',
      end_date: '2026-02-28T23:59:59Z'
    },
    {
      id: 'm-2',
      title: 'ยอดฝีมือปัญญาเลิศ: ทำคะแนนเกิน 80%',
      description: 'ทำคะแนนแบบทดสอบใน Quiz Battle หรือ Team Battle ให้ได้ตั้งแต่ 80% ขึ้นไป',
      mission_type: 'quest',
      reward_xp: 150,
      requirement_type: 'perfect_score',
      requirement_target: 1,
      classroom_id: 'c-1',
      start_date: '2026-02-01T00:00:00Z',
      end_date: '2026-02-28T23:59:59Z'
    },
    {
      id: 'm-3',
      title: 'ไฟแห่งความเพียร: ทำเควสต์ต่อเนื่อง 5 วัน',
      description: 'เข้าสู่ ClassQuest AI และทำกิจกรรมการเรียนรู้อย่างต่อเนื่องไม่ขาดสาย',
      mission_type: 'weekly',
      reward_xp: 250,
      requirement_type: 'daily_streak',
      requirement_target: 5,
      classroom_id: 'c-1',
      start_date: '2026-02-01T00:00:00Z',
      end_date: '2026-02-28T23:59:59Z'
    },
    {
      id: 'm-4',
      title: 'พันธมิตรผู้กล้า: ช่วยเหลือกิลด์ในการประลองทีม',
      description: 'เข้าร่วมเล่นโหมด Team Battle เพื่อทำคะแนนรวมให้กับกิลด์ของตนเอง',
      mission_type: 'special',
      reward_xp: 200,
      requirement_type: 'team_assist',
      requirement_target: 1,
      classroom_id: 'c-1',
      start_date: '2026-02-01T00:00:00Z',
      end_date: '2026-02-28T23:59:59Z'
    }
  ];

  missionProgress: MissionProgress[] = [
    { id: 'mp-1', student_id: 'u-student-1', mission_id: 'm-1', current_count: 1, status: 'completed', completed_at: '2026-02-04T15:20:00Z' },
    { id: 'mp-2', student_id: 'u-student-1', mission_id: 'm-2', current_count: 1, status: 'completed', completed_at: '2026-02-04T15:20:00Z' },
    { id: 'mp-3', student_id: 'u-student-1', mission_id: 'm-3', current_count: 5, status: 'completed', completed_at: '2026-02-06T16:00:00Z' },
    { id: 'mp-4', student_id: 'u-student-1', mission_id: 'm-4', current_count: 0, status: 'in_progress' },
    { id: 'mp-5', student_id: 'u-student-2', mission_id: 'm-1', current_count: 1, status: 'completed', completed_at: '2026-02-05T12:00:00Z' },
    { id: 'mp-6', student_id: 'u-student-2', mission_id: 'm-2', current_count: 1, status: 'completed', completed_at: '2026-02-05T12:00:00Z' }
  ];

  notifications: Notification[] = [
    {
      id: 'n-1',
      user_id: 'u-student-1',
      title: 'ยินดีด้วย! ปลดล็อกตราสัญลักษณ์ใหม่',
      message: 'คุณได้รับเหรียญรางวัล "Streak Hero ยอดนักสู้ต่อเนื่อง" จากการเข้าเรียน 5 วันรวด!',
      type: 'achievement',
      read_status: false,
      created_at: '2026-02-06T16:00:00Z'
    },
    {
      id: 'n-2',
      user_id: 'u-student-1',
      title: 'เควสต์ใหม่เปิดให้ท้าทายแล้ว!',
      message: 'ครูวิภาดาได้มอบหมายเกม "ศึกประลองปัญญากิลด์: สามเหลี่ยมมุมฉากและพีทาโกรัส"',
      type: 'classroom',
      read_status: false,
      created_at: '2026-02-05T09:30:00Z'
    },
    {
      id: 'n-3',
      user_id: 'u-teacher-1',
      title: 'นักเรียนส่งผลงานใหม่',
      message: 'นักเรียน 4 คนได้ทำเกม "การสังเคราะห์ด้วยแสง" สำเร็จแล้ว คะแนนเฉลี่ย 81.3%',
      type: 'classroom',
      read_status: false,
      created_at: '2026-02-05T14:00:00Z'
    }
  ];

  // -------------------------------------------------------------
  // Kingdom Adventure & Points Economy Store
  // -------------------------------------------------------------

  shopItems: ShopItem[] = [
    // Castles
    {
      id: 'c-tiny-1',
      item_name: 'ปราสาทไม้แห่งผู้เริ่มต้น',
      item_type: 'starter_keep',
      item_category: 'castle',
      price_points: 0,
      rarity: 'common',
      image_url: '🏰',
      unlock_level: 1,
      description: 'ปราสาทหลังแรกของผู้กล้า อบอุ่น แข็งแรง และพร้อมสำหรับการเติบโต',
      dimensions: { width: 2, height: 2 }
    },
    {
      id: 'c-pastel-1',
      item_name: 'ปราสาทพาสเทลสายรุ้ง (Pastel Dream Keep)',
      item_type: 'pastel_palace',
      item_category: 'castle',
      price_points: 150,
      rarity: 'rare',
      image_url: '🏯',
      unlock_level: 2,
      description: 'ปราสาทโทนสีพาสเทลสดใส ประดับด้วยหอคอยแก้วสะท้อนแสงแดด',
      dimensions: { width: 2, height: 2 }
    },
    {
      id: 'c-royal-1',
      item_name: 'ปราสาทราชวงศ์สุริยัน (Royal Citadel)',
      item_type: 'royal_citadel',
      item_category: 'castle',
      price_points: 300,
      rarity: 'epic',
      image_url: '🏛️',
      unlock_level: 3,
      description: 'ปราสาทโอ่อ่าหินอ่อนสีขาว ประดับธงเกียรติยศและยอดโดมทองคำ',
      dimensions: { width: 3, height: 2 }
    },
    {
      id: 'c-fantasy-1',
      item_name: 'มหาปราสาทมนตราลอยฟ้า (Sky Fantasy Palace)',
      item_type: 'fantasy_palace',
      item_category: 'castle',
      price_points: 500,
      rarity: 'epic',
      image_url: '🌌',
      unlock_level: 4,
      description: 'ปราสาทเวทมนตร์ลอยน้ำ รายล้อมด้วยวงแหวนพลังงานสีคราม',
      dimensions: { width: 3, height: 3 }
    },
    {
      id: 'c-legendary-1',
      item_name: 'พระราชวังมังกรนิรันดร์ (Eternal Dragon Sanctuary)',
      item_type: 'legendary_sanctuary',
      item_category: 'castle',
      price_points: 850,
      rarity: 'legendary',
      image_url: '👑',
      unlock_level: 5,
      description: 'ปราสาทระดับตำนานแห่ง ClassQuest AI ปล่อยละอองแสงทองคำตลอดเวลา',
      dimensions: { width: 3, height: 3 }
    },

    // Decorations
    {
      id: 'dec-tree-cherry',
      item_name: 'ต้นซากุระพาสเทลบานสะพรั่ง',
      item_type: 'cherry_tree',
      item_category: 'decoration',
      price_points: 35,
      rarity: 'common',
      image_url: '🌸',
      unlock_level: 1,
      description: 'ต้นไม้ดอกสีชมพูละมุน ปลิวไหวตามสายลมอย่างอ่อนโยน'
    },
    {
      id: 'dec-fountain-crystal',
      item_name: 'น้ำพุคริสตัลระยิบระยับ',
      item_type: 'fountain',
      item_category: 'decoration',
      price_points: 75,
      rarity: 'rare',
      image_url: '⛲',
      unlock_level: 1,
      description: 'น้ำพุใสสะอาด พ่นละอองน้ำต้องแสงอาทิตย์เกิดเป็นรุ้งเล็กๆ'
    },
    {
      id: 'dec-flower-rainbow',
      item_name: 'แปลงดอกไม้หลากสี',
      item_type: 'flower_bed',
      item_category: 'decoration',
      price_points: 25,
      rarity: 'common',
      image_url: '🌷',
      unlock_level: 1,
      description: 'ดอกไม้เมืองหนาวหลากสีสัน ส่งกลิ่นหอมชื่นใจ'
    },
    {
      id: 'dec-magic-tower',
      item_name: 'หอคอยดาราศาสตร์เวทมนตร์',
      item_type: 'astral_tower',
      item_category: 'decoration',
      price_points: 120,
      rarity: 'epic',
      image_url: '🗼',
      unlock_level: 2,
      description: 'หอสังเกตการณ์ดวงดาว มีลูกแก้วเวทหมุนวนอยู่บนยอด'
    },
    {
      id: 'dec-cottage',
      item_name: 'บ้านเห็ดแฟนตาซีอบอุ่น',
      item_type: 'mushroom_cottage',
      item_category: 'decoration',
      price_points: 90,
      rarity: 'common',
      image_url: '🍄',
      unlock_level: 2,
      description: 'กระท่อมน้อยของชาวบ้านอาณาจักร มีควันลอยออกจากปล่องไฟ'
    },
    {
      id: 'dec-dragon-statue',
      item_name: 'รูปปั้นมังกรศิลาพิทักษ์',
      item_type: 'dragon_monument',
      item_category: 'decoration',
      price_points: 110,
      rarity: 'rare',
      image_url: '🗿',
      unlock_level: 2,
      description: 'รูปปั้นหินสลักรูปมังกรผู้กล้า ช่วยปกป้องอาณาจักรให้สงบสุข'
    },
    {
      id: 'dec-bench-wooden',
      item_name: 'ม้านั่งไม้ใต้ร่มเงา',
      item_type: 'park_bench',
      item_category: 'decoration',
      price_points: 20,
      rarity: 'common',
      image_url: '🪑',
      unlock_level: 1,
      description: 'ม้านั่งไม้สนสำหรับนั่งพักผ่อนชมวิวอาณาจักร'
    },
    {
      id: 'dec-lantern-gem',
      item_name: 'โคมไฟคริสตัลส่องทาง',
      item_type: 'crystal_lamp',
      item_category: 'decoration',
      price_points: 30,
      rarity: 'common',
      image_url: '🏮',
      unlock_level: 1,
      description: 'โคมไฟส่องแสงสีส้มอุ่นยามค่ำคืน'
    },
    {
      id: 'dec-stone-bridge',
      item_name: 'สะพานหินข้ามลำธาร',
      item_type: 'stone_bridge',
      item_category: 'decoration',
      price_points: 80,
      rarity: 'rare',
      image_url: '🌉',
      unlock_level: 2,
      description: 'สะพานหินทรงโค้งเชื่อมพื้นที่สวนและใจกลางเมือง'
    },
    {
      id: 'dec-pet-griffin',
      item_name: 'ลูกกริฟฟอนสัตว์เลี้ยงแฟนตาซี',
      item_type: 'baby_griffin',
      item_category: 'decoration',
      price_points: 180,
      rarity: 'epic',
      image_url: '🦅',
      unlock_level: 3,
      description: 'สัตว์เลี้ยงแสนรู้ ขนสีทอง กระพือปีกบินเล่นรอบสวน'
    },
    {
      id: 'dec-pet-unicorn',
      item_name: 'ยูนิคอร์นประกายแสงดาว',
      item_type: 'star_unicorn',
      item_category: 'decoration',
      price_points: 260,
      rarity: 'legendary',
      image_url: '🦄',
      unlock_level: 4,
      description: 'สัตว์ในตำนาน มีเขาสีรุ้งและแสงออโรราส่องประกาย'
    },
    {
      id: 'dec-flag-academy',
      item_name: 'ธงเกียรติยศ ClassQuest',
      item_type: 'academy_flag',
      item_category: 'decoration',
      price_points: 25,
      rarity: 'common',
      image_url: '🚩',
      unlock_level: 1,
      description: 'ธงสัญลักษณ์ห้องเรียนผจญภัย โบกสะบัดอย่างสง่างาม'
    },

    // Landscapes
    {
      id: 'land-grass-lush',
      item_name: 'ทุ่งหญ้ามรกตสดใส',
      item_type: 'meadow_terrain',
      item_category: 'landscape',
      price_points: 0,
      rarity: 'common',
      image_url: '🌱',
      unlock_level: 1,
      description: 'ผืนดินทุ่งหญ้าเขียวขจี อุดมสมบูรณ์และนุ่มเท้า'
    },
    {
      id: 'land-lake-crystal',
      item_name: 'ทะเลสาบคริสตัลใส',
      item_type: 'lake_terrain',
      item_category: 'landscape',
      price_points: 80,
      rarity: 'rare',
      image_url: '🌊',
      unlock_level: 2,
      description: 'สระน้ำสีฟ้าใส มีปลาคาร์ปแฟนตาซีว่ายวนเวียน'
    },
    {
      id: 'land-mystic-woods',
      item_name: 'ป่าเวทมนตร์เรืองแสง',
      item_type: 'forest_terrain',
      item_category: 'landscape',
      price_points: 100,
      rarity: 'rare',
      image_url: '🌲',
      unlock_level: 2,
      description: 'พื้นป่าที่เต็มไปด้วยหิ่งห้อยและเห็ดเรืองแสง'
    },
    {
      id: 'land-royal-tiles',
      item_name: 'ทางเดินหินอ่อนราชวงศ์',
      item_type: 'marble_path',
      item_category: 'landscape',
      price_points: 60,
      rarity: 'common',
      image_url: '🧱',
      unlock_level: 1,
      description: 'แผ่นหินอ่อนปูทางเดินเชื่อมสู่ปราสาทใหญ่'
    },
    {
      id: 'land-snow-frost',
      item_name: 'ดินแดนเหมันต์ประกายหิมะ',
      item_type: 'snow_terrain',
      item_category: 'landscape',
      price_points: 130,
      rarity: 'epic',
      image_url: '❄️',
      unlock_level: 3,
      description: 'ลานหิมะขาวบริสุทธิ์ มีเกล็ดหิมะโปรยปรายอย่างแผ่วเบา'
    },
    {
      id: 'land-magic-glow',
      item_name: 'แดนออโรรามนตราเรืองรอง',
      item_type: 'aurora_terrain',
      item_category: 'landscape',
      price_points: 220,
      rarity: 'legendary',
      image_url: '✨',
      unlock_level: 4,
      description: 'ผืนดินประกายดาวที่มีอักขระเวทโบราณสลักอยู่'
    }
  ];

  kingdoms: Kingdom[] = [
    {
      id: 'k-student-1',
      student_id: 'u-student-1',
      kingdom_name: 'อาณาจักรมังกรอรุณรุ่ง (Dawn Dragon Realm)',
      kingdom_level: 2, // Growing Kingdom
      castle_id: 'c-pastel-1',
      layout_data: {
        terrain: 'grass',
        decorations: [
          { id: 'kd-1', kingdom_id: 'k-student-1', item_id: 'dec-tree-cherry', position_x: 2, position_y: 2, rotation: 0, scale: 1 },
          { id: 'kd-2', kingdom_id: 'k-student-1', item_id: 'dec-fountain-crystal', position_x: 5, position_y: 3, rotation: 0, scale: 1 },
          { id: 'kd-3', kingdom_id: 'k-student-1', item_id: 'dec-flower-rainbow', position_x: 3, position_y: 4, rotation: 0, scale: 1 },
          { id: 'kd-4', kingdom_id: 'k-student-1', item_id: 'dec-flag-academy', position_x: 7, position_y: 2, rotation: 0, scale: 1 },
          { id: 'kd-5', kingdom_id: 'k-student-1', item_id: 'dec-bench-wooden', position_x: 6, position_y: 4, rotation: 0, scale: 1 },
          { id: 'kd-6', kingdom_id: 'k-student-1', item_id: 'dec-cottage', position_x: 8, position_y: 3, rotation: 0, scale: 1 }
        ]
      },
      unlocked_areas: ['main', 'garden'],
      created_at: '2026-02-01T08:00:00Z',
      updated_at: '2026-02-06T12:00:00Z'
    },
    {
      id: 'k-student-2',
      student_id: 'u-student-2',
      kingdom_name: 'ดินแดนปราชญ์เวทมนตร์ (Mystic Mage Sanctum)',
      kingdom_level: 3, // Royal Kingdom
      castle_id: 'c-royal-1',
      layout_data: {
        terrain: 'magic',
        decorations: [
          { id: 'kd-20', kingdom_id: 'k-student-2', item_id: 'dec-magic-tower', position_x: 3, position_y: 2, rotation: 0, scale: 1 },
          { id: 'kd-21', kingdom_id: 'k-student-2', item_id: 'dec-fountain-crystal', position_x: 5, position_y: 3, rotation: 0, scale: 1 },
          { id: 'kd-22', kingdom_id: 'k-student-2', item_id: 'dec-pet-griffin', position_x: 7, position_y: 3, rotation: 0, scale: 1 }
        ]
      },
      unlocked_areas: ['main', 'garden', 'village'],
      created_at: '2026-02-01T08:30:00Z',
      updated_at: '2026-02-06T14:00:00Z'
    }
  ];

  inventory: InventoryItem[] = [
    { id: 'inv-1', student_id: 'u-student-1', item_id: 'c-tiny-1', quantity: 1, purchased_at: '2026-02-01T08:00:00Z' },
    { id: 'inv-2', student_id: 'u-student-1', item_id: 'c-pastel-1', quantity: 1, purchased_at: '2026-02-03T10:00:00Z' },
    { id: 'inv-3', student_id: 'u-student-1', item_id: 'dec-tree-cherry', quantity: 3, purchased_at: '2026-02-03T11:00:00Z' },
    { id: 'inv-4', student_id: 'u-student-1', item_id: 'dec-fountain-crystal', quantity: 1, purchased_at: '2026-02-04T12:00:00Z' },
    { id: 'inv-5', student_id: 'u-student-1', item_id: 'dec-flower-rainbow', quantity: 4, purchased_at: '2026-02-04T13:00:00Z' },
    { id: 'inv-6', student_id: 'u-student-1', item_id: 'dec-flag-academy', quantity: 2, purchased_at: '2026-02-02T10:00:00Z' },
    { id: 'inv-7', student_id: 'u-student-1', item_id: 'dec-bench-wooden', quantity: 2, purchased_at: '2026-02-04T14:00:00Z' },
    { id: 'inv-8', student_id: 'u-student-1', item_id: 'dec-cottage', quantity: 1, purchased_at: '2026-02-05T09:00:00Z' },
    { id: 'inv-9', student_id: 'u-student-1', item_id: 'land-grass-lush', quantity: 1, purchased_at: '2026-02-01T08:00:00Z' }
  ];

  pointTransactions: PointTransaction[] = [
    {
      id: 'pt-1',
      student_id: 'u-student-1',
      transaction_type: 'earned',
      amount: 100,
      source: 'ยินดีต้อนรับสู่ ClassQuest AI',
      created_at: '2026-02-01T08:00:00Z'
    },
    {
      id: 'pt-2',
      student_id: 'u-student-1',
      transaction_type: 'earned',
      amount: 50,
      source: 'พิชิตเกม: การสังเคราะห์ด้วยแสง',
      reference_id: 'g-1',
      created_at: '2026-02-04T15:20:00Z'
    },
    {
      id: 'pt-3',
      student_id: 'u-student-1',
      transaction_type: 'spent',
      amount: 150,
      source: 'ซื้อ ปราสาทพาสเทลสายรุ้ง (Pastel Dream Keep)',
      reference_id: 'c-pastel-1',
      created_at: '2026-02-03T10:00:00Z'
    },
    {
      id: 'pt-4',
      student_id: 'u-student-1',
      transaction_type: 'earned',
      amount: 80,
      source: 'ภารกิจประจำวัน: สมดุลห่วงโซ่อาหาร',
      reference_id: 'g-4',
      created_at: '2026-02-06T08:30:00Z'
    }
  ];

  // Helper methods
  getUser(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }

  getKingdom(studentId: string): Kingdom {
    let kingdom = this.kingdoms.find(k => k.student_id === studentId);
    if (!kingdom) {
      kingdom = {
        id: 'k-' + studentId,
        student_id: studentId,
        kingdom_name: 'อาณาจักรแห่งการเริ่มต้น',
        kingdom_level: 1,
        castle_id: 'c-tiny-1',
        layout_data: {
          terrain: 'grass',
          decorations: [
            { id: 'kd-init-1', kingdom_id: 'k-' + studentId, item_id: 'dec-tree-cherry', position_x: 3, position_y: 2, rotation: 0, scale: 1 },
            { id: 'kd-init-2', kingdom_id: 'k-' + studentId, item_id: 'dec-flower-rainbow', position_x: 6, position_y: 3, rotation: 0, scale: 1 }
          ]
        },
        unlocked_areas: ['main'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      this.kingdoms.push(kingdom);

      // Ensure starter castle is in inventory
      if (!this.inventory.some(i => i.student_id === studentId && i.item_id === 'c-tiny-1')) {
        this.inventory.push({
          id: 'inv-' + Date.now(),
          student_id: studentId,
          item_id: 'c-tiny-1',
          quantity: 1,
          purchased_at: new Date().toISOString()
        });
      }
    }
    return kingdom;
  }

  addXP(studentId: string, xpDelta: number): { user: User; leveledUp: boolean; oldLevel: number; newLevel: number } {
    const user = this.users.find(u => u.id === studentId);
    if (!user) throw new Error('User not found');

    const oldLevel = user.level;
    user.xp += xpDelta;
    const { level, title } = getLevelAndTitle(user.xp);
    user.level = level;
    user.level_title = title;
    const leveledUp = level > oldLevel;

    if (leveledUp) {
      this.notifications.unshift({
        id: 'n-' + Date.now(),
        user_id: studentId,
        title: `เลเวลอัป! คุณก้าวสู่เลเวล ${level}`,
        message: `ยินดีด้วย! คุณได้รับฉายาใหม่: ${title} และปลดล็อกสิทธิพิเศษใหม่ในร้านค้า`,
        type: 'achievement',
        read_status: false,
        created_at: new Date().toISOString()
      });
    }

    this.checkBadges(studentId);
    return { user, leveledUp, oldLevel, newLevel: level };
  }

  addPoints(studentId: string, amount: number, source: string, referenceId?: string): { user: User; points: number } {
    const user = this.users.find(u => u.id === studentId);
    if (!user) throw new Error('User not found');

    user.points = (user.points || 0) + Math.max(amount, 0);

    this.pointTransactions.unshift({
      id: 'pt-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      student_id: studentId,
      transaction_type: 'earned',
      amount: Math.max(amount, 0),
      source,
      reference_id: referenceId,
      created_at: new Date().toISOString()
    });

    return { user, points: user.points };
  }

  deductPoints(studentId: string, amount: number, source: string, referenceId?: string): { user: User; points: number } {
    const user = this.users.find(u => u.id === studentId);
    if (!user) throw new Error('User not found');

    if ((user.points || 0) < amount) {
      throw new Error('Points ไม่เพียงพอสำหรับการทำรายการนี้');
    }

    user.points -= amount;

    this.pointTransactions.unshift({
      id: 'pt-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      student_id: studentId,
      transaction_type: 'spent',
      amount,
      source,
      reference_id: referenceId,
      created_at: new Date().toISOString()
    });

    return { user, points: user.points };
  }

  buyShopItem(studentId: string, itemId: string): { success: boolean; item: ShopItem; remainingPoints: number } {
    const item = this.shopItems.find(i => i.id === itemId);
    if (!item) throw new Error('ไม่พบสินค้าชิ้นนี้ในร้านค้า');

    const user = this.getUser(studentId);
    if (!user) throw new Error('ไม่พบผู้ใช้');

    if (user.level < item.unlock_level) {
      throw new Error(`สินค้านี้ปลดล็อกที่ Level ${item.unlock_level} ขึ้นไป (ปัจจุบัน Level ${user.level})`);
    }

    // Deduct points
    this.deductPoints(studentId, item.price_points, `ซื้อ ${item.item_name}`, item.id);

    // Add to inventory
    const existing = this.inventory.find(i => i.student_id === studentId && i.item_id === itemId);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.inventory.push({
        id: 'inv-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        student_id: studentId,
        item_id: itemId,
        quantity: 1,
        purchased_at: new Date().toISOString()
      });
    }

    return { success: true, item, remainingPoints: user.points };
  }

  upgradeKingdomTier(studentId: string): { kingdom: Kingdom; success: boolean } {
    const kingdom = this.getKingdom(studentId);
    const user = this.getUser(studentId);
    if (!user) throw new Error('User not found');

    const nextTier = (kingdom.kingdom_level + 1) as KingdomTier;
    if (nextTier > 5) {
      throw new Error('อาณาจักรของคุณพัฒนาสู่ระดับสูงสุด (Legendary Empire) เรียบร้อยแล้ว!');
    }

    const tierRequirements: Record<number, { levelReq: number; pointsCost: number; newArea: string; title: string }> = {
      2: { levelReq: 2, pointsCost: 100, newArea: 'garden', title: 'Growing Kingdom (อาณาจักรผลิบาน)' },
      3: { levelReq: 3, pointsCost: 200, newArea: 'village', title: 'Royal Kingdom (อาณาจักรราชวงศ์)' },
      4: { levelReq: 4, pointsCost: 350, newArea: 'tower', title: 'Fantasy Empire (จักรวรรดิแฟนตาซี)' },
      5: { levelReq: 5, pointsCost: 500, newArea: 'legendary', title: 'Legendary Empire (มหาจักรวรรดินิรันดร์)' }
    };

    const req = tierRequirements[nextTier];
    if (user.level < req.levelReq) {
      throw new Error(`ต้องการ Level ${req.levelReq} เพื่อเลื่อนขั้นอาณาจักร (ปัจจุบัน Level ${user.level})`);
    }

    this.deductPoints(studentId, req.pointsCost, `อัปเกรดอาณาจักรเป็น ${req.title}`, 'kingdom-upgrade');

    kingdom.kingdom_level = nextTier;
    if (!kingdom.unlocked_areas.includes(req.newArea)) {
      kingdom.unlocked_areas.push(req.newArea);
    }
    kingdom.updated_at = new Date().toISOString();

    this.notifications.unshift({
      id: 'n-' + Date.now(),
      user_id: studentId,
      title: `🏰 อาณาจักรเลื่อนขั้นเป็น ${req.title}!`,
      message: `คุณได้ปลดล็อกพื้นที่ "${req.newArea}" และสิทธิ์ตกแต่งระดับสูงขึ้น ขอให้สนุกกับการสร้างโลกในฝัน!`,
      type: 'achievement',
      read_status: false,
      created_at: new Date().toISOString()
    });

    return { kingdom, success: true };
  }

  checkBadges(studentId: string) {
    const user = this.users.find(u => u.id === studentId);
    if (!user) return;

    const userBadges = this.studentBadges.filter(sb => sb.student_id === studentId);
    const hasBadge = (badgeId: string) => userBadges.some(b => b.badge_id === badgeId);

    const award = (badgeId: string) => {
      if (!hasBadge(badgeId)) {
        this.studentBadges.push({
          id: 'sb-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
          student_id: studentId,
          badge_id: badgeId,
          earned_at: new Date().toISOString()
        });
        const badge = this.badges.find(b => b.id === badgeId);
        if (badge) {
          this.notifications.unshift({
            id: 'n-' + Date.now(),
            user_id: studentId,
            title: `ปลดล็อกเหรียญรางวัล: ${badge.name_th}`,
            message: badge.description,
            type: 'achievement',
            read_status: false,
            created_at: new Date().toISOString()
          });
        }
      }
    };

    const attempts = this.gameAttempts.filter(ga => ga.student_id === studentId);
    if (attempts.length >= 1) award('b-1');
    if (attempts.some(ga => ga.score === ga.max_score && ga.max_score > 0)) award('b-6');
    if (user.daily_streak >= 5) award('b-4');

    let totalCorrect = 0;
    attempts.forEach(a => {
      a.answers?.forEach(ans => {
        if (ans.is_correct) totalCorrect++;
      });
    });
    if (totalCorrect >= 10) award('b-2');
  }
}

export const db = new DatabaseStore();
