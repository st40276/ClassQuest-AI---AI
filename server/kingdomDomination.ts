import { 
  KingdomBuilding, KingdomDefense, KingdomBattle, 
  KingdomBattleQuestion, KingdomBattleCooldown, RivalKingdom, 
  BuildingType, User, KingdomTier
} from '../src/types';
import { db } from './db';

// -------------------------------------------------------------
// Building Catalog Definition
// -------------------------------------------------------------
export interface BuildingCatalogItem {
  type: BuildingType;
  name: string;
  category: 'citadel' | 'defense' | 'economy' | 'infrastructure' | 'civic';
  icon: string;
  base_defense: number;
  price_points: number;
  upgrade_cost_base: number;
  unlock_kingdom_level: KingdomTier;
  width: number;
  height: number;
  description: string;
  lore: string;
  resource_yield?: string;
}

export const BUILDING_CATALOG: BuildingCatalogItem[] = [
  {
    type: 'castle',
    name: 'ปราสาทหลักราชวงศ์ (Royal Citadel)',
    category: 'citadel',
    icon: '🏰',
    base_defense: 50,
    price_points: 0,
    upgrade_cost_base: 150,
    unlock_kingdom_level: 1,
    width: 2,
    height: 2,
    description: 'ศูนย์บัญชาการหลักของอาณาจักร เป็นหัวใจแห่งอำนาจและการปกป้อง',
    lore: 'ปราสาทหินอ่อนสะท้อนแสงตะวัน ที่ซึ่งบัลลังก์แห่งปัญญาสถิตอยู่',
    resource_yield: 'ศูนย์กลางการพัฒนาอาณาจักร'
  },
  {
    type: 'wall',
    name: 'กำแพงหินศิลาพิทักษ์ (Bastion Stone Wall)',
    category: 'defense',
    icon: '🧱',
    base_defense: 20,
    price_points: 35,
    upgrade_cost_base: 30,
    unlock_kingdom_level: 1,
    width: 1,
    height: 1,
    description: 'กำแพงศิลาเสริมมนตรา ป้องกันการบุกรุกและเพิ่มพลังป้องกันอาณาจักร +20',
    lore: 'สลักอักขระโบราณต้านทานพลังทำลายล้างจากภายนอก',
    resource_yield: '+20 Defense Points'
  },
  {
    type: 'tower',
    name: 'หอคอยมนตราอาร์เคน (Aegis Arcane Tower)',
    category: 'defense',
    icon: '🗼',
    base_defense: 35,
    price_points: 75,
    upgrade_cost_base: 50,
    unlock_kingdom_level: 2,
    width: 1,
    height: 1,
    description: 'หอคอยเวทมนตร์ยิงแสงคุ้มกันเมื่ออาณาจักรถูกท้าทาย +35 Defense',
    lore: 'คริสตัลยอดหอคอยจะส่งสัญญาณเตือนภัยเมื่อมีผู้บุกรุกย่างกรายเข้ามา',
    resource_yield: '+35 Defense Points'
  },
  {
    type: 'house',
    name: 'บ้านพักพลเมืองปัญญา (Scholar Residence)',
    category: 'civic',
    icon: '🏡',
    base_defense: 8,
    price_points: 30,
    upgrade_cost_base: 25,
    unlock_kingdom_level: 1,
    width: 1,
    height: 1,
    description: 'ที่อยู่อาศัยของชาวเมืองปัญญา เพิ่มความเจริญรุ่งเรืองและประชากร',
    lore: 'แสงตะเกียงจากหน้าต่างส่องสว่างยามค่ำคืน พลเมืองต่างใฝ่หาความรู้',
    resource_yield: '+8 Defense / ชุมชนอบอุ่น'
  },
  {
    type: 'farm',
    name: 'ฟาร์มส้มตะวันฉาย (Sunburst Grove & Farm)',
    category: 'economy',
    icon: '🌾',
    base_defense: 6,
    price_points: 40,
    upgrade_cost_base: 30,
    unlock_kingdom_level: 1,
    width: 1,
    height: 1,
    description: 'แปลงเกษตรกรรมผลิตเสบียงอาหารหล่อเลี้ยงกองทัพและพลเมือง',
    lore: 'รวงข้าวสีทองและผลไม้รสหวานที่เติบโตด้วยน้ำค้างบริสุทธิ์แห่งผืนดินแฟนตาซี',
    resource_yield: 'เสบียงอาหารมั่งคั่ง'
  },
  {
    type: 'market',
    name: 'ตลาดกลางศิลปวิทยา (Academy Grand Bazaar)',
    category: 'economy',
    icon: '⛺',
    base_defense: 12,
    price_points: 60,
    upgrade_cost_base: 45,
    unlock_kingdom_level: 2,
    width: 1,
    height: 1,
    description: 'ศูนย์กลางการแลกเปลี่ยนสินค้า ตําราเวท และของตกแต่งล้ำค่า',
    lore: 'พ่อค้าวาณิชจากแดนไกลต่างเดินทางมารวมตัวแลกเปลี่ยนความรู้และสมบัติ',
    resource_yield: 'เศรษฐกิจคึกคัก'
  },
  {
    type: 'storage',
    name: 'คลังสมบัติและทรัพยากร (Treasury Depot)',
    category: 'infrastructure',
    icon: '🏛️',
    base_defense: 15,
    price_points: 50,
    upgrade_cost_base: 40,
    unlock_kingdom_level: 2,
    width: 1,
    height: 1,
    description: 'สถานที่เก็บรักษาเหรียญ Points และศิลาเวท ป้องกันความสูญเสีย',
    lore: 'ประตูปิดผนึกด้วยกุญแจกลไกรูนโบราณ ยากที่โจรผู้ร้ายจะแตะต้องได้',
    resource_yield: 'คุ้มครองทรัพยากรอาณาจักร'
  },
  {
    type: 'garden',
    name: 'สวนพฤกษามายา (Botanical Sanctuary)',
    category: 'civic',
    icon: '🌸',
    base_defense: 5,
    price_points: 35,
    upgrade_cost_base: 25,
    unlock_kingdom_level: 1,
    width: 1,
    height: 1,
    description: 'สวนดอกไม้และต้นไม้เวทมนตร์ ปลอบประโลมจิตใจและเพิ่มความงดงาม',
    lore: 'กลีบดอกไม้โปรยปรายตามสายลม เปล่งประกายละอองแสงยามต้องแสงอาทิตย์',
    resource_yield: 'บรรยากาศรื่นรมย์'
  },
  {
    type: 'gate',
    name: 'ซุ้มประตูเมืองเกียรติยศ (Grand Citadel Gate)',
    category: 'defense',
    icon: '⛩️',
    base_defense: 25,
    price_points: 65,
    upgrade_cost_base: 45,
    unlock_kingdom_level: 2,
    width: 1,
    height: 1,
    description: 'ป้อมปราการด่านหน้า ต้อนรับมิตรและต้านทานศัตรู +25 Defense',
    lore: 'ธงชัยปลิวไสวเหนือยอดซุ้มประตู เป็นสัญลักษณ์แห่งเอกราชและความภาคภูมิใจ',
    resource_yield: '+25 Defense Points'
  },
  {
    type: 'bridge',
    name: 'สะพานคริสตัลข้ามสายธาร (Crystal Water Bridge)',
    category: 'infrastructure',
    icon: '🌉',
    base_defense: 10,
    price_points: 45,
    upgrade_cost_base: 35,
    unlock_kingdom_level: 2,
    width: 1,
    height: 1,
    description: 'สะพานเชื่อมข้ามแม่น้ำแห่งความรู้ ช่วยให้การสัญจรเชื่อมต่อทุกพื้นที่',
    lore: 'สร้างจากหินผลึกแก้วใส ทนทานต่อกระแสน้ำเชี่ยวกรากใต้แม่น้ำ',
    resource_yield: 'เชื่อมโยงดินแดน'
  },
  {
    type: 'academy_monument',
    name: 'อนุสาวรีย์ปราชญ์ผู้กล้า (Academy Hero Monument)',
    category: 'citadel',
    icon: '🗿',
    base_defense: 30,
    price_points: 90,
    upgrade_cost_base: 60,
    unlock_kingdom_level: 3,
    width: 1,
    height: 1,
    description: 'อนุสรณ์สถานเชิดชูเกียรติผู้พิชิตโจทย์วิชาการ เพิ่มพลังใจและชื่อเสียง +30 Defense',
    lore: 'สลักนามของเหล่านักเรียนผู้มีผลการเรียนรู้ยอดเยี่ยมตลอดกาล',
    resource_yield: '+30 Defense / เพิ่มเกียรติยศ'
  }
];

// -------------------------------------------------------------
// Kingdom Domination In-Memory Store
// -------------------------------------------------------------
class KingdomDominationManager {
  buildings: KingdomBuilding[] = [
    // u-student-1: ภานุพงศ์
    {
      id: 'kb-1',
      kingdom_id: 'k-student-1',
      building_id: 'bld-castle',
      building_type: 'castle',
      name: 'ปราสาทมังกรอรุณ (Dragon Keep)',
      position_x: 5,
      position_y: 5,
      building_level: 2,
      defense_bonus: 75,
      icon: '🏰',
      description: 'ศูนย์บัญชาการของภานุพงศ์',
      upgrade_cost_points: 150,
      width: 2,
      height: 2
    },
    {
      id: 'kb-2',
      kingdom_id: 'k-student-1',
      building_id: 'bld-tower',
      building_type: 'tower',
      name: 'หอคอยเวทมังกรฟ้า',
      position_x: 3,
      position_y: 4,
      building_level: 1,
      defense_bonus: 35,
      icon: '🗼',
      description: 'คุ้มกันฝั่งตะวันตก',
      upgrade_cost_points: 50,
      width: 1,
      height: 1
    },
    {
      id: 'kb-3',
      kingdom_id: 'k-student-1',
      building_id: 'bld-wall',
      building_type: 'wall',
      name: 'แนวกำแพงศิลาหน้า',
      position_x: 4,
      position_y: 7,
      building_level: 1,
      defense_bonus: 20,
      icon: '🧱',
      description: 'ปราการด่านหน้า',
      upgrade_cost_points: 30,
      width: 1,
      height: 1
    },
    {
      id: 'kb-4',
      kingdom_id: 'k-student-1',
      building_id: 'bld-farm',
      building_type: 'farm',
      name: 'ฟาร์มส้มตะวันฉาย',
      position_x: 2,
      position_y: 2,
      building_level: 1,
      defense_bonus: 6,
      icon: '🌾',
      description: 'แปลงเกษตรกรรม',
      upgrade_cost_points: 30,
      width: 1,
      height: 1
    },
    {
      id: 'kb-5',
      kingdom_id: 'k-student-1',
      building_id: 'bld-house',
      building_type: 'house',
      name: 'บ้านพักนักรบดาบ',
      position_x: 7,
      position_y: 3,
      building_level: 1,
      defense_bonus: 8,
      icon: '🏡',
      description: 'บ้านพักพลเมือง',
      upgrade_cost_points: 25,
      width: 1,
      height: 1
    },
    {
      id: 'kb-6',
      kingdom_id: 'k-student-1',
      building_id: 'bld-storage',
      building_type: 'storage',
      name: 'คลังเหรียญทองราชสีห์',
      position_x: 7,
      position_y: 6,
      building_level: 1,
      defense_bonus: 15,
      icon: '🏛️',
      description: 'เก็บรักษา Points',
      upgrade_cost_points: 40,
      width: 1,
      height: 1
    },

    // u-student-2: กานดา
    {
      id: 'kb-20',
      kingdom_id: 'k-student-2',
      building_id: 'bld-castle',
      building_type: 'castle',
      name: 'ปราสาทปราชญ์ดวงดาว',
      position_x: 5,
      position_y: 5,
      building_level: 3,
      defense_bonus: 100,
      icon: '🏰',
      description: 'ศูนย์บัญชาการของกานดา',
      upgrade_cost_points: 200,
      width: 2,
      height: 2
    },
    {
      id: 'kb-21',
      kingdom_id: 'k-student-2',
      building_id: 'bld-tower',
      building_type: 'tower',
      name: 'หอคอยดาราศาสตร์',
      position_x: 3,
      position_y: 3,
      building_level: 2,
      defense_bonus: 50,
      icon: '🗼',
      description: 'หอคอยเวทมนตร์อาร์เคน',
      upgrade_cost_points: 75,
      width: 1,
      height: 1
    },
    {
      id: 'kb-22',
      kingdom_id: 'k-student-2',
      building_id: 'bld-wall',
      building_type: 'wall',
      name: 'กำแพงมนตราแสง',
      position_x: 5,
      position_y: 7,
      building_level: 2,
      defense_bonus: 35,
      icon: '🧱',
      description: 'กำแพงหินศิลา',
      upgrade_cost_points: 45,
      width: 1,
      height: 1
    },
    {
      id: 'kb-23',
      kingdom_id: 'k-student-2',
      building_id: 'bld-market',
      building_type: 'market',
      name: 'ตลาดตำราลอยฟ้า',
      position_x: 7,
      position_y: 4,
      building_level: 1,
      defense_bonus: 12,
      icon: '⛺',
      description: 'ตลาดแลกเปลี่ยนเวท',
      upgrade_cost_points: 45,
      width: 1,
      height: 1
    },

    // u-student-3: ธีปกร
    {
      id: 'kb-30',
      kingdom_id: 'k-student-3',
      building_id: 'bld-castle',
      building_type: 'castle',
      name: 'ป้อมปราการเงาจันทรา',
      position_x: 5,
      position_y: 5,
      building_level: 2,
      defense_bonus: 75,
      icon: '🏰',
      description: 'ฐานที่มั่นของธีปกร',
      upgrade_cost_points: 150,
      width: 2,
      height: 2
    },
    {
      id: 'kb-31',
      kingdom_id: 'k-student-3',
      building_id: 'bld-tower',
      building_type: 'tower',
      name: 'หอคอยพรานสังเกตการณ์',
      position_x: 7,
      position_y: 3,
      building_level: 1,
      defense_bonus: 35,
      icon: '🗼',
      description: 'หอคอยพิทักษ์',
      upgrade_cost_points: 50,
      width: 1,
      height: 1
    },

    // u-student-4: ณิชาภา
    {
      id: 'kb-40',
      kingdom_id: 'k-student-4',
      building_id: 'bld-castle',
      building_type: 'castle',
      name: 'วิมานสุริยันจันทรา',
      position_x: 5,
      position_y: 5,
      building_level: 4,
      defense_bonus: 130,
      icon: '🏰',
      description: 'มหาวิมานของณิชาภา',
      upgrade_cost_points: 300,
      width: 2,
      height: 2
    },
    {
      id: 'kb-41',
      kingdom_id: 'k-student-4',
      building_id: 'bld-monument',
      building_type: 'academy_monument',
      name: 'อนุสาวรีย์แสงทอง',
      position_x: 3,
      position_y: 3,
      building_level: 2,
      defense_bonus: 50,
      icon: '🗿',
      description: 'อนุสรณ์แห่งความรู้',
      upgrade_cost_points: 90,
      width: 1,
      height: 1
    },
    {
      id: 'kb-42',
      kingdom_id: 'k-student-4',
      building_id: 'bld-gate',
      building_type: 'gate',
      name: 'ซุ้มประตูดาราพิกุล',
      position_x: 5,
      position_y: 8,
      building_level: 2,
      defense_bonus: 40,
      icon: '⛩️',
      description: 'ประตูเมืองเกียรติยศ',
      upgrade_cost_points: 65,
      width: 1,
      height: 1
    }
  ];

