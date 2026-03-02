class Game {
    constructor() {
        this.sun = 50;
        this.score = 0;
        this.level = 1;
        this.currentWave = 0;
        this.isRunning = false;
        
        this.plants = [];
        this.zombies = [];
        this.bullets = [];
        
        this.selectedPlant = null;
        this.selectedPlantType = null;
        
        this.waveTimer = null;
        this.gameLoop = null;
        
        this.audioContext = null;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.initLawn();
    }
    
    initAudio() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }
    
    playSound(type) {
        this.initAudio();
        
        const ctx = this.audioContext;
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        switch(type) {
            case 'shoot':
                oscillator.frequency.setValueAtTime(800, ctx.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);
                gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
                oscillator.start(ctx.currentTime);
                oscillator.stop(ctx.currentTime + 0.1);
                break;
            case 'sun':
                oscillator.frequency.setValueAtTime(600, ctx.currentTime);
                oscillator.frequency.setValueAtTime(800, ctx.currentTime + 0.1);
                gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
                oscillator.start(ctx.currentTime);
                oscillator.stop(ctx.currentTime + 0.2);
                break;
            case 'plant':
                oscillator.frequency.setValueAtTime(400, ctx.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.15);
                gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
                oscillator.start(ctx.currentTime);
                oscillator.stop(ctx.currentTime + 0.15);
                break;
            case 'zombie':
                oscillator.type = 'sawtooth';
                oscillator.frequency.setValueAtTime(150, ctx.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.3);
                gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                oscillator.start(ctx.currentTime);
                oscillator.stop(ctx.currentTime + 0.3);
                break;
            case 'flag':
                oscillator.frequency.setValueAtTime(400, ctx.currentTime);
                oscillator.frequency.setValueAtTime(600, ctx.currentTime + 0.1);
                oscillator.frequency.setValueAtTime(800, ctx.currentTime + 0.2);
                gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                oscillator.start(ctx.currentTime);
                oscillator.stop(ctx.currentTime + 0.3);
                break;
            case 'explode':
                oscillator.type = 'sawtooth';
                oscillator.frequency.setValueAtTime(200, ctx.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.4);
                gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
                oscillator.start(ctx.currentTime);
                oscillator.stop(ctx.currentTime + 0.4);
                break;
            case 'gameover':
                oscillator.type = 'sawtooth';
                oscillator.frequency.setValueAtTime(300, ctx.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.5);
                gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
                oscillator.start(ctx.currentTime);
                oscillator.stop(ctx.currentTime + 0.5);
                break;
            case 'victory':
                oscillator.frequency.setValueAtTime(400, ctx.currentTime);
                oscillator.frequency.setValueAtTime(500, ctx.currentTime + 0.15);
                oscillator.frequency.setValueAtTime(600, ctx.currentTime + 0.3);
                oscillator.frequency.setValueAtTime(800, ctx.currentTime + 0.45);
                gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
                oscillator.start(ctx.currentTime);
                oscillator.stop(ctx.currentTime + 0.6);
                break;
        }
    }
    
    setupEventListeners() {
        document.getElementById('start-btn').addEventListener('click', () => {
            this.showScreen('level-screen');
        });
        
        document.getElementById('shop-btn')?.addEventListener('click', () => {
            alert('商店功能开发中...');
        });
        
        document.getElementById('plant-book-btn')?.addEventListener('click', () => {
            alert('植物图鉴功能开发中...\n\n已有植物：\n- 豌豆射手：发射豌豆攻击\n- 向日葵：生产阳光\n- 坚果墙：高血量防御\n- 土豆地雷：延迟爆炸\n- 火爆辣椒：清除整行\n- 樱桃炸弹：3x3范围爆炸\n- 寒冰射手：冰豌豆减速');
        });
        
        document.getElementById('zombie-book-btn')?.addEventListener('click', () => {
            alert('僵尸图鉴功能开发中...\n\n已有僵尸：\n- 普通僵尸：基础敌人\n- 路障僵尸：2倍生命\n- 铁桶僵尸：高生命\n- 撑杆跳僵尸：跳跃植物\n- 旗帜僵尸：波次标记');
        });
        
        document.getElementById('settings-btn')?.addEventListener('click', () => {
            alert('设置功能开发中...');
        });
        
        document.getElementById('back-to-menu').addEventListener('click', () => {
            this.showScreen('menu-screen');
        });
        
        document.querySelectorAll('.level-card').forEach(card => {
            card.addEventListener('click', () => {
                this.level = parseInt(card.dataset.level);
                this.startLevel();
            });
        });
        
        document.getElementById('back-to-level').addEventListener('click', () => {
            this.stopGame();
            this.showScreen('level-screen');
        });
        
        document.querySelectorAll('.plant-card').forEach(card => {
            card.addEventListener('click', () => {
                if (card.classList.contains('disabled')) return;
                
                document.querySelectorAll('.plant-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                this.selectedPlantType = card.dataset.plant;
            });
        });
        
        document.getElementById('retry-btn').addEventListener('click', () => {
            this.startLevel();
        });
        
        document.getElementById('gameover-menu-btn').addEventListener('click', () => {
            this.showScreen('menu-screen');
        });
        
        document.getElementById('victory-retry-btn').addEventListener('click', () => {
            this.startLevel();
        });
        
        document.getElementById('victory-menu-btn').addEventListener('click', () => {
            this.showScreen('menu-screen');
        });
    }
    
    initLawn() {
        const lawnGrid = document.getElementById('lawn-grid');
        lawnGrid.innerHTML = '';
        
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 9; col++) {
                const cell = document.createElement('div');
                cell.className = 'lawn-cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                cell.addEventListener('click', () => {
                    this.handleCellClick(row, col);
                });
                
                lawnGrid.appendChild(cell);
            }
        }
    }
    
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
    }
    
    startLevel() {
        this.reset();
        this.showScreen('game-screen');
        
        const config = LEVEL_CONFIG[this.level];
        document.getElementById('total-waves').textContent = config.totalWaves;
        
        const gameScreen = document.getElementById('game-screen');
        gameScreen.className = 'screen active';
        
        if (config.isNight) {
            gameScreen.classList.add('night');
        } else {
            gameScreen.classList.remove('night');
        }
        
        if (config.hasFog) {
            gameScreen.classList.add('fog');
        } else {
            gameScreen.classList.remove('fog');
        }
        
        this.startGame();
    }
    
    reset() {
        this.sun = 50;
        this.score = 0;
        this.currentWave = 0;
        
        this.plants = [];
        this.zombies = [];
        this.bullets = [];
        
        this.selectedPlant = null;
        this.selectedPlantType = null;
        
        document.getElementById('game-elements').innerHTML = '';
        document.getElementById('sun-elements').innerHTML = '';
        
        this.initLawn();
        this.updateUI();
        
        document.querySelectorAll('.plant-card').forEach(c => {
            c.classList.remove('selected');
            c.classList.remove('disabled');
        });
        
        this.startSunSpawner();
    }
    
    startGame() {
        this.isRunning = true;
        this.initAudio();
        this.startWaves();
        
        this.gameLoop = setInterval(() => {
            this.update();
        }, 50);
    }
    
    stopGame() {
        this.isRunning = false;
        
        if (this.waveTimer) clearInterval(this.waveTimer);
        if (this.gameLoop) clearInterval(this.gameLoop);
        if (this.sunSpawner) clearInterval(this.sunSpawner);
        
        this.plants.forEach(p => {
            if (p.shootTimer) clearInterval(p.shootTimer);
            if (p.sunTimer) clearInterval(p.sunTimer);
        });
        
        this.zombies.forEach(z => {
            if (z.attackTimer) clearInterval(z.attackTimer);
        });
    }
    
    startSunSpawner() {
        this.sunSpawner = setInterval(() => {
            if (this.isRunning && Math.random() < 0.3) {
                this.createSun(
                    Math.random() * (window.innerWidth - 200) + 100,
                    100,
                    25
                );
            }
        }, 5000);
    }
    
    startWaves() {
        const config = LEVEL_CONFIG[this.level];
        this.currentWave = 0;
        
        const startNextWave = () => {
            if (!this.isRunning) return;
            
            this.currentWave++;
            document.getElementById('current-wave').textContent = this.currentWave;
            
            this.spawnWave();
            
            if (this.currentWave < config.totalWaves) {
                this.waveTimer = setTimeout(startNextWave, config.spawnInterval * config.zombiesPerWave + 5000);
            }
        };
        
        setTimeout(startNextWave, 3000);
    }
    
    spawnWave() {
        const config = LEVEL_CONFIG[this.level];
        
        const isFlagWave = this.currentWave === config.flagWave || 
                          (config.flagWave2 && this.currentWave === config.flagWave2);
        
        for (let i = 0; i < config.zombiesPerWave; i++) {
            setTimeout(() => {
                if (!this.isRunning) return;
                
                const row = Math.floor(Math.random() * 5);
                let type;
                
                if (isFlagWave && i === 0) {
                    type = 'flag';
                } else {
                    const zombieTypes = config.zombieTypes.filter(t => t !== 'flag');
                    type = zombieTypes[Math.floor(Math.random() * zombieTypes.length)];
                }
                
                this.createZombie(type, row);
                
                if (isFlagWave && i === 0) {
                    this.playSound('flag');
                }
            }, i * 800);
        }
    }
    
    createZombie(type, row) {
        const zombie = new Zombie(type, row, this);
        this.zombies.push(zombie);
    }
    
    createBullet(row, x, y, isIce = false) {
        const bullet = new Bullet(row, x, y, this, isIce);
        this.bullets.push(bullet);
    }
    
    createSun(x, y, value) {
        const sunElement = document.createElement('div');
        sunElement.className = 'game-element sun';
        sunElement.textContent = '☀️';
        sunElement.style.left = x + 'px';
        sunElement.style.top = y + 'px';
        
        const sunContainer = document.getElementById('sun-elements');
        sunContainer.appendChild(sunElement);
        
        const fallAnimation = setInterval(() => {
            if (!sunElement.parentNode) {
                clearInterval(fallAnimation);
                return;
            }
            
            let currentTop = parseFloat(sunElement.style.top);
            
            if (currentTop > window.innerHeight - 200) {
                sunElement.style.top = (currentTop + 1) + 'px';
            } else {
                clearInterval(fallAnimation);
                
                setTimeout(() => {
                    if (sunElement.parentNode) {
                        sunElement.classList.add('collected');
                        setTimeout(() => {
                            if (sunElement.parentNode) {
                                sunElement.parentNode.removeChild(sunElement);
                            }
                        }, 500);
                    }
                }, 8000);
            }
        }, 30);
        
        sunElement.addEventListener('click', () => {
            this.collectSun(sunElement, value);
        });
        
        sunElement.dataset.value = value;
    }
    
    collectSun(element, value) {
        this.sun += value;
        this.updateUI();
        
        element.classList.add('collected');
        setTimeout(() => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        }, 500);
    }
    
    handleCellClick(row, col) {
        if (!this.selectedPlantType) return;
        
        const config = PLANT_CONFIG[this.selectedPlantType];
        if (this.sun < config.cost) return;
        
        const cellIndex = row * 9 + col;
        const cell = document.querySelectorAll('.lawn-cell')[cellIndex];
        
        if (cell.classList.contains('has-plant')) return;
        
        if (this.selectedPlantType === 'jalapeno') {
            const existingPlants = this.plants.filter(p => p.row === row);
            if (existingPlants.length > 0) {
                return;
            }
        }
        
        if (this.selectedPlantType === 'cherrybomb') {
            const existingPlants = this.plants.filter(p => 
                p.row === row && Math.abs(p.col - col) <= 1
            );
            if (existingPlants.length > 0) {
                return;
            }
        }
        
        this.sun -= config.cost;
        this.updateUI();
        
        const plant = new Plant(this.selectedPlantType, row, col, this);
        this.plants.push(plant);
        
        cell.classList.add('has-plant');
        
        document.querySelectorAll('.plant-card').forEach(c => c.classList.remove('selected'));
        this.selectedPlantType = null;
        
        this.playSound('plant');
        
        if (this.selectedPlantType === 'jalapeno' || this.selectedPlantType === 'cherrybomb') {
            setTimeout(() => {
                plant.explode();
                this.playSound('explode');
            }, 500);
        }
    }
    
    update() {
        this.zombies.forEach(zombie => zombie.update());
        this.bullets.forEach(bullet => bullet.update());
    }
    
    removePlant(plant) {
        const index = this.plants.indexOf(plant);
        if (index > -1) {
            this.plants.splice(index, 1);
            
            const cellIndex = plant.row * 9 + plant.col;
            const cell = document.querySelectorAll('.lawn-cell')[cellIndex];
            if (cell) {
                cell.classList.remove('has-plant');
            }
        }
    }
    
    removeZombie(zombie) {
        const index = this.zombies.indexOf(zombie);
        if (index > -1) {
            this.zombies.splice(index, 1);
            
            this.checkVictory();
        }
    }
    
    removeBullet(bullet) {
        const index = this.bullets.indexOf(bullet);
        if (index > -1) {
            this.bullets.splice(index, 1);
        }
    }
    
    addScore(points) {
        this.score += points;
        document.getElementById('score').textContent = this.score;
    }
    
    updateUI() {
        document.getElementById('sun-amount').textContent = this.sun;
        document.getElementById('score').textContent = this.score;
        
        document.querySelectorAll('.plant-card').forEach(card => {
            const cost = parseInt(card.dataset.cost);
            if (this.sun < cost) {
                card.classList.add('disabled');
            } else {
                card.classList.remove('disabled');
            }
        });
    }
    
    checkVictory() {
        const config = LEVEL_CONFIG[this.level];
        const totalZombies = config.totalWaves * config.zombiesPerWave;
        
        if (this.currentWave >= config.totalWaves && this.zombies.length === 0) {
            setTimeout(() => {
                this.victory();
            }, 1000);
        }
    }
    
    gameOver() {
        this.stopGame();
        this.playSound('gameover');
        document.getElementById('final-score').textContent = this.score;
        this.showScreen('gameover-screen');
    }
    
    victory() {
        this.stopGame();
        this.playSound('victory');
        const bonusScore = this.sun * 2;
        this.score += bonusScore;
        document.getElementById('victory-score').textContent = this.score;
        this.showScreen('victory-screen');
    }
}

const game = new Game();
