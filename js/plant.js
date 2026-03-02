class Plant {
    constructor(type, row, col, game) {
        this.type = type;
        this.config = PLANT_CONFIG[type];
        this.row = row;
        this.col = col;
        this.game = game;
        
        this.health = this.config.health;
        this.maxHealth = this.config.health;
        this.id = 'plant_' + Date.now() + '_' + Math.random();
        
        this.element = null;
        this.timer = null;
        
        this.isReady = true;
        if (this.config.armTime) {
            this.isReady = false;
            setTimeout(() => {
                this.isReady = true;
            }, this.config.armTime);
        }
        
        this.createElement();
    }
    
    createElement() {
        this.element = document.createElement('div');
        this.element.className = 'game-element plant spawning';
        this.element.id = this.id;
        this.element.textContent = this.config.emoji;
        
        const lawn = document.getElementById('game-elements');
        const cellWidth = lawn.offsetWidth / 9;
        const cellHeight = lawn.offsetHeight / 5;
        
        this.x = this.col * cellWidth + cellWidth / 2 - 25;
        this.y = this.row * cellHeight + cellHeight / 2 - 25;
        
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
        
        lawn.appendChild(this.element);
        
        setTimeout(() => {
            this.element.classList.remove('spawning');
        }, 500);
        
        this.startAction();
    }
    
    startAction() {
        if (this.type === 'peashooter' || this.type === 'snowpea') {
            this.shootTimer = setInterval(() => {
                if (this.health > 0) {
                    this.shoot();
                }
            }, this.config.fireRate);
        } else if (this.type === 'sunflower') {
            this.sunTimer = setInterval(() => {
                if (this.health > 0) {
                    this.produceSun();
                }
            }, this.config.productionInterval);
        }
    }
    
    shoot() {
        const hasZombieInRow = this.game.zombies.some(z => z.row === this.row && z.x > this.x);
        if (hasZombieInRow) {
            this.game.createBullet(this.row, this.x + 50, this.y + 25, this.type === 'snowpea');
            this.game.playSound('shoot');
        }
    }
    
    produceSun() {
        this.game.createSun(this.x + 25, this.y, 25);
        this.game.playSound('sun');
    }
    
    takeDamage(amount) {
        this.health -= amount;
        
        if (this.health <= 0) {
            this.die();
        }
    }
    
    die() {
        if (this.shootTimer) clearInterval(this.shootTimer);
        if (this.sunTimer) clearInterval(this.sunTimer);
        
        if (this.element) {
            this.element.classList.add('dying');
            setTimeout(() => {
                if (this.element && this.element.parentNode) {
                    this.element.parentNode.removeChild(this.element);
                }
            }, 500);
        }
        
        this.game.removePlant(this);
    }
    
    trigger(row, col) {
        if (this.type === 'potatomine' && this.isReady) {
            this.explode();
        } else if (this.type === 'jalapeno') {
            this.explode();
        } else if (this.type === 'cherrybomb') {
            this.explode();
        }
    }
    
    explode() {
        const damage = this.config.damage;
        
        if (this.type === 'jalapeno') {
            this.game.zombies.forEach(zombie => {
                if (zombie.row === this.row) {
                    zombie.takeDamage(damage);
                }
            });
        } else if (this.type === 'cherrybomb') {
            this.game.zombies.forEach(zombie => {
                const rowDiff = Math.abs(zombie.row - this.row);
                const colDiff = Math.abs(zombie.col - this.col);
                if (rowDiff <= 1 && colDiff <= 1) {
                    zombie.takeDamage(damage);
                }
            });
        } else if (this.type === 'potatomine') {
            this.game.zombies.forEach(zombie => {
                if (zombie.row === this.row && 
                    Math.abs(zombie.col - this.col) <= 1) {
                    zombie.takeDamage(damage);
                }
            });
        }
        
        this.takeDamage(this.health);
    }
}