  defenses: KingdomDefense[] = [
    {
      id: 'kd-def-1',
      kingdom_id: 'k-student-1',
      shield_status: false,
      shield_expires_at: null,
      defense_level: 159, // 75+35+20+6+8+15
      wall_level: 1,
      tower_count: 1,
      total_defenses: 6,
      last_attacked_at: null
    },
    {
      id: 'kd-def-2',
      kingdom_id: 'k-student-2',
      shield_status: false,
      shield_expires_at: null,
      defense_level: 197, // 100+50+35+12
      wall_level: 2,
      tower_count: 1,
      total_defenses: 4,
      last_attacked_at: null
    },
    {
      id: 'kd-def-3',
      kingdom_id: 'k-student-3',
      shield_status: false,
      shield_expires_at: null,
      defense_level: 110,
      wall_level: 0,
      tower_count: 1,
      total_defenses: 2,
      last_attacked_at: null
    },
    {
      id: 'kd-def-4',
      kingdom_id: 'k-student-4',
      shield_status: false,
      shield_expires_at: null,
      defense_level: 220,
      wall_level: 0,
      tower_count: 0,
      total_defenses: 3,
      last_attacked_at: null
    }
  ];

  battles: KingdomBattle[] = [
    {
      id: 'btl-seed-1',
      attacker_id: 'u-student-1',
      attacker_name: 'ภานุพงศ์ ใจกล้า',
      defender_id: 'u-student-3',
      defender_name: 'ธีปกร รัตนชัย',
      target_kingdom_id: 'k-student-3',
      target_kingdom_name: 'ป้อมปราการพรานเงา',
      subject: 'วิทยาศาสตร์',
      topic: 'การสังเคราะห์ด้วยแสงและการดำรงชีวิตของพืช',
      questions_count: 10,
      correct_answers: 10,
      result: 'victory',
      points_transferred: 50,
      created_at: '2026-02-05T14:30:00Z'
    },
    {
      id: 'btl-seed-2',
      attacker_id: 'u-student-2',
      attacker_name: 'กานดา สายลมพฤกษ์',
      defender_id: 'u-student-1',
      defender_name: 'ภานุพงศ์ ใจกล้า',
      target_kingdom_id: 'k-student-1',
      target_kingdom_name: 'อาณาจักรมังกรอรุณรุ่ง',
      subject: 'คณิตศาสตร์',
      topic: 'ทฤษฎีบทพีทาโกรัสและตรีโกณมิติ',
      questions_count: 10,
      correct_answers: 9,
      result: 'defeat',
      points_transferred: 0,
      created_at: '2026-02-06T10:15:00Z'
    }
  ];

  battleQuestions: KingdomBattleQuestion[] = [];
  cooldowns: KingdomBattleCooldown[] = [];

  // Active in-progress battle sessions cache
  activeBattleSessions: Map<string, {
    battleId: string;
    attackerId: string;
    defenderId: string;
    targetKingdomId: string;
    subject: string;
    topic: string;
    questions: any[];
    createdAt: number;
  }> = new Map();

  // -------------------------------------------------------------
  // Methods
  // -------------------------------------------------------------

  getKingdomBuildings(kingdomId: string): KingdomBuilding[] {
    return this.buildings.filter(b => b.kingdom_id === kingdomId);
  }

  getKingdomDefense(kingdomId: string): KingdomDefense {
    let def = this.defenses.find(d => d.kingdom_id === kingdomId);
    if (!def) {
      def = {
        id: 'kd-def-' + Date.now(),
        kingdom_id: kingdomId,
        shield_status: false,
        shield_expires_at: null,
        defense_level: 50,
        wall_level: 0,
        tower_count: 0,
        total_defenses: 1,
        last_attacked_at: null
      };
      this.defenses.push(def);
    }

    // Refresh dynamic calculation based on current buildings
    const kingdomBlds = this.getKingdomBuildings(kingdomId);
    let totalDef = 0;
    let wallLvl = 0;
    let towers = 0;
    kingdomBlds.forEach(b => {
      totalDef += b.defense_bonus;
      if (b.building_type === 'wall') wallLvl = Math.max(wallLvl, b.building_level);
      if (b.building_type === 'tower') towers += 1;
    });

    def.defense_level = Math.max(50, totalDef);
    def.wall_level = wallLvl;
    def.tower_count = towers;
    def.total_defenses = kingdomBlds.length;

    // Check if shield has expired
    if (def.shield_status && def.shield_expires_at) {
      if (new Date(def.shield_expires_at).getTime() <= Date.now()) {
        def.shield_status = false;
        def.shield_expires_at = null;
      }
    }

    return def;
  }

  buyAndPlaceBuilding(studentId: string, kingdomId: string, buildingTypeId: BuildingType, x: number, y: number): { success: boolean; building: KingdomBuilding; remainingPoints: number } {
    const catalogItem = BUILDING_CATALOG.find(b => b.type === buildingTypeId);
    if (!catalogItem) throw new Error('ไม่พบข้อมูลสิ่งปลูกสร้างชนิดนี้');

    const kingdom = db.kingdoms.find(k => k.id === kingdomId || k.student_id === studentId);
    if (!kingdom) throw new Error('ไม่พบข้อมูลอาณาจักร');

    if (kingdom.kingdom_level < catalogItem.unlock_kingdom_level) {
      throw new Error(`สิ่งปลูกสร้างนี้ต้องการระดับอาณาจักร Tier ${catalogItem.unlock_kingdom_level} ขึ้นไป`);
    }

    // Check if spot is occupied
    const occupied = this.buildings.some(b => b.kingdom_id === kingdom.id && b.position_x === x && b.position_y === y);
    if (occupied) {
      throw new Error('ตำแหน่งนี้มีสิ่งปลูกสร้างตั้งอยู่แล้ว');
    }

    // Deduct Points
    if (catalogItem.price_points > 0) {
      db.deductPoints(studentId, catalogItem.price_points, `สร้าง${catalogItem.name}`, `bld-${Date.now()}`);
    }

    const newBuilding: KingdomBuilding = {
      id: 'kb-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      kingdom_id: kingdom.id,
      building_id: 'bld-' + catalogItem.type,
      building_type: catalogItem.type,
      name: catalogItem.name,
      position_x: x,
      position_y: y,
      building_level: 1,
      defense_bonus: catalogItem.base_defense,
      icon: catalogItem.icon,
      description: catalogItem.description,
      upgrade_cost_points: catalogItem.upgrade_cost_base,
      width: catalogItem.width,
      height: catalogItem.height
    };

    this.buildings.push(newBuilding);
    this.getKingdomDefense(kingdom.id); // recalculate

    const user = db.getUser(studentId);
    return {
      success: true,
      building: newBuilding,
      remainingPoints: user?.points || 0
    };
  }

  upgradeBuilding(studentId: string, buildingId: string): { success: boolean; building: KingdomBuilding; remainingPoints: number } {
    const building = this.buildings.find(b => b.id === buildingId);
    if (!building) throw new Error('ไม่พบสิ่งปลูกสร้างนี้');

    const kingdom = db.kingdoms.find(k => k.id === building.kingdom_id);
    if (!kingdom || kingdom.student_id !== studentId) {
      throw new Error('คุณไม่มีสิทธิ์อัปเกรดสิ่งปลูกสร้างในอาณาจักรนี้');
    }

    const cost = building.upgrade_cost_points || 40;
    db.deductPoints(studentId, cost, `อัปเกรด${building.name} เป็นเลเวล ${building.building_level + 1}`, building.id);

    building.building_level += 1;
    building.defense_bonus += 15;
    building.upgrade_cost_points = Math.round(cost * 1.5);

    this.getKingdomDefense(kingdom.id); // refresh stats

    const user = db.getUser(studentId);
    return {
      success: true,
      building,
      remainingPoints: user?.points || 0
    };
  }

  demolishBuilding(studentId: string, buildingId: string): { success: boolean; message: string } {
    const idx = this.buildings.findIndex(b => b.id === buildingId);
    if (idx === -1) throw new Error('ไม่พบสิ่งปลูกสร้างที่ต้องการรื้อถอน');

    const building = this.buildings[idx];
    if (building.building_type === 'castle') {
      throw new Error('ไม่สามารถรื้อถอนปราสาทหลักของอาณาจักรได้');
    }

    const kingdom = db.kingdoms.find(k => k.id === building.kingdom_id);
    if (!kingdom || kingdom.student_id !== studentId) {
      throw new Error('คุณไม่มีสิทธิ์รื้อถอนสิ่งปลูกสร้างนี้');
    }

    this.buildings.splice(idx, 1);
    this.getKingdomDefense(kingdom.id);

    return { success: true, message: `รื้อถอน ${building.name} เรียบร้อยแล้ว` };
  }

  getRivalKingdoms(currentStudentId: string): RivalKingdom[] {
    // Return all other student kingdoms with privacy protection (no emails or sensitive details)
    const rivals: RivalKingdom[] = [];

    // Ensure all demo students have a kingdom
    const studentUsers = db.users.filter(u => u.role === 'student');
    studentUsers.forEach(u => {
      // make sure they have a kingdom
      db.getKingdom(u.id);
    });

    db.kingdoms.forEach(k => {
      if (k.student_id === currentStudentId) return; // skip own kingdom

      const ruler = db.getUser(k.student_id);
      if (!ruler) return;

      const def = this.getKingdomDefense(k.id);
      const bldCount = this.getKingdomBuildings(k.id).length;

      // Check cooldown with current player
      const cd = this.cooldowns.find(c => c.attacker_id === currentStudentId && c.defender_id === k.student_id);
      const isCooldown = cd && new Date(cd.next_available_at).getTime() > Date.now();

      // Shield remaining minutes
      let shieldLeftMinutes = 0;
      if (def.shield_status && def.shield_expires_at) {
        const ms = new Date(def.shield_expires_at).getTime() - Date.now();
        if (ms > 0) {
          shieldLeftMinutes = Math.ceil(ms / (1000 * 60));
        } else {
          def.shield_status = false;
          def.shield_expires_at = null;
        }
      }

      rivals.push({
        kingdom_id: k.id,
        student_id: k.student_id,
        kingdom_name: k.kingdom_name,
        ruler_name: ruler.display_name,
        ruler_avatar: ruler.avatar,
        ruler_class: ruler.avatar_class || 'ผู้พิทักษ์อาณาจักร',
        kingdom_level: k.kingdom_level,
        points: ruler.points || 0,
        defense: def,
        building_count: bldCount,
        is_shielded: def.shield_status,
        shield_time_left_minutes: shieldLeftMinutes,
        can_attack: !def.shield_status && !isCooldown,
        cooldown_until: isCooldown ? cd.next_available_at : null
      });
    });

    return rivals;
  }

