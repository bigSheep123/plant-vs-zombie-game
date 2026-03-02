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
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.initLawn();
    }
    
    setupEventListeners() {
        document.getElementById('start-btn').addEventListener('click', () => {
            this.showScreen('level-screen');
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
        
        document.getElementById('total-waves').textContent = LEVEL_CONFIG[this.level].totalWaves;
        
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
        
        for (let i = 0; i < config.zombiesPerWave; i++) {
            setTimeout(() => {
                if (!this.isRunning) return;
                
                const row = Math.floor(Math.random() * 5);
                const zombieTypes = config.zombieTypes;
                const type = zombieTypes[Math.floor(Math.random() * zombieTypes.length)];
                
                this.createZombie(type, row);
            }, i * 800);
        }
    }
    
    createZombie(type, row) {
        const zombie = new Zombie(type, row, this);
        this.zombies.push(zombie);
    }
    
    createBullet(row, x, y) {
        const bullet = new Bullet(row, x, y, this);
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
        
        if (this.selectedPlantType === 'jalapeno' || this.selectedPlantType === 'cherrybomb') {
            setTimeout(() => {
                plant.explode();
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
        document.getElementById('final-score').textContent = this.score;
        this.showScreen('gameover-screen');
    }
    
    victory() {
        this.stopGame();
        const bonusScore = this.sun * 2;
        this.score += bonusScore;
        document.getElementById('victory-score').textContent = this.score;
        this.showScreen('victory-screen');
    }
}

const game = new Game();
