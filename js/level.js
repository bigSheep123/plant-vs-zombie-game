const LEVEL_CONFIG = {
    1: {
        name: "草地战场",
        difficulty: "easy",
        totalWaves: 5,
        zombiesPerWave: 5,
        spawnInterval: 4000,
        zombieTypes: ['normal', 'conehead'],
        flagWave: 3,
        description: "普通僵尸+路障僵尸，5波，含1个旗帜僵尸波次",
        isNight: false,
        hasFog: false
    },
    2: {
        name: "迷雾之夜",
        difficulty: "medium",
        totalWaves: 7,
        zombiesPerWave: 6,
        spawnInterval: 3500,
        zombieTypes: ['normal', 'conehead', 'polevaulting'],
        flagWave: 3,
        flagWave2: 6,
        description: "夜晚场景，迷雾，7波，含2个旗帜僵尸波次",
        isNight: true,
        hasFog: true
    },
    3: {
        name: "倾斜屋顶",
        difficulty: "hard",
        totalWaves: 9,
        zombiesPerWave: 8,
        spawnInterval: 3000,
        zombieTypes: ['normal', 'conehead', 'buckethead', 'flag'],
        flagWave: 5,
        flagWave2: 9,
        description: "屋顶场景，9波，含2个旗帜僵尸波次",
        isNight: false,
        hasFog: false,
        isRoof: true
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
    },
    snowpea: {
        name: "寒冰射手",
        emoji: "🥦",
        cost: 175,
        health: 100,
        damage: 20,
        fireRate: 1500,
        slowDuration: 3000,
        description: "发射冰豌豆，减速僵尸"
    }
};

const ZOMBIE_CONFIG = {
    normal: {
        name: "普通僵尸",
        emoji: "🧟",
        health: 100,
        speed: 0.8,
        damage: 10,
        attackInterval: 1000
    },
    conehead: {
        name: "路障僵尸",
        emoji: "🧢",
        health: 200,
        speed: 0.8,
        damage: 10,
        attackInterval: 1000
    },
    buckethead: {
        name: "铁桶僵尸",
        emoji: "🪣",
        health: 400,
        speed: 0.6,
        damage: 10,
        attackInterval: 1000
    },
    polevaulting: {
        name: "撑杆跳僵尸",
        emoji: "🎋",
        health: 100,
        speed: 1.2,
        damage: 10,
        attackInterval: 1000,
        canJump: true
    },
    flag: {
        name: "旗帜僵尸",
        emoji: "🚩",
        health: 100,
        speed: 0.8,
        damage: 10,
        attackInterval: 1000,
        isFlag: true
    }
};