  startKingdomBattle(attackerId: string, defenderId: string, targetSubject?: string): {
    battleId: string;
    subject: string;
    topic: string;
    questionsCount: number;
    questions: Array<{
      id: string;
      question: string;
      options: string[];
      difficulty: string;
    }>;
    defenderName: string;
    targetKingdomName: string;
    pointsAtStake: number;
  } {
    if (attackerId === defenderId) {
      throw new Error('ไม่สามารถท้าทายอาณาจักรของตนเองได้');
    }

    const defender = db.getUser(defenderId);
    if (!defender) throw new Error('ไม่พบอาณาจักรเป้าหมาย');

    const defKingdom = db.kingdoms.find(k => k.student_id === defenderId);
    if (!defKingdom) throw new Error('ไม่พบข้อมูลอาณาจักรของคู่แข่ง');

    const defDefense = this.getKingdomDefense(defKingdom.id);
    if (defDefense.shield_status && defDefense.shield_expires_at && new Date(defDefense.shield_expires_at).getTime() > Date.now()) {
      throw new Error('อาณาจักรนี้กำลังเปิดใช้โล่ป้องกันมนตราอยู่ ไม่สามารถท้าทายได้ในขณะนี้');
    }

    // Check anti-spam cooldown
    const cd = this.cooldowns.find(c => c.attacker_id === attackerId && c.defender_id === defenderId);
    if (cd && new Date(cd.next_available_at).getTime() > Date.now()) {
      const waitMin = Math.ceil((new Date(cd.next_available_at).getTime() - Date.now()) / (1000 * 60));
      throw new Error(`คุณเพิ่งท้าทายอาณาจักรนี้ไป กรุณารออีก ${waitMin} นาที เพื่อป้องกันการโจมตีซ้ำซ้อน`);
    }

    // Draw random subject and 10 questions
    const subjects = Object.keys(DOMINATION_QUESTION_BANK);
    const chosenSubject = targetSubject && DOMINATION_QUESTION_BANK[targetSubject] 
      ? targetSubject 
      : subjects[Math.floor(Math.random() * subjects.length)];

    const subjectPool = DOMINATION_QUESTION_BANK[chosenSubject];
    const topic = subjectPool.topic;
    
    // Shuffle and pick 10 questions without duplication
    const shuffled = [...subjectPool.questions].sort(() => Math.random() - 0.5);
    const selectedQuestions = shuffled.slice(0, 10);

    const battleId = 'btl-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);

    // Save active session for secure server verification
    this.activeBattleSessions.set(battleId, {
      battleId,
      attackerId,
      defenderId,
      targetKingdomId: defKingdom.id,
      subject: chosenSubject,
      topic,
      questions: selectedQuestions,
      createdAt: Date.now()
    });

    const pointsAtStake = Math.min(50, Math.max(0, defender.points || 0));

    // Return safe question objects without answers/explanations
    const clientQuestions = selectedQuestions.map((q, idx) => ({
      id: q.id || `q-${idx + 1}`,
      question: q.question,
      options: q.options,
      difficulty: q.difficulty || 'medium'
    }));

    return {
      battleId,
      subject: chosenSubject,
      topic,
      questionsCount: clientQuestions.length,
      questions: clientQuestions,
      defenderName: defender.display_name,
      targetKingdomName: defKingdom.kingdom_name,
      pointsAtStake
    };
  }

  resolveKingdomBattle(battleId: string, attackerId: string, userAnswers: number[]): {
    result: 'victory' | 'defeat';
    score: number;
    total: number;
    pointsTransferred: number;
    attackerNewPoints: number;
    defenderNewPoints: number;
    shieldActivated: boolean;
    subject: string;
    topic: string;
    review: Array<{
      question: string;
      options: string[];
      selectedAnswer: number;
      correctAnswer: number;
      isCorrect: boolean;
      explanation: string;
    }>;
  } {
    const session = this.activeBattleSessions.get(battleId);
    if (!session) {
      throw new Error('ไม่พบข้อมูลรอบการต่อสู้นี้ หรือรอบการต่อสู้หมดอายุแล้ว');
    }

    if (session.attackerId !== attackerId) {
      throw new Error('ข้อมูลผู้ท้าทายไม่ตรงกับรอบการแข่งขัน');
    }

    const attacker = db.getUser(attackerId);
    const defender = db.getUser(session.defenderId);
    const defKingdom = db.kingdoms.find(k => k.id === session.targetKingdomId);

    if (!attacker || !defender || !defKingdom) {
      throw new Error('ไม่พบข้อมูลผู้เล่นในระบบ');
    }

    // Verify all 10 answers
    let correctCount = 0;
    const review: any[] = [];

    session.questions.forEach((q, idx) => {
      const selected = userAnswers[idx];
      const isCorrect = selected === q.correct_answer;
      if (isCorrect) correctCount++;

      review.push({
        question: q.question,
        options: q.options,
        selectedAnswer: selected,
        correctAnswer: q.correct_answer,
        isCorrect,
        explanation: q.explanation
      });

      this.battleQuestions.push({
        id: 'bq-' + Date.now() + '-' + idx,
        battle_id: battleId,
        question_id: q.id || `q-${idx}`,
        selected_answer: selected,
        correct_answer: q.correct_answer,
        is_correct: isCorrect
      });
    });

    const isVictory = correctCount === 10; // MUST answer all 10 questions correctly to win
    let pointsTransferred = 0;
    let shieldActivated = false;

    if (isVictory) {
      // Calculate transferable points: up to 50 points, cannot exceed defender's balance
      const maxTransfer = Math.min(50, Math.max(0, defender.points || 0));
      pointsTransferred = maxTransfer;

      if (pointsTransferred > 0) {
        defender.points = Math.max(0, (defender.points || 0) - pointsTransferred);
        attacker.points = (attacker.points || 0) + pointsTransferred;

        // Atomic Point Transactions
        db.pointTransactions.unshift({
          id: 'pt-atk-' + Date.now(),
          student_id: attacker.id,
          transaction_type: 'earned',
          amount: pointsTransferred,
          source: `🏆 ชัยชนะในศึกชิงอาณาจักร: ${defKingdom.kingdom_name} (ตอบถูก 10/10)`,
          reference_id: battleId,
          created_at: new Date().toISOString()
        });

        db.pointTransactions.unshift({
          id: 'pt-def-' + Date.now(),
          student_id: defender.id,
          transaction_type: 'spent',
          amount: pointsTransferred,
          source: `⚔️ พ่ายแพ้ศึกชิงอาณาจักรต่อ ${attacker.display_name}`,
          reference_id: battleId,
          created_at: new Date().toISOString()
        });
      }

      // Activate Protection Shield for defender (2 hours)
      const defDefense = this.getKingdomDefense(defKingdom.id);
      defDefense.shield_status = true;
      defDefense.shield_expires_at = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
      defDefense.last_attacked_at = new Date().toISOString();
      shieldActivated = true;

      // Add Notification to defender
      db.notifications.unshift({
        id: 'n-' + Date.now(),
        user_id: defender.id,
        title: `🛡️ อาณาจักรของคุณถูกท้าทายโดย ${attacker.display_name}`,
        message: `ผู้ท้าทายสามารถตอบคำถามวิชา ${session.subject} ถูกครบ 10 ข้อ ระบบได้เปิดใช้งานโล่ป้องกันชั่วคราว 2 ชั่วโมงเพื่อคุ้มครองอาณาจักรของคุณ`,
        type: 'system',
        read_status: false,
        created_at: new Date().toISOString()
      });

      // Add Notification to attacker
      db.notifications.unshift({
        id: 'n-atk-' + Date.now(),
        user_id: attacker.id,
        title: `👑 VICTORY! พิชิตศึกชิงอาณาจักรสำเร็จ!`,
        message: `คุณตอบถูกครบ 10/10 ข้อในวิชา ${session.subject} ได้รับ ${pointsTransferred} Points จาก ${defKingdom.kingdom_name}!`,
        type: 'achievement',
        read_status: false,
        created_at: new Date().toISOString()
      });
    }

    // Set cooldown between attacker and defender (30 minutes)
    const existingCdIdx = this.cooldowns.findIndex(c => c.attacker_id === attackerId && c.defender_id === defender.id);
    const nextAvail = new Date(Date.now() + 30 * 60 * 1000).toISOString();
    if (existingCdIdx !== -1) {
      this.cooldowns[existingCdIdx].next_available_at = nextAvail;
    } else {
      this.cooldowns.push({
        id: 'cd-' + Date.now(),
        attacker_id: attackerId,
        defender_id: defender.id,
        next_available_at: nextAvail
      });
    }

    // Save battle record
    const battleRecord: KingdomBattle = {
      id: battleId,
      attacker_id: attacker.id,
      attacker_name: attacker.display_name,
      defender_id: defender.id,
      defender_name: defender.display_name,
      target_kingdom_id: defKingdom.id,
      target_kingdom_name: defKingdom.kingdom_name,
      subject: session.subject,
      topic: session.topic,
      questions_count: 10,
      correct_answers: correctCount,
      result: isVictory ? 'victory' : 'defeat',
      points_transferred: pointsTransferred,
      created_at: new Date().toISOString()
    };

    this.battles.unshift(battleRecord);

    // Clean up active session
    this.activeBattleSessions.delete(battleId);

    return {
      result: isVictory ? 'victory' : 'defeat',
      score: correctCount,
      total: 10,
      pointsTransferred,
      attackerNewPoints: attacker.points || 0,
      defenderNewPoints: defender.points || 0,
      shieldActivated,
      subject: session.subject,
      topic: session.topic,
      review
    };
  }

  getBattleHistory(studentId: string): {
    victories: KingdomBattle[];
    defeats: KingdomBattle[];
    defenseLog: KingdomBattle[];
  } {
    const victories = this.battles.filter(b => b.attacker_id === studentId && b.result === 'victory');
    const defeats = this.battles.filter(b => b.attacker_id === studentId && b.result === 'defeat');
    const defenseLog = this.battles.filter(b => b.defender_id === studentId);

    return {
      victories,
      defeats,
      defenseLog
    };
  }
}

