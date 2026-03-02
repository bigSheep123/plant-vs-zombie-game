const LEVEL_CONFIG = {
    1: {
        name: "草地战场",
        difficulty: "easy",
        totalWaves: 3,
        zombiesPerWave: 5,
        spawnInterval: 4000,
        zombieTypes: ['normal'],
        description: "普通僵尸，每波5只，共3波"
    },
    2: {
        name: "路障挑战",
        difficulty: "medium",
        totalWaves: 5,
        zombiesPerWave: 8,
        spawnInterval: 3500,
        zombieTypes: ['normal', 'conehead'],
        description: "普通僵尸+路障僵尸，每波8只，共5波"
    },
    3: {
        name: "铁桶噩梦",
        difficulty: "hard",
        totalWaves: 7,
        zombiesPerWave: 10,
        spawnInterval: 3000,
        zombieTypes: ['normal', 'conehead', 'buckethead'],
        description: "普通僵尸+路障僵尸+铁桶僵尸，每波10只，共7波"
    }
};

const PLANT_CONFIG = {
    peashooter: {
        name: "豌豆射手",
        emoji: "🫛",
        cost: 100,
        health: 100,
        damage: 20,
        fireRate: 1500,
        description: "发射豌豆攻击僵尸"
    },
    sunflower: {
        name: "向日葵",
        emoji: "🌻",
        cost: 50,
        health: 100,
        sunProduction: 25,
        productionInterval: 10000,
        description: "定期生产阳光"
    },
    wallnut: {
        name: "坚果墙",
        emoji: "🥜",
        cost: 50,
        health: 400,
        description: "高血量阻挡僵尸"
    },
    potatomine: {
        name: "土豆地雷",
        emoji: "💣",
        cost: 25,
        health: 100,
        damage: 1800,
        armTime: 1500,
        description: "延迟后秒杀僵尸"
    },
    jalapeno: {
        name: "火爆辣椒",
        emoji: "🌶️",
        cost: 125,
        health: 100,
        damage: 1800,
        description: "清除整行僵尸"
    },
    cherrybomb: {
        name: "樱桃炸弹",
        emoji: "🍒",
        cost: 150,
        health: 100,
        damage: 1800,
        description: "大范围高伤害"
    }
};

const ZOMBIE_CONFIG = {
    normal: {
        name: "普通僵尸",
        emoji: "🧟",
        health: 100,
        speed: 0.3,
        damage: 10,
        attackInterval: 1000
    },
    conehead: {
        name: "路障僵尸",
        emoji: "🧢",
        health: 200,
        speed: 0.3,
        damage: 10,
        attackInterval: 1000
    },
    buckethead: {
        name: "铁桶僵尸",
        emoji: "🪣",
        health: 400,
        speed: 0.25,
        damage: 10,
        attackInterval: 1000
    }
};