// -------------------------------------------------------------
// Question Bank covering 10 subjects (100 curriculum questions)
// -------------------------------------------------------------
export const DOMINATION_QUESTION_BANK: Record<string, {
  topic: string;
  questions: Array<{
    id: string;
    question: string;
    options: string[];
    correct_answer: number;
    explanation: string;
    difficulty: string;
  }>;
}> = {
  'คณิตศาสตร์': {
    topic: 'ทฤษฎีบทพีทาโกรัส เรขาคณิต และระบบสมการเชิงเส้น',
    questions: [
      {
        id: 'm-1',
        question: 'รูปสามเหลี่ยมมุมฉากมีด้านประกอบมุมฉากยาว 6 และ 8 เซนติเมตร ด้านตรงข้ามมุมฉากจะมีความยาวเท่าใด?',
        options: ['9 เซนติเมตร', '10 เซนติเมตร', '12 เซนติเมตร', '14 เซนติเมตร'],
        correct_answer: 1,
        explanation: 'จากทฤษฎีบทพีทาโกรัส c² = 6² + 8² = 36 + 64 = 100 ดังนั้น c = √100 = 10 เซนติเมตร',
        difficulty: 'easy'
      },
      {
        id: 'm-2',
        question: 'คำตอบของสมการ 3x - 7 = 14 คือข้อใด?',
        options: ['x = 5', 'x = 6', 'x = 7', 'x = 8'],
        correct_answer: 2,
        explanation: '3x = 14 + 7 = 21 ดังนั้น x = 21 / 3 = 7',
        difficulty: 'easy'
      },
      {
        id: 'm-3',
        question: 'ถ้า sin(θ) = 3/5 สำหรับมุมแหลม θ แล้วค่าของ cos(θ) มีค่าเท่ากับข้อใด?',
        options: ['4/5', '5/4', '3/4', '5/3'],
        correct_answer: 0,
        explanation: 'จากเอกลักษณ์ตรีโกณมิติ sin²(θ) + cos²(θ) = 1 จะได้ cos(θ) = √(1 - 9/25) = √(16/25) = 4/5',
        difficulty: 'medium'
      },
      {
        id: 'm-4',
        question: 'โยนเหรียญเที่ยงตรง 2 เหรียญพร้อมกัน ความน่าจะเป็นที่จะออกหัวอย่างน้อย 1 เหรียญเท่ากับเท่าใด?',
        options: ['1/4', '1/2', '3/4', '1'],
        correct_answer: 2,
        explanation: 'ผลลัพธ์ทั้งหมดคือ {HH, HT, TH, TT} รวม 4 แบบ เหตุการณ์ที่มีหัวอย่างน้อย 1 เหรียญคือ {HH, HT, TH} รวม 3 แบบ ดังนั้น P = 3/4',
        difficulty: 'medium'
      },
      {
        id: 'm-5',
        question: 'ผลบวกของมุมภายในของรูปหกเหลี่ยมมีค่าเท่ากับกี่องศา?',
        options: ['540°', '720°', '900°', '1,080°'],
        correct_answer: 1,
        explanation: 'สูตรผลบวกมุมภายในรูป n เหลี่ยมคือ (n - 2) × 180° = (6 - 2) × 180° = 4 × 180° = 720°',
        difficulty: 'easy'
      },
      {
        id: 'm-6',
        question: 'พื้นที่ผิวของทรงกลมที่มีรัศมี 7 เซนติเมตร มีค่าประมาณเท่าใด? (กำหนด π ≈ 22/7)',
        options: ['154 ตร.ซม.', '308 ตร.ซม.', '616 ตร.ซม.', '1,437 ตร.ซม.'],
        correct_answer: 2,
        explanation: 'สูตรพื้นที่ผิวทรงกลม = 4πr² = 4 × (22/7) × 7 × 7 = 4 × 22 × 7 = 616 ตารางเซนติเมตร',
        difficulty: 'medium'
      },
      {
        id: 'm-7',
        question: 'ถ้า 2^(x+1) = 32 แล้วค่าของ x มีค่าเท่ากับข้อใด?',
        options: ['3', '4', '5', '6'],
        correct_answer: 1,
        explanation: '32 = 2^5 ดังนั้น x + 1 = 5 ส่งผลให้ x = 4',
        difficulty: 'easy'
      },
      {
        id: 'm-8',
        question: 'ค่ามัธยฐานของชุดข้อมูล: 3, 7, 8, 12, 14, 19, 21 คือจำนวนใด?',
        options: ['8', '12', '14', '11'],
        correct_answer: 1,
        explanation: 'ข้อมูลเรียงลำดับจากน้อยไปมาก 7 จำนวน ตำแหน่งมัธยฐานคือตัวที่ (7 + 1) / 2 = ตำแหน่งที่ 4 ซึ่งมีค่าเท่ากับ 12',
        difficulty: 'easy'
      },
      {
        id: 'm-9',
        question: 'ระบบสมการ: x + y = 10 และ x - y = 4 จงหาค่าของ x * y?',
        options: ['21', '24', '25', '28'],
        correct_answer: 0,
        explanation: 'บวกสองสมการได้ 2x = 14 -> x = 7; แทนค่า y = 3 ดังนั้น x * y = 7 * 3 = 21',
        difficulty: 'medium'
      },
      {
        id: 'm-10',
        question: 'พ่อค้าขายเสื้อราคา 480 บาท โดยคิดกำไร 20% จากราคาทุน ต้นทุนของเสื้อตัวนี้มีค่ากี่บาท?',
        options: ['380 บาท', '400 บาท', '420 บาท', '450 บาท'],
        correct_answer: 1,
        explanation: 'ราคาขาย 120% = 480 บาท ดังนั้นราคาทุน 100% = (480 × 100) / 120 = 400 บาท',
        difficulty: 'medium'
      }
    ]
  },

  'วิทยาศาสตร์': {
    topic: 'ชีววิทยา เซลล์ พลังงาน และระบบนิเวศ',
    questions: [
      {
        id: 'sci-1',
        question: 'ในกระบวนการสังเคราะห์ด้วยแสงของพืช ออร์แกเนลล์ใดทำหน้าที่เป็นแหล่งสร้างอาหารหลัก?',
        options: ['ไมโทคอนเดรีย', 'คลอโรพลาสต์', 'ไรโบโซม', 'กอลจิคอมเพล็กซ์'],
        correct_answer: 1,
        explanation: 'คลอโรพลาสต์มีรงควัตถุคลอโรฟิลล์ที่ทำหน้าที่ดูดซับพลังงานแสงเพื่อใช้ในปฏิกิริยาสังเคราะห์ด้วยแสง',
        difficulty: 'easy'
      },
      {
        id: 'sci-2',
        question: 'การแบ่งเซลล์แบบไมโทซิส (Mitosis) มีเป้าหมายสำคัญที่สุดเพื่ออะไร?',
        options: ['สร้างเซลล์สืบพันธุ์', 'เพิ่มจำนวนเซลล์ร่างกายเพื่อการเจริญเติบโต', 'ลดจำนวนโครโมโซมลงครึ่งหนึ่ง', 'สร้างการแปรผันทางพันธุกรรม'],
        correct_answer: 1,
        explanation: 'การแบ่งเซลล์แบบไมโทซิสเป็นการแบ่งเซลล์ร่างกาย (Somatic cell) เพื่อซ่อมแซมส่วนที่สึกหรอและเจริญเติบโต โดยได้เซลล์ลูกที่มีโครโมโซมเท่าเดิม',
        difficulty: 'easy'
      },
      {
        id: 'sci-3',
        question: 'กฎการเคลื่อนที่ข้อที่หนึ่งของนิวตัน (Newton\'s First Law) กล่าวถึงสภาวะใดของวัตถุ?',
        options: ['แรงกิริยาเท่ากับแรงปฏิกิริยา', 'ความเฉื่อยเมื่อไม่มีแรงลัพธ์ภายนอกมากระทำ (ΣF = 0)', 'ความเร่งแปรผันตรงกับแรงลัพธ์ (F = ma)', 'แรงดึงดูดระหว่างมวล'],
        correct_answer: 1,
        explanation: 'กฎข้อที่ 1 หรือกฎแห่งความเฉื่อย ระบุว่าวัตถุจะรักษาสภาพหยุดนิ่งหรือเคลื่อนที่ด้วยความเร็วคงที่ในแนวตรง เว้นแต่จะมีแรงลัพธ์ที่ไม่เป็นศูนย์มากระทำ',
        difficulty: 'medium'
      },
      {
        id: 'sci-4',
        question: 'สารละลายที่มีค่า pH = 3 มีสมบัติความเป็นกรด-เบสอย่างไร?',
        options: ['เป็นเบสแก่', 'เป็นกลาง', 'เป็นกรด', 'เป็นเบสอ่อน'],
        correct_answer: 2,
        explanation: 'ค่า pH น้อยกว่า 7 แสดงสมบัติความเป็นกรด โดย pH = 3 จัดว่าเป็นกรดที่มีความเข้มข้นของไฮโดรเนียมไอออนสูง',
        difficulty: 'easy'
      },
      {
        id: 'sci-5',
        question: 'ดาวเคราะห์ดวงใดในระบบสุริยะที่มีขนาดใหญ่ที่สุด?',
        options: ['ดาวเสาร์', 'ดาวพฤหัสบดี', 'ดาวยูเรนัส', 'ดาวเนปจูน'],
        correct_answer: 1,
        explanation: 'ดาวพฤหัสบดี (Jupiter) เป็นดาวเคราะห์ก๊าซที่มีขนาดเส้นผ่านศูนย์กลางและมวลมากที่สุดในระบบสุริยะ',
        difficulty: 'easy'
      },
      {
        id: 'sci-6',
        question: 'ในระบบนิเวศ สิ่งมีชีวิตกลุ่มใดทำหน้าที่เป็น "ผู้ย่อยสลายสารอินทรีย์" (Decomposers)?',
        options: ['พืชสีเขียวและสาหร่าย', 'เห็ด รา และแบคทีเรียบางชนิด', 'สัตว์กินพืชและสัตว์กินเนื้อ', 'หนอนและแมลงวัน'],
        correct_answer: 1,
        explanation: 'เห็ด รา และแบคทีเรียจะหลั่งเอนไซม์ออกมาย่อยสลายซากสิ่งมีชีวิตให้เป็นแร่ธาตุคืนกลับสู่ดินและวัฏจักรสาร',
        difficulty: 'medium'
      },
      {
        id: 'sci-7',
        question: 'คลื่นชนิดใดต่อไปนี้จัดเป็น "คลื่นกล" ที่ต้องอาศัยตัวกลางในการแผ่กระจาย?',
        options: ['คลื่นแสง', 'คลื่นเสียง', 'คลื่นวิทยุ', 'รังสีเอกซ์'],
        correct_answer: 1,
        explanation: 'คลื่นเสียงต้องอาศัยการสั่นของโมเลกุลตัวกลาง (ของแข็ง ของเหลว หรือแก๊ส) ในการส่งผ่านพลังงาน จึงไม่สามารถเดินทางในสุญญากาศได้',
        difficulty: 'medium'
      },
      {
        id: 'sci-8',
        question: 'ธาตุใดต่อไปนี้จัดเป็น "ก๊าซเฉื่อย" (Noble Gas) ในหมู่ 18 ของตารางธาตุ?',
        options: ['คลอรีน (Cl)', 'ฮีเลียม (He)', 'ออกซิเจน (O)', 'ไนโตรเจน (N)'],
        correct_answer: 1,
        explanation: 'ฮีเลียม (He) มีการจัดเรียงอิเล็กตรอนเต็มวงนอกสุด มีความเสถียรสูงมากและไม่ว่องไวในการเกิดปฏิกิริยาเคมี',
        difficulty: 'easy'
      },
      {
        id: 'sci-9',
        question: 'การถ่ายทอดลักษณะทางพันธุกรรมตามกฎของเมนเดล อัตราส่วนฟีโนไทป์ในรุ่น F2 ของการผสมแบบ Monohybrid Cross คือเท่าใด?',
        options: ['1 : 1', '3 : 1', '9 : 3 : 3 : 1', '1 : 2 : 1'],
        correct_answer: 1,
        explanation: 'การผสมลักษณะเด่นกับด้อยในรุ่น F1 (Aa x Aa) จะให้ฟีโนไทป์ลักษณะเด่นต่อด้อยในรุ่น F2 เท่ากับ 3 : 1',
        difficulty: 'medium'
      },
      {
        id: 'sci-10',
        question: 'การหายใจระดับเซลล์แบบใช้ออกซิเจน ขั้นตอนใดที่ผลิตโมเลกุล ATP ได้ในปริมาณมากที่สุด?',
        options: ['ไกลโคไลซิส (Glycolysis)', 'วัฏจักรเครบส์ (Krebs cycle)', 'ระบบถ่ายทอดอิเล็กตรอน (Electron Transport Chain)', 'การหมักแอลกอฮอล์'],
        correct_answer: 2,
        explanation: 'ระบบถ่ายทอดอิเล็กตรอนที่เยื่อหุ้มชั้นในของไมโทคอนเดรียสามารถสร้าง ATP ได้มากที่สุดถึงประมาณ 28-32 ATP ต่อหนึ่งโมเลกุลกลูโคส',
        difficulty: 'hard'
      }
    ]
  },

  'ภาษาไทย': {
    topic: 'หลักภาษา วรรณคดีไทย สำนวน และไวยากรณ์',
    questions: [
      {
        id: 'th-1',
        question: 'ข้อใดเป็นคำสมาสที่มีการ "สนธิ" อย่างถูกต้อง?',
        options: ['ผลไม้', 'ธันวาคม', 'รถไฟ', 'ราชการ'],
        correct_answer: 1,
        explanation: 'ธันวาคม มาจาก ธนุ + อาคม เชื่อมเสียงสระเป็น ธันวาคม จัดเป็นคำสมาสแบบมีสนธิ',
        difficulty: 'medium'
      },
      {
        id: 'th-2',
        question: 'คำราชาศัพท์ข้อใดหมายถึง "ดวงตา" ของพระมหากษัตริย์?',
        options: ['พระเนตร', 'พระกรรณ', 'พระนาสิก', 'พระโอษฐ์'],
        correct_answer: 0,
        explanation: 'พระเนตร = ตา, พระกรรณ = หู, พระนาสิก = จมูก, พระโอษฐ์ = ปาก',
        difficulty: 'easy'
      },
      {
        id: 'th-3',
        question: 'สำนวนใดมีความหมายตรงกับ "การพูดเตือนสติหรือสอนผู้ที่มีความรู้ความชำนาญอยู่แล้ว"?',
        options: ['ขี่ช้างจับตั๊กแตน', 'สอนจระเข้ว่ายน้ำ', 'จับปลาสองมือ', 'ตำน้ำพริกละลายแม่น้ำ'],
        correct_answer: 1,
        explanation: 'สอนจระเข้ว่ายน้ำ หมายถึง การไปสั่งสอนหรือแนะนำผู้ที่มีความเชี่ยวชาญในเรื่องนั้นๆ อยู่แล้ว',
        difficulty: 'easy'
      },
      {
        id: 'th-4',
        question: 'ข้อใดจัดเป็น "ประโยคความซ้อน" (สังกรประโยค)?',
        options: ['ครูและนักเรียนไปทัศนศึกษา', 'ฉันอ่านหนังสือขณะที่ฝนกำลังตกหนัก', 'เขาวิ่งออกกำลังกายทุกเช้า', 'พี่ชอบกินข้าวผัดแต่น้องชอบก๋วยเตี๋ยว'],
        correct_answer: 1,
        explanation: 'มีประโยคหลักคือ "ฉันอ่านหนังสือ" และมีประโยคย่อย "ขณะที่ฝนกำลังตกหนัก" เชื่อมด้วยสันธาน จึงเป็นประโยคความซ้อน',
        difficulty: 'medium'
      },
      {
        id: 'th-5',
        question: 'โคลงสี่สุภาพ 1 บท กำหนดให้มีคำเอกกี่แห่ง และคำโทกี่แห่ง?',
        options: ['เอก 4 โท 4', 'เอก 7 โท 4', 'เอก 5 โท 6', 'เอก 6 โท 5'],
        correct_answer: 1,
        explanation: 'ผังฉันทลักษณ์ของโคลงสี่สุภาพ 1 บท บังคับ เอก 7 แห่ง และ โท 4 แห่ง',
        difficulty: 'medium'
      },
      {
        id: 'th-6',
        question: 'ข้อใดเป็นคำที่ยืมมาจากภาษาบาลี-สันสกฤตทั้งหมด?',
        options: ['เก้าอี้, โต๊ะ', 'บิดา, มารดา, ภริยา', 'ก๋วยเตี๋ยว, บะหมี่', 'เค้ก, คอนโด'],
        correct_answer: 1,
        explanation: 'บิดา มารดา ภริยา เป็นคำยืมจากภาษาบาลีและสันสกฤต',
        difficulty: 'easy'
      },
      {
        id: 'th-7',
        question: 'รสวรรณคดีไทยที่แสดงความโศกเศร้า คร่ำครวญ อาลัยอาวรณ์ เรียกว่ารสใด?',
        options: ['เสาวรจนี', 'นารีปราโมทย์', 'พิโรธวาทัง', 'สัลลาปังคพิสัย'],
        correct_answer: 3,
        explanation: 'สัลลาปังคพิสัย หมายถึง บทแสดงความเศร้าโศก คร่ำครวญ หรืออาลัยรัก',
        difficulty: 'medium'
      },
      {
        id: 'th-8',
        question: 'ข้อใดใช้ลักษณนามของ "ช้างบ้าน" ได้ถูกต้องตามหลักภาษาไทย?',
        options: ['ตัว', 'เชือก', 'ช้าง', 'ตน'],
        correct_answer: 1,
        explanation: 'ช้างบ้านหรือช้างเลี้ยงใช้ลักษณนามว่า "เชือก" ส่วนช้างป่าใช้ "ตัว" และช้างขึ้นระวางใช้ "ช้าง"',
        difficulty: 'easy'
      },
      {
        id: 'th-9',
        question: 'ในวรรณคดีเรื่อง "รามเกียรติ์" ทศกัณฐ์ครองเมืองใด?',
        options: ['เมืองอโยธยา', 'เมืองขีดขิน', 'เมืองลงกา', 'เมืองมิถิลา'],
        correct_answer: 2,
        explanation: 'ทศกัณฐ์เป็นพญายักษ์ผู้ครองกรุงลงกา',
        difficulty: 'easy'
      },
      {
        id: 'th-10',
        question: 'คำว่า "กระเป๋า, พลอย, ปากกา" จัดเป็นคำชนิดใดในภาษาไทย?',
        options: ['คำสรรพนาม', 'คำนาม', 'คำกริยา', 'คำวิเศษณ์'],
        correct_answer: 1,
        explanation: 'คำนาม คือ คำที่ใช้เรียกชื่อคน สัตว์ สิ่งของ สถานที่ หรือสิ่งที่เป็นนามธรรม',
        difficulty: 'easy'
      }
    ]
  },

  'ภาษาอังกฤษ': {
    topic: 'English Grammar, Vocabulary, Reading & Idioms',
    questions: [
      {
        id: 'eng-1',
        question: 'If she _______ hard, she will pass the entrance examination with top scores.',
        options: ['study', 'studies', 'studied', 'had studied'],
        correct_answer: 1,
        explanation: 'First Conditional: If + Present Simple (Subject + V.1 es/s), Subject + will + V.inf',
        difficulty: 'easy'
      },
      {
        id: 'eng-2',
        question: 'The famous ancient citadel _______ by the kingdom warriors in 1542.',
        options: ['was built', 'is built', 'built', 'has built'],
        correct_answer: 0,
        explanation: 'Passive Voice in Past Simple tense: was/were + V.3 (was built) because the event happened in 1542.',
        difficulty: 'medium'
      },
      {
        id: 'eng-3',
        question: 'The idiom "Piece of cake" means which of the following?',
        options: ['Something sweet and delicious', 'Something very easy to do', 'A difficult challenge', 'Sharing food with friends'],
        correct_answer: 1,
        explanation: '"Piece of cake" is an idiom describing a task that is effortless or very simple.',
        difficulty: 'easy'
      },
      {
        id: 'eng-4',
        question: 'Neither the brave knight nor the royal guards _______ able to open the locked dragon gate.',
        options: ['was', 'were', 'is', 'are'],
        correct_answer: 1,
        explanation: 'With "Neither... nor...", the verb agrees with the closer subject ("the royal guards" is plural -> were).',
        difficulty: 'hard'
      },
      {
        id: 'eng-5',
        question: 'I have lived in this magical academy _______ five years.',
        options: ['since', 'for', 'during', 'from'],
        correct_answer: 1,
        explanation: 'We use "for" to indicate a duration/period of time (for five years). "Since" is used for a starting point.',
        difficulty: 'easy'
      },
      {
        id: 'eng-6',
        question: 'Which word is the closest SYNONYM of "Magnificent"?',
        options: ['Terrible', 'Splendid', 'Boring', 'Tiny'],
        correct_answer: 1,
        explanation: '"Magnificent" means extremely impressive, beautiful, or grand, matching "Splendid".',
        difficulty: 'medium'
      },
      {
        id: 'eng-7',
        question: 'By the time the teacher entered the classroom, the students _______ their assignment.',
        options: ['finish', 'finished', 'had finished', 'have finished'],
        correct_answer: 2,
        explanation: 'Past Perfect (had + V.3) indicates an action completed before another past event ("entered").',
        difficulty: 'medium'
      },
      {
        id: 'eng-8',
        question: 'You _______ wear a helmet when riding a motorcycle to protect your head.',
        options: ['must', 'might', 'would', 'could'],
        correct_answer: 0,
        explanation: '"Must" expresses a strong necessity, obligation, or legal rule for safety.',
        difficulty: 'easy'
      },
      {
        id: 'eng-9',
        question: 'Which sentence demonstrates the correct use of a Relative Pronoun?',
        options: [
          'The scholar which solved the puzzle was rewarded.',
          'The scholar who solved the puzzle was rewarded.',
          'The scholar whose solved the puzzle was rewarded.',
          'The scholar where solved the puzzle was rewarded.'
        ],
        correct_answer: 1,
        explanation: 'Use "who" as the relative pronoun for people performing an action in the clause.',
        difficulty: 'easy'
      },
      {
        id: 'eng-10',
        question: 'What is the correct reported speech for: He said, "I am studying for the quiz."?',
        options: [
          'He said that he was studying for the quiz.',
          'He said that he is studying for the quiz.',
          'He said that I was studying for the quiz.',
          'He said that he had studied for the quiz.'
        ],
        correct_answer: 0,
        explanation: 'In indirect speech, the present continuous ("am studying") shifts back to past continuous ("was studying").',
        difficulty: 'medium'
      }
    ]
  },

  'สังคมศึกษา': {
    topic: 'หน้าที่พลเมือง กฎหมาย รัฐธรรมนูญ และเศรษฐศาสตร์',
    questions: [
      {
        id: 'soc-1',
        question: 'กฎหมายสูงสุดในการปกครองประเทศของไทยคือข้อใด?',
        options: ['พระราชบัญญัติ', 'ประมวลกฎหมายแพ่งและพาณิชย์', 'รัฐธรรมนูญแห่งราชอาณาจักรไทย', 'พระราชกำหนด'],
        correct_answer: 2,
        explanation: 'รัฐธรรมนูญเป็นกฎหมายลำดับสูงสุดในการปกครองประเทศ กฎหมายอื่นใดจะขัดหรือแย้งไม่ได้',
        difficulty: 'easy'
      },
      {
        id: 'soc-2',
        question: 'อำนาจอธิปไตยตามหลักการประชาธิปไตยของไทยแบ่งออกเป็น 3 ฝ่าย ได้แก่ข้อใด?',
        options: [
          'นิติบัญญัติ, บริหาร, ตุลาการ',
          'ทหาร, พลเรือน, ตำรวจ',
          'กระทรวงการคลัง, มหาดไทย, ศึกษาธิการ',
          'ผู้ว่าราชการ, นายอำเภอ, กำนัน'
        ],
        correct_answer: 0,
        explanation: 'อำนาจอธิปไตยแบ่งออกเป็น 3 ฝ่ายคือ ฝ่ายนิติบัญญัติ (รัฐสภา), ฝ่ายบริหาร (คณะรัฐมนตรี), และฝ่ายตุลาการ (ศาล)',
        difficulty: 'easy'
      },
      {
        id: 'soc-3',
        question: 'เมื่อราคาสินค้าสูงขึ้น ปริมาณความต้องการซื้อของผู้บริโภคจะลดลง หลักการนี้เรียกว่าอะไร?',
        options: ['กฎของอุปทาน (Law of Supply)', 'กฎของอุปสงค์ (Law of Demand)', 'ดุลยภาพตลาด', 'การผูกขาดทางการค้า'],
        correct_answer: 1,
        explanation: 'กฎของอุปสงค์ระบุว่า ปริมาณซื้อจะแปรผกผันกับราคาสินค้า หากราคาสูงขึ้น ผู้บริโภคจะซื้อน้อยลง',
        difficulty: 'easy'
      },
      {
        id: 'soc-4',
        question: 'บุคคลจะมีสภาพบุคคลเริ่มต้นขึ้นและสิ้นสุดลงเมื่อใดตามกฎหมายแพ่ง?',
        options: ['เมื่อคลอดและอยู่รอดเป็นทารก สิ้นสุดเมื่อตาย', 'เมื่อตั้งครรภ์ สิ้นสุดเมื่ออายุ 60 ปี', 'เมื่อบรรลุนิติภาวะ สิ้นสุดเมื่อหมดลมหายใจ', 'เมื่อทำบัตรประชาชน สิ้นสุดเมื่อตาย'],
        correct_answer: 0,
        explanation: 'ประมวลกฎหมายแพ่งและพาณิชย์ มาตรา 15 สภาพบุคคลย่อมเริ่มแต่เมื่อคลอดแล้วอยู่รอดเป็นทารก และสิ้นสุดลงด้วยความตาย',
        difficulty: 'medium'
      },
      {
        id: 'soc-5',
        question: 'สิทธิมนุษยชนขั้นพื้นฐานได้รับการรับรองอย่างเป็นทางการในระดับสากลผ่านปฏิญญาใด?',
        options: ['ปฏิญญาสากลว่าด้วยสิทธิมนุษยชน (UDHR)', 'สนธิสัญญาแวร์ซาย', 'พิธีสารเกียวโต', 'ข้อตกลงปารีส'],
        correct_answer: 0,
        explanation: 'สมัชชาใหญ่แห่งสหประชาชาติได้รับรองปฏิญญาสากลว่าด้วยสิทธิมนุษยชน (UDHR) เมื่อปี ค.ศ. 1948 เพื่อคุ้มครองศักดิ์ศรีความเป็นมนุษย์',
        difficulty: 'medium'
      },
      {
        id: 'soc-6',
        question: 'ภาวะ "เงินเฟ้อ" (Inflation) ส่งผลกระทบโดยตรงอย่างไรต่อระบบเศรษฐกิจ?',
        options: ['ค่าครองชีพลดลง ราคาสินค้าถูกลง', 'ราคาสินค้าและบริการโดยทั่วไปสูงขึ้น อำนาจซื้อของเงินลดลง', 'อัตราดอกเบี้ยเป็นศูนย์', 'ประชาชนมีเงินออมเพิ่มขึ้นอย่างรวดเร็ว'],
        correct_answer: 1,
        explanation: 'เงินเฟ้อคือภาวะที่ระดับราคาสินค้าและบริการโดยเฉลี่ยเพิ่มสูงขึ้นอย่างต่อเนื่อง ทำให้เงินจำนวนเดิมซื้อของได้น้อยลง',
        difficulty: 'medium'
      },
      {
        id: 'soc-7',
        question: 'ภาษีประเภทใดที่ผู้บริโภคต้องจ่ายเมื่อซื้อสินค้าในชีวิตประจำวันในอัตราร้อยละ 7?',
        options: ['ภาษีเงินได้นิติบุคคล', 'ภาษีมูลค่าเพิ่ม (VAT)', 'ภาษีที่ดินและสิ่งปลูกสร้าง', 'ภาษีศุลกากร'],
        correct_answer: 1,
        explanation: 'ภาษีมูลค่าเพิ่ม (Value Added Tax: VAT) จัดเก็บจากการขายสินค้าหรือการให้บริการในแต่ละขั้นตอน',
        difficulty: 'easy'
      },
      {
        id: 'soc-8',
        question: 'สถาบันทางสังคมใดถือเป็นสถาบันแรกและมีความสำคัญพื้นฐานที่สุดในการขัดเกลาทางสังคม?',
        options: ['สถาบันการศึกษา', 'สถาบันครอบครัว', 'สถาบันการเมือง', 'สถาบันสื่อมวลชน'],
        correct_answer: 1,
        explanation: 'สถาบันครอบครัวเป็นหน่วยทางสังคมแรกที่ให้กำเนิด เลี้ยงดู และถ่ายทอดค่านิยมวัฒนธรรมแก่สมาชิก',
        difficulty: 'easy'
      },
      {
        id: 'soc-9',
        question: 'สหประชาชาติ (UN) ก่อตั้งขึ้นหลังสิ้นสุดสงครามใด โดยมีเป้าหมายหลักเพื่อรักษาสันติภาพโลก?',
        options: ['สงครามเย็น', 'สงครามโลกครั้งที่ 1', 'สงครามโลกครั้งที่ 2', 'สงครามอ่าวเปอร์เซีย'],
        correct_answer: 2,
        explanation: 'องค์การสหประชาชาติได้รับการสถาปนาขึ้นในปี ค.ศ. 1945 หลังสิ้นสุดสงครามโลกครั้งที่สอง เพื่อป้องกันการเกิดสงครามระดับโลกซ้ำอีก',
        difficulty: 'easy'
      },
      {
        id: 'soc-10',
        question: 'หลักปรัชญา "เศรษฐกิจพอเพียง" มีองค์ประกอบสำคัญ 3 ห่วง ได้แก่ข้อใด?',
        options: [
          'พอประมาณ, มีเหตุผล, มีภูมิคุ้มกันในตัวที่ดี',
          'ประหยัด, อดออม, มั่นคง',
          'ขยัน, ซื่อสัตย์, อดทน',
          'ร่ำรวย, ทันสมัย, ก้าวหน้า'
        ],
        correct_answer: 0,
        explanation: 'ปรัชญาเศรษฐกิจพอเพียงประกอบด้วย 3 คุณลักษณะ: ความพอประมาณ ความมีเหตุผล และการมีภูมิคุ้มกันที่ดี ภายใต้เงื่อนไขความรู้และคุณธรรม',
        difficulty: 'easy'
      }
    ]
  },

  'ประวัติศาสตร์': {
    topic: 'ประวัติศาสตร์ไทยและอารยธรรมโลกที่สำคัญ',
    questions: [
      {
        id: 'his-1',
        question: 'พระมหากษัตริย์พระองค์ใดทรงประกาศอิสรภาพของกรุงศรีอยุธยาจากพม่า ณ เมืองแครง ในปี พ.ศ. 2127?',
        options: ['สมเด็จพระนเรศวรมหาราช', 'สมเด็จพระเอกาทศรถ', 'สมเด็จพระนารายณ์มหาราช', 'สมเด็จพระเจ้าตากสินมหาราช'],
        correct_answer: 0,
        explanation: 'สมเด็จพระนเรศวรมหาราชทรงหลั่งน้ำทักษิโณทกประกาศอิสรภาพ ณ เมืองแครง ในปี พ.ศ. 2127',
        difficulty: 'easy'
      },
      {
        id: 'his-2',
        question: 'การปฏิรูปการบริหารราชการแผ่นดินและการเลิกทาสในสยาม เกิดขึ้นในรัชสมัยใด?',
        options: ['พระบาทสมเด็จพระจอมเกล้าเจ้าอยู่หัว (ร.4)', 'พระบาทสมเด็จพระจุลจอมเกล้าเจ้าอยู่หัว (ร.5)', 'พระบาทสมเด็จพระมงกุฎเกล้าเจ้าอยู่หัว (ร.6)', 'พระบาทสมเด็จพระปกเกล้าเจ้าอยู่หัว (ร.7)'],
        correct_answer: 1,
        explanation: 'รัชกาลที่ 5 ทรงปฏิรูปการปกครองสู่ระบบกระทรวง เลิกทาส เลิกไพร่ และพัฒนาประเทศสู่ความทันสมัยทัดเทียมตะวันตก',
        difficulty: 'easy'
      },
      {
        id: 'his-3',
        question: 'สนธิสัญญาเบาว์ริง (Bowring Treaty) ทำขึ้นในปี พ.ศ. 2398 ระหว่างสยามกับชาติมหาอำนาจใด?',
        options: ['ฝรั่งเศส', 'สหราชอาณาจักร (อังกฤษ)', 'สหรัฐอเมริกา', 'โปรตุเกส'],
        correct_answer: 1,
        explanation: 'เซอร์จอห์น เบาว์ริง เป็นราชทูตจากสหราชอาณาจักรเดินทางเข้ามาเจรจาทำสนธิสัญญาทางพระราชไมตรีและการค้าเสรีในสมัย ร.4',
        difficulty: 'medium'
      },
      {
        id: 'his-4',
        question: 'การเปลี่ยนแปลงการปกครองของสยามจากระบอบสมบูรณาญาสิทธิราชย์สู่ระบอบประชาธิปไตยเกิดขึ้นในปีใด?',
        options: ['พ.ศ. 2470', 'พ.ศ. 2475', 'พ.ศ. 2482', 'พ.ศ. 2490'],
        correct_answer: 1,
        explanation: 'คณะราษฎรทำการเปลี่ยนแปลงการปกครองเมื่อวันที่ 24 มิถุนายน พ.ศ. 2475 ในรัชสมัยพระบาทสมเด็จพระปกเกล้าเจ้าอยู่หัว (ร.7)',
        difficulty: 'easy'
      },
      {
        id: 'his-5',
        question: 'อารยธรรมโบราณแรกเริ่มของโลกที่กำเนิดขึ้นในดินแดนลุ่มแม่น้ำไทกริส-ยูเฟรทีส คืออารยธรรมใด?',
        options: ['อารยธรรมลุ่มแม่น้ำไนล์', 'อารยธรรมเมโสโปเตเมีย', 'อารยธรรมลุ่มแม่น้ำสินธุ', 'อารยธรรมลุ่มแม่น้ำฮวงโห'],
        correct_answer: 1,
        explanation: 'อารยธรรมเมโสโปเตเมีย (ปัจจุบันคือบริเวณประเทศอิรัก) กำเนิดขึ้นระหว่างแม่น้ำไทกริสและยูเฟรทีส โดยชาวสุเมเรียน',
        difficulty: 'medium'
      },
      {
        id: 'his-6',
        question: 'ศิลาจารึกสุโขทัยหลักที่ 1 ถูกสร้างขึ้นในรัชกาลของพระมหากษัตริย์พระองค์ใด?',
        options: ['พ่อขุนศรีอินทราทิตย์', 'พ่อขุนรามคำแหงมหาราช', 'พระมหาธรรมราชาที่ 1 (ลิไทย)', 'พ่อขุนบานเมือง'],
        correct_answer: 1,
        explanation: 'พ่อขุนรามคำแหงมหาราชทรงประดิษฐ์อักษรไทยขึ้นในปี พ.ศ. 1826 และจารึกเรื่องราวบนศิลาจารึกหลักที่ 1',
        difficulty: 'easy'
      },
      {
        id: 'his-7',
        question: 'ยุคฟื้นฟูศิลปวิทยาการ (Renaissance) ในทวีปยุโรปเริ่มต้นขึ้นที่ประเทศใดเป็นแห่งแรก?',
        options: ['อังกฤษ', 'ฝรั่งเศส', 'อิตาลี', 'เยอรมนี'],
        correct_answer: 2,
        explanation: 'ยุคเรอเนซองส์เริ่มต้นขึ้นในคาบสมุทรอิตาลี โดยเฉพาะนครรัฐฟลอเรนซ์และเวนิส ก่อนจะแพร่หลายทั่วยุโรป',
        difficulty: 'medium'
      },
      {
        id: 'his-8',
        question: 'กรุงศรีอยุธยาดำรงความเป็นราชธานีของสยามเป็นเวลายาวนานกี่ปี?',
        options: ['150 ปี', '200 ปี', '417 ปี', '500 ปี'],
        correct_answer: 2,
        explanation: 'กรุงศรีอยุธยาสถาปนาขึ้นในปี พ.ศ. 1893 และเสียกรุงครั้งที่ 2 ในปี พ.ศ. 2310 รวมระยะเวลา 417 ปี',
        difficulty: 'easy'
      },
      {
        id: 'his-9',
        question: 'ชนวนเหตุสำคัญของการเริ่มต้นสงครามโลกครั้งที่ 1 คือเหตุการณ์ใด?',
        options: [
          'การบุกยึดโปแลนด์ของกองทัพเยอรมัน',
          'การลอบปลงพระชนม์อาร์ชดยุกฟรันซ์ แฟร์ดีนันท์ แห่งออสเตรีย',
          'การทิ้งระเบิดถล่มอ่าวเพิร์ลฮาร์เบอร์',
          'การปฏิวัติบอลเชวิคในรัสเซีย'
        ],
        correct_answer: 1,
        explanation: 'การลอบปลงพระชนม์อาร์ชดยุกฟรันซ์ แฟร์ดีนันท์ ณ เมืองซาราเยโว ในปี 1914 เป็นจุดชนวนให้มหาอำนาจประกาศสงครามต่อกัน',
        difficulty: 'medium'
      },
      {
        id: 'his-10',
        question: 'สมเด็จพระเจ้าตากสินมหาราชทรงสถาปนาราชธานีแห่งใหม่ขึ้นที่ใดหลังกอบกู้เอกราชสำเร็จ?',
        options: ['กรุงรัตนโกสินทร์', 'กรุงธนบุรี', 'เมืองพิษณุโลก', 'เมืองลพบุรี'],
        correct_answer: 1,
        explanation: 'หลังกอบกู้เอกราชจากพม่าในปี พ.ศ. 2310 พระองค์ทรงสถาปนากรุงธนบุรีเป็นราชธานีเนื่องจากมีชัยภูมิที่ดีริมแม่น้ำเจ้าพระยา',
        difficulty: 'easy'
      }
    ]
  },

  'ภูมิศาสตร์': {
    topic: 'ภูมิศาสตร์กายภาพ แผนที่ สภาพอากาศ และสิ่งแวดล้อม',
    questions: [
      {
        id: 'geo-1',
        question: 'เส้นสมมติในแนวนอนที่แบ่งโลกออกเป็นซีกโลกเหนือและซีกโลกใต้ มีชื่อเรียกว่าอะไร?',
        options: ['เส้นเมริเดียนปฐม', 'เส้นศูนย์สูตร (Equator)', 'เส้นทรอปิกออฟแคนเซอร์', 'เส้นเมริเดียน 180 องศา'],
        correct_answer: 1,
        explanation: 'เส้นศูนย์สูตร (ละติจูด 0 องศา) เป็นเส้นสมมติที่แบ่งซีกโลกออกเป็นซีกโลกเหนือและซีกโลกใต้อย่างละครึ่ง',
        difficulty: 'easy'
      },
      {
        id: 'geo-2',
        question: 'ลมมรสุมชนิดใดที่พัดผ่านประเทศไทยทำให้เกิดฤดูฝนและความชุ่มชื้นทั่วทุกภาค?',
        options: [
          'ลมมรสุมตะวันออกเฉียงเหนือ',
          'ลมมรสุมตะวันตกเฉียงใต้',
          'ลมสินค้าตะวันออก',
          'ลมบกและลมทะเล'
        ],
        correct_answer: 1,
        explanation: 'ลมมรสุมตะวันตกเฉียงใต้พัดพาไอน้ำและความชื้นจากมหาสมุทรอินเดียเข้ามาปกคลุมไทยในช่วงเดือนพฤษภาคม-ตุลาคม',
        difficulty: 'easy'
      },
      {
        id: 'geo-3',
        question: 'ปรากฏการณ์ "เอลนีโญ" (El Niño) ส่งผลกระทบต่อสภาพภูมิอากาศในภูมิภาคเอเชียตะวันออกเฉียงใต้อย่างไร?',
        options: [
          'เกิดพายุฝนตกหนักและน้ำท่วมฉับพลันอย่างรุนแรง',
          'เกิดภาวะแห้งแล้งผิดปกติ ปริมาณฝนลดลง และอุณหภูมิสูงขึ้น',
          'เกิดหิมะตกในเขตร้อน',
          'ไม่มีผลกระทบใดๆ'
        ],
        correct_answer: 1,
        explanation: 'เอลนีโญเกิดจากผิวน้ำทะเลทางตะวันออกของแปซิฟิกอุ่นขึ้น ส่งผลให้ฝั่งเอเชียตะวันออกเฉียงใต้และออสเตรเลียเผชิญภัยแล้งและฝนทิ้งช่วง',
        difficulty: 'medium'
      },
      {
        id: 'geo-4',
        question: 'แม่น้ำสายใดมีความยาวมากที่สุดในทวีปเอเชียตะวันออกเฉียงใต้ และไหลผ่าน 6 ประเทศ?',
        options: ['แม่น้ำเจ้าพระยา', 'แม่น้ำอิรวดี', 'แม่น้ำโขง', 'แม่น้ำแดง'],
        correct_answer: 2,
        explanation: 'แม่น้ำโขงมีความยาวประมาณ 4,909 กิโลเมตร มีต้นกำเนิดจากที่ราบสูงทิเบต ไหลผ่านจีน พม่า ลาว ไทย กัมพูชา และเวียดนาม',
        difficulty: 'easy'
      },
      {
        id: 'geo-5',
        question: 'ชั้นบรรยากาศใดที่มีก๊าซโอโซนหนาแน่น ช่วยดูดกลืนรังสีอัลตราไวโอเลต (UV) จากดวงอาทิตย์?',
        options: ['โทรโพสเฟียร์', 'สตราโทสเฟียร์', 'มีโซสเฟียร์', 'เทอร์โมสเฟียร์'],
        correct_answer: 1,
        explanation: 'ชั้นสตราโทสเฟียร์ (Stratosphere) มีชั้นโอโซน (Ozone layer) ทำหน้าที่เสมือนโล่กรองรังสี UV ที่เป็นอันตรายต่อสิ่งมีชีวิต',
        difficulty: 'medium'
      },
      {
        id: 'geo-6',
        question: 'แนวเทือกเขาหิมาลัยและยอดเขาเอเวอเรสต์เกิดขึ้นจากการเคลื่อนที่ชนกันของแผ่นเปลือกโลกใด?',
        options: [
          'แผ่นอินเดีย ชนกับ แผ่นยูเรเชีย',
          'แผ่นแปซิฟิก ชนกับ แผ่นอเมริกาเหนือ',
          'แผ่นแอฟริกา ชนกับ แผ่นแอนตาร์กติก',
          'แผ่นนาซกา ชนกับ แผ่นอเมริกาใต้'
        ],
        correct_answer: 0,
        explanation: 'การเคลื่อนที่เข้าหากันและชนกันระหว่างแผ่นเปลือกโลกอินเดียกับยูเรเชีย ดันให้ชั้นหินโก่งตัวขึ้นกลายเป็นเทือกเขาหิมาลัย',
        difficulty: 'medium'
      },
      {
        id: 'geo-7',
        question: 'บริเวณที่เกิดแผ่นดินไหวและภูเขาไฟระเบิดบ่อยที่สุดในโลกตามแนวขอบมหาสมุทรแปซิฟิก เรียกว่าอะไร?',
        options: ['รอยเลื่อนแซนแอนเดรอัส', 'วงแหวนแห่งไฟ (Ring of Fire)', 'สามเหลี่ยมเบอร์มิวดา', 'ร่องลึกก้นสมุทรมาเรียนา'],
        correct_answer: 1,
        explanation: 'วงแหวนแห่งไฟ (Ring of Fire) เป็นแนวรอยต่อของแผ่นเปลือกโลกรูปเกือกม้า เกิดแผ่นดินไหวถึง 90% ของโลก',
        difficulty: 'easy'
      },
      {
        id: 'geo-8',
        question: 'ระบบสารสนเทศภูมิศาสตร์ที่ใช้คอมพิวเตอร์จัดเก็บ วิเคราะห์ และแสดงผลข้อมูลเชิงพื้นที่ มีชื่อย่อว่าอะไร?',
        options: ['GPS', 'GIS', 'CCTV', 'NASA'],
        correct_answer: 1,
        explanation: 'GIS ย่อมาจาก Geographic Information System คือระบบสารสนเทศภูมิศาสตร์ที่นำข้อมูลแผนที่และข้อมูลสถิติมาซ้อนทับเพื่อวิเคราะห์',
        difficulty: 'easy'
      },
      {
        id: 'geo-9',
        question: 'ยอดเขาที่สูงที่สุดในประเทศไทยคือยอดเขาใด และตั้งอยู่ในจังหวัดอะไร?',
        options: ['ดอยหลวงเชียงดาว จ.เชียงใหม่', 'ดอยอินทนนท์ จ.เชียงใหม่', 'ภูกระดึง จ.เลย', 'เขาหลวง จ.นครศรีธรรมราช'],
        correct_answer: 1,
        explanation: 'ดอยอินทนนท์ ในจังหวัดเชียงใหม่ มีความสูง 2,565 เมตรจากระดับน้ำทะเลปานกลาง จัดเป็นยอดเขาที่สูงที่สุดในไทย',
        difficulty: 'easy'
      },
      {
        id: 'geo-10',
        question: 'เวลามาตรฐานสากลอ้างอิงจากเวลาปานกลางกรีนิช (GMT) ประเทศไทยมีเวลาเร็วกว่าเวลามาตรฐานกรีนิชกี่ชั่วโมง?',
        options: ['+5 ชั่วโมง', '+6 ชั่วโมง', '+7 ชั่วโมง', '+8 ชั่วโมง'],
        correct_answer: 2,
        explanation: 'ประเทศไทยตั้งอยู่ที่ลองจิจูดประมาณ 105 องศาตะวันออก ทำให้เวลามาตรฐานของไทยเร็วกว่ากรีนิช 7 ชั่วโมง (UTC+7)',
        difficulty: 'easy'
      }
    ]
  },

  'เกษตรและการงาน': {
    topic: 'การเกษตรกรรม การขยายพันธุ์พืช และงานช่างพื้นฐาน',
    questions: [
      {
        id: 'agr-1',
        question: 'การปลูกพืชแบบไฮโดรโปนิกส์ (Hydroponics) หมายถึงการปลูกพืชในลักษณะใด?',
        options: ['การปลูกพืชในดินร่วนปนทราย', 'การปลูกพืชโดยไม่ใช้ดินแต่ใช้น้ำที่มีสารละลายธาตุอาหาร', 'การปลูกพืชบนยอดไม้สูง', 'การปลูกพืชใต้ร่มเงาไม้ใหญ่'],
        correct_answer: 1,
        explanation: 'ไฮโดรโปนิกส์คือการปลูกพืชในสารละลายธาตุอาหารโดยไม่ใช้ดิน ช่วยควบคุมธาตุอาหารและประหยัดน้ำ',
        difficulty: 'easy'
      },
      {
        id: 'agr-2',
        question: 'การขยายพันธุ์พืชด้วยวิธี "การตอนกิ่ง" (Layering) เหมาะกับพืชประเภทใด?',
        options: ['พืชล้มลุก เช่น ผักบุ้ง', 'พืชไม้ยืนต้นและไม้พุ่มที่มีเนื้อไม้แข็งแรง', 'พืชน้ำ เช่น ผักตบชวา', 'เห็ดและรา'],
        correct_answer: 1,
        explanation: 'การตอนกิ่งนิยมทำกับไม้ยืนต้นหรือไม้พุ่มที่มีเนื้อไม้แข็งแรง เช่น มะนาว ฝรั่ง ส้ม เพื่อให้ได้ต้นใหม่ที่มีลักษณะตรงตามพันธุ์เดิม',
        difficulty: 'medium'
      },
      {
        id: 'agr-3',
        question: 'ค่า pH ของดินที่เหมาะสมที่สุดสำหรับการเจริญเติบโตของพืชเศรษฐกิจทั่วไปอยู่ในช่วงใด?',
        options: ['pH 3.0 - 4.5 (กรดจัด)', 'pH 6.0 - 7.0 (กรดอ่อนถึงเป็นกลาง)', 'pH 8.5 - 10.0 (เบสแก่)', 'pH 1.0 - 2.0'],
        correct_answer: 1,
        explanation: 'ช่วง pH 6.0 - 7.0 พืชจะสามารถดูดซึมธาตุอาหารหลัก (N, P, K) และธาตุอาหารรองได้มีประสิทธิภาพสูงสุด',
        difficulty: 'medium'
      },
      {
        id: 'agr-4',
        question: 'ปุ๋ยเคมีสูตร 15-15-15 ตัวเลข 15 ตัวแรกหมายถึงธาตุอาหารชนิดใด?',
        options: ['ฟอสฟอรัส (P)', 'โพแทสเซียม (K)', 'ไนโตรเจน (N)', 'แคลเซียม (Ca)'],
        correct_answer: 2,
        explanation: 'สูตรปุ๋ยเรียงตามลำดับ N - P - K ดังนั้น 15 ตัวแรกคือ ไนโตรเจน (N) ช่วยเร่งการเจริญเติบโตของใบและลำต้น',
        difficulty: 'easy'
      },
      {
        id: 'agr-5',
        question: 'เกษตรทฤษฎีใหม่ตามแนวพระราชดำริ มีการแบ่งสัดส่วนพื้นที่ออกเป็นอย่างไร?',
        options: ['30 : 30 : 30 : 10', '25 : 25 : 25 : 25', '40 : 30 : 20 : 10', '50 : 20 : 20 : 10'],
        correct_answer: 0,
        explanation: 'แบ่งพื้นที่ 100% ออกเป็น สระน้ำ 30%, ปลูกข้าว 30%, พืชไร่พืชสวน 30%, และที่อยู่อาศัย/เลี้ยงสัตว์ 10%',
        difficulty: 'easy'
      },
      {
        id: 'agr-6',
        question: 'เครื่องมือช่างชนิดใดใช้สำหรับวัดความกว้าง ความหนา และความลึกของวัตถุที่มีความละเอียดสูง?',
        options: ['ตลับเมตร', 'เวอร์เนียร์แคลิเปอร์', 'ไม้บรรทัดเหล็ก', 'ฉากเหล็ก'],
        correct_answer: 1,
        explanation: 'เวอร์เนียร์แคลิเปอร์ (Vernier Caliper) เป็นเครื่องมือวัดละเอียดสำหรับวัดขนาดทั้งภายนอก ภายใน และความลึกได้ถึงระดับ 0.05 มม.',
        difficulty: 'medium'
      },
      {
        id: 'agr-7',
        question: 'การแปรรูปอาหารด้วยวิธี "การพาสเจอไรซ์" (Pasteurization) ใช้ความร้อนในระดับใด?',
        options: [
          'ความร้อนต่ำกว่า 100 องศาเซลเซียส เพื่อทำลายจุลินทรีย์ก่อโรค',
          'ความร้อนสูงกว่า 121 องศาเซลเซียส ภายใต้ความดัน',
          'การเผาด้วยเปลวไฟโดยตรง',
          'การแช่แข็งที่ -18 องศาเซลเซียส'
        ],
        correct_answer: 0,
        explanation: 'การพาสเจอไรซ์ใช้ความร้อนต่ำกว่า 100°C (เช่น 63-72°C) เพื่อฆ่าเชื้อก่อโรคโดยยังคงรักษาคุณค่าทางอาหารและรสชาติของน้ำนมหรือน้ำผลไม้',
        difficulty: 'medium'
      },
      {
        id: 'agr-8',
        question: 'การทำปุ๋ยหมักชีวภาพ สิ่งสำคัญที่ช่วยเร่งการย่อยสลายอินทรียวัตถุคืออะไร?',
        options: ['ยาฆ่าแมลง', 'หัวเชื้อจุลินทรีย์ (EM) และกากน้ำตาล', 'เกลือแกง', 'น้ำมันพืช'],
        correct_answer: 1,
        explanation: 'หัวเชื้อจุลินทรีย์และกากน้ำตาลทำหน้าที่เป็นพลังงานและประชากรจุลินทรีย์ในการย่อยสลายเศษซากพืชให้กลายเป็นปุ๋ยหมัก',
        difficulty: 'easy'
      },
      {
        id: 'agr-9',
        question: 'ระบบน้ำหยด (Drip Irrigation) มีข้อดีที่โดดเด่นที่สุดในการทำเกษตรกรรมเรื่องใด?',
        options: ['เพิ่มความชื้นในอากาศสูงมาก', 'ประหยัดน้ำและส่งน้ำตรงถึงรากพืชอย่างมีประสิทธิภาพ', 'กำจัดวัชพืชได้หมดสิ้น', 'ทำให้ผลผลิตสุกเร็วขึ้น 2 เท่า'],
        correct_answer: 1,
        explanation: 'ระบบน้ำหยดส่งน้ำตรงสู่โคนต้นพืชทีละหยด ลดการระเหยและการสูญเสียน้ำ เหมาะกับพื้นที่แล้งหรือการเกษตรแม่นยำ',
        difficulty: 'easy'
      },
      {
        id: 'agr-10',
        question: 'ฟิวส์ (Fuse) ในวงจรไฟฟ้าทำหน้าที่เพื่อความปลอดภัยอย่างไร?',
        options: ['เพิ่มแรงดันไฟฟ้า', 'ตัดวงจรไฟฟ้าโดยอัตโนมัติเมื่อมีกระแสไฟฟ้าไหลเกิน', 'แปลงไฟฟ้ากระแสสลับเป็นกระแสตรง', 'สะสมประจุไฟฟ้า'],
        correct_answer: 1,
        explanation: 'ฟิวส์ทำจากโลหะผสมจุดหลอมเหลวต่ำ จะหลอมละลายและตัดวงจรทันทีเมื่อกระแสไฟฟ้าเกิน เพื่อป้องกันไฟไหม้หรืออุปกรณ์เสียหาย',
        difficulty: 'easy'
      }
    ]
  },

  'สุขศึกษาและพลศึกษา': {
    topic: 'สมรรถภาพทางกาย โภชนาการ การปฐมพยาบาล และสุขภาพ',
    questions: [
      {
        id: 'pe-1',
        question: 'ดัชนีมวลกาย (BMI) คำนวณได้จากสูตรใด?',
        options: [
          'น้ำหนัก (กก.) / ส่วนสูง (เมตร)²',
          'ส่วนสูง (ซม.) - 100',
          'น้ำหนัก (กก.) × ส่วนสูง (เมตร)',
          'รอบเอว (นิ้ว) / ส่วนสูง (ซม.)'
        ],
        correct_answer: 0,
        explanation: 'BMI = น้ำหนักตัว (กิโลกรัม) หารด้วย ส่วนสูง (เมตร) ยกกำลังสอง ใช้ประเมินภาวะผอม ปกติ ท้วม หรืออ้วน',
        difficulty: 'easy'
      },
      {
        id: 'pe-2',
        question: 'ขั้นตอนการปฐมพยาบาลการบาดเจ็บจากการเล่นกีฬาแบบเฉียบพลันตามหลัก R.I.C.E. ตัวอักษร "I" หมายถึงอะไร?',
        options: ['Incline (ยกสูง)', 'Ice (ประคบเย็น)', 'Injection (ฉีดยา)', 'Inhale (สูดหายใจ)'],
        correct_answer: 1,
        explanation: 'R.I.C.E. = Rest (พัก), Ice (ประคบเย็น), Compression (พันกระชับ), Elevation (ยกส่วนบาดเจ็บให้สูง)',
        difficulty: 'easy'
      },
      {
        id: 'pe-3',
        question: 'การช่วยฟื้นคืนชีพขั้นพื้นฐาน (CPR) ควรทำการกดหน้าอกด้วยอัตราความเร็วกี่ครั้งต่อนาที?',
        options: ['60 - 80 ครั้ง/นาที', '100 - 120 ครั้ง/นาที', '140 - 160 ครั้ง/นาที', '180 ครั้ง/นาที'],
        correct_answer: 1,
        explanation: 'ตามแนวทางมาตรฐานการช่วยชีวิตสากล ควรกดหน้าอกลึก 2 - 2.4 นิ้ว ด้วยอัตราความเร็ว 100 - 120 ครั้งต่อนาที',
        difficulty: 'medium'
      },
      {
        id: 'pe-4',
        question: 'สารอาหารหลักชนิดใดเป็นแหล่งพลังงานหลักที่ร่างกายนำมาใช้ในการออกกำลังกายที่มีความเข้มข้นสูง?',
        options: ['วิตามินและเกลือแร่', 'คาร์โบไฮเดรต', 'ไขมันไม่อิ่มตัว', 'โปรตีน'],
        correct_answer: 1,
        explanation: 'คาร์โบไฮเดรตจะถูกย่อยเป็นกลูโคสและสะสมในรูปไกลโคเจนในกล้ามเนื้อและตับ เป็นแหล่งพลังงานหลักและรวดเร็วที่สุด',
        difficulty: 'easy'
      },
      {
        id: 'pe-5',
        question: 'ในกีฬาฟุตบอล การเล่นลูกที่ผู้เล่นฝ่ายรุกอยู่ใกล้เส้นประตูของฝ่ายตรงข้ามมากกว่าลูกบอลและผู้เล่นฝ่ายรับคนสุดท้าย เรียกว่าอะไร?',
        options: ['ลูกทุ่ม', 'ล้ำหน้า (Offside)', 'ลูกเตะมุม', 'ฟาล์วรุนแรง'],
        correct_answer: 1,
        explanation: 'กฎการล้ำหน้า (Offside) มีไว้เพื่อป้องกันไม่ให้ผู้เล่นฝ่ายรุกยืนรอรับบอลหน้าประตูคู่แข่งตลอดเวลา',
        difficulty: 'easy'
      },
      {
        id: 'pe-6',
        question: 'อวัยวะใดในระบบย่อยอาหารทำหน้าที่ดูดซึมสารอาหารส่วนใหญ่เข้าสู่กระแสเลือด?',
        options: ['กระเพาะอาหาร', 'ลำไส้เล็ก', 'ลำไส้ใหญ่', 'ตับอ่อน'],
        correct_answer: 1,
        explanation: 'ลำไส้เล็กมีวิลไล (Villi) เพิ่มพื้นที่ผิวในการดูดซึมสารอาหารเกือบทั้งหมดเข้าสู่ระบบหมุนเวียนโลหิต',
        difficulty: 'medium'
      },
      {
        id: 'pe-7',
        question: 'การออกกำลังกายแบบแอโรบิก (Aerobic Exercise) ส่งผลดีต่ออวัยวะใดมากที่สุด?',
        options: ['หัวใจและปอด', 'ข้อต่อและกระดูกอ่อน', 'กล้ามเนื้อนิ้วมือ', 'ตับและไต'],
        correct_answer: 0,
        explanation: 'การออกกำลังกายแบบแอโรบิก เช่น วิ่ง ว่ายน้ำ ปั่นจักรยาน ช่วยเสริมสร้างสมรรถภาพของระบบหัวใจและหลอดเลือด รวมถึงระบบหายใจ',
        difficulty: 'easy'
      },
      {
        id: 'pe-8',
        question: 'วิตามินชนิดใดที่ร่างกายสามารถสังเคราะห์ได้เองเมื่อผิวหนังสัมผัสกับแสงแดดอ่อนๆ ยามเช้า?',
        options: ['วิตามินเอ', 'วิตามินซี', 'วิตามินดี', 'วิตามินบี 12'],
        correct_answer: 2,
        explanation: 'รังสี UVB จากแสงแดดอ่อนๆ จะเปลี่ยนสารใต้ผิวหนังให้กลายเป็นวิตามินดี ช่วยในการดูดซึมแคลเซียมเพื่อกระดูกที่แข็งแรง',
        difficulty: 'easy'
      },
      {
        id: 'pe-9',
        question: 'ในกีฬาวอลเลย์บอล ผู้เล่นแต่ละทีมสามารถสัมผัสบอลติดต่อกันได้สูงสุดกี่ครั้งก่อนส่งข้ามตาข่าย?',
        options: ['2 ครั้ง', '3 ครั้ง', '4 ครั้ง', '5 ครั้ง'],
        correct_answer: 1,
        explanation: 'แต่ละทีมมีสิทธิ์สัมผัสลูกบอลได้ไม่เกิน 3 ครั้ง (ไม่นับการบล็อก) เพื่อส่งลูกบอลกลับไปยังแดนคู่แข่ง',
        difficulty: 'easy'
      },
      {
        id: 'pe-10',
        question: 'ฮอร์โมนแห่งความสุขที่ร่างกายหลั่งออกมาขณะออกกำลังกาย ทำให้รู้สึกสดชื่นและคลายเครียด คือฮอร์โมนใด?',
        options: ['คอร์ติซอล (Cortisol)', 'เอนดอร์ฟิน (Endorphin)', 'อินซูลิน (Insulin)', 'อะดรีนาลีน (Adrenaline)'],
        correct_answer: 1,
        explanation: 'เอนดอร์ฟินเป็นสารเคมีในสมองที่ช่วยลดอาการปวด สร้างความรู้สึกผ่อนคลายและมีความสุขขณะหรือหลังการออกกำลังกาย',
        difficulty: 'medium'
      }
    ]
  },

  'ดนตรีและศิลปะ': {
    topic: 'ทฤษฎีดนตรี เครื่องดนตรี และทัศนศิลป์สากล',
    questions: [
      {
        id: 'art-1',
        question: 'แม่สีหลักในวงล้อสีทางทัศนศิลป์ (Primary Colors) ประกอบด้วย 3 สีใด?',
        options: ['แดง, เหลือง, น้ำเงิน', 'แดง, เขียว, น้ำเงิน', 'ส้ม, เขียว, ม่วง', 'ขาว, เทา, ดำ'],
        correct_answer: 0,
        explanation: 'แม่สีหลักทางศิลปะคือ สีแดง สีเหลือง และสีน้ำเงิน ซึ่งสามารถนำมาผสมกันเป็นสีขั้นที่สองและสามได้หลากหลาย',
        difficulty: 'easy'
      },
      {
        id: 'art-2',
        question: 'กุญแจประจำหลักที่ใช้บันทึกระดับเสียงแหลม (Treble Clef) ในบรรทัด 5 เส้น มีชื่อเรียกว่าอะไร?',
        options: ['กุญแจฟา (F clef)', 'กุญแจซอล (G clef)', 'กุญแจโด (C clef)', 'กุญแจมี (E clef)'],
        correct_answer: 1,
        explanation: 'กุญแจซอล (G clef) มีหัวกุญแจคาบเส้นที่ 2 กำหนดให้โน้ตบนเส้นที่ 2 คือเสียงซอล (G)',
        difficulty: 'easy'
      },
      {
        id: 'art-3',
        question: 'ภาพวาด "โมนาลิซา" (Mona Lisa) อันโด่งดัง เป็นผลงานของศิลปินเรอเนซองส์ท่านใด?',
        options: ['มีเกลันเจโล', 'เลโอนาร์โด ดา วินชี', 'ราฟาเอล', 'แวนโก๊ะ'],
        correct_answer: 1,
        explanation: 'เลโอนาร์โด ดา วินชี (Leonardo da Vinci) เป็นผู้รังสรรค์ภาพวาดสีน้ำมันโมนาลิซาบนไม้พ็อพพลาในคริสต์ศตวรรษที่ 16',
        difficulty: 'easy'
      },
      {
        id: 'art-4',
        question: 'เครื่องดนตรีสากลในข้อใดจัดอยู่ในกลุ่ม "เครื่องลมทองเหลือง" (Brass Instruments)?',
        options: ['ฟลูต (Flute)', 'คลาริเน็ต (Clarinet)', 'ทรัมเป็ต (Trumpet)', 'ไวโอลิน (Violin)'],
        correct_answer: 2,
        explanation: 'ทรัมเป็ตทำจากโลหะทองเหลือง กำเนิดเสียงจากการสั่นของริมฝีปากผู้เป่าเข้ากับปากเป่า (Mouthpiece)',
        difficulty: 'easy'
      },
      {
        id: 'art-5',
        question: 'เทคนิคการวาดภาพที่ทำให้เกิดมิติความลึก ใกล้-ไกล ตามสายตาของมนุษย์ เรียกว่าอะไร?',
        options: ['ทัศนมิติ (Perspective)', 'ภาพพิมพ์ (Printmaking)', 'ภาพตัดปะ (Collage)', 'จิตรกรรมฝาผนัง (Fresco)'],
        correct_answer: 0,
        explanation: 'Perspective คือทฤษฎีการวาดภาพทัศนมิติ โดยใช้วิธีจุดรวมสายตา (Vanishing Point) เพื่อสร้างมิติลึกบนระนาบ 2 มิติ',
        difficulty: 'medium'
      },
      {
        id: 'art-6',
        question: 'ตัวโน้ตตัวกลม (Whole note) ในอัตราจังหวะ 4/4 มีค่าความยาวเสียงเท่ากับกี่จังหวะ?',
        options: ['1 จังหวะ', '2 จังหวะ', '4 จังหวะ', '8 จังหวะ'],
        correct_answer: 2,
        explanation: 'ในอัตราจังหวะ 4/4 โน้ตตัวกลมมีค่า 4 จังหวะ, ตัวขาว 2 จังหวะ, และตัวดำ 1 จังหวะ',
        difficulty: 'easy'
      },
      {
        id: 'art-7',
        question: 'วงดนตรีสากลขนาดใหญ่ที่ประกอบด้วยเครื่องดนตรี 4 ตระกูลหลักครบครัน เรียกว่าวงอะไร?',
        options: ['วงซิมโฟนีออร์เคสตรา (Symphony Orchestra)', 'วงบิ๊กแบนด์ (Big Band)', 'วงควอร์เท็ต (String Quartet)', 'วงคอมโบ (Combo Band)'],
        correct_answer: 0,
        explanation: 'วงออร์เคสตราประกอบด้วยเครื่องสาย เครื่องเป่าลมไม้ เครื่องเป่าทองเหลือง และเครื่องกระทบ รวมผู้เล่น 60-100 คน',
        difficulty: 'medium'
      },
      {
        id: 'art-8',
        question: 'เครื่องดนตรีไทยชนิดใดจัดเป็นเครื่องดนตรีประเภท "ตี" ที่ทำจากไม้ไผ่หรือไม้ชิงชัน?',
        options: ['ซออู้', 'ระนาดเอก', 'ขลุ่ยเพียงออ', 'จะเข้'],
        correct_answer: 1,
        explanation: 'ระนาดเอกเป็นเครื่องดนตรีประเภทตี รางระนาดเป็นรูปคล้ายเรือ มีลูกระนาด 21-22 ลูกร้อยด้วยเชือกแขวนบนราง',
        difficulty: 'easy'
      },
      {
        id: 'art-9',
        question: 'ลัทธิศิลปะแบบ "อิมเพรสชันนิสม์" (Impressionism) ให้ความสำคัญสูงสุดกับสิ่งใด?',
        options: ['สัดส่วนที่เที่ยงตรงเหมือนภาพถ่าย', 'แสง สี และความประทับใจในชั่วขณะเวลาธรรมชาติ', 'ความฝันและจิตใต้สำนึก', 'รูปทรงเรขาคณิตสามมิติ'],
        correct_answer: 1,
        explanation: 'ศิลปินอิมเพรสชันนิสม์ (เช่น โมเนต์) นิยมวาดภาพกลางแจ้งเพื่อจับแสงเงาและบรรยากาศที่แปรเปลี่ยนไปในแต่ละช่วงเวลา',
        difficulty: 'medium'
      },
      {
        id: 'art-10',
        question: 'คอร์ด C เมเจอร์ (C Major triad) บนเปียโน ประกอบด้วยโน้ตตัวใดบ้าง?',
        options: ['C, E, G (โด, มี, ซอล)', 'C, F, A (โด, ฟา, ลา)', 'D, F#, A (เร, ฟาชาร์ป, ลา)', 'C, Eb, G (โด, มีแฟลต, ซอล)'],
        correct_answer: 0,
        explanation: 'ทรัยแอดคอร์ด C เมเจอร์ ประกอบด้วยโน้ตรูท C, ขั้นคู่สามเมเจอร์ E, และขั้นคู่ห้าเพอร์เฟกต์ G',
        difficulty: 'easy'
      }
    ]
  }
};

export const kingdomDomination = new KingdomDominationManager();
