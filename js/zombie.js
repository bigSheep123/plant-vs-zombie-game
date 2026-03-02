class Zombie {
    constructor(type, row, game) {
        this.type = type;
        this.config = ZOMBIE_CONFIG[type];
        this.row = row;
        this.game = game;
        
        this.health = this.config.health;
        this.maxHealth = this.config.health;
        this.speed = this.config.speed;
        this.damage = this.config.damage;
        this.id = 'zombie_' + Date.now() + '_' + Math.random();
        
        this.x = window.innerWidth + 50;
        this.col = 9;
        
        this.isEating = false;
        this.currentPlant = null;
        this.attackTimer = null;
        this.element = null;
        
        this.createElement();
    }
    
    createElement() {
        this.element = document.createElement('div');
        this.element.className = 'game-element zombie';
        this.element.id = this.id;
        
        let emoji = this.config.emoji;
        if (this.type === 'conehead') {
            emoji = '🧟';
        }
        
        this.element.innerHTML = `
            <div class="zombie-emoji">${emoji}</div>
            <div class="health-bar">
                <div class="health-bar-inner" style="width: 100%"></div>
            </div>
        `;
        
        const lawn = document.getElementById('game-elements');
        const cellWidth = lawn.offsetWidth / 9;
        const cellHeight = lawn.offsetHeight / 5;
        
        this.y = this.row * cellHeight + cellHeight / 2 - 25;
        
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
        
        lawn.appendChild(this.element);
    }
    
    update() {
        if (!this.element) return;
        
        const lawn = document.getElementById('game-elements');
        const cellWidth = lawn.offsetWidth / 9;
        
        const plantInFront = this.getPlantInFront();
        
        if (plantInFront) {
            if (!this.isEating) {
                this.startEating(plantInFront);
            }
        } else {
            if (this.isEating) {
                this.stopEating();
            }
            this.x -= this.speed;
        }
        
        this.col = Math.floor(this.x / cellWidth);
        
        this.element.style.left = this.x + 'px';
        
        if (this.x < -50) {
            this.game.gameOver();
        }
    }
    
    getPlantInFront() {
        const lawn = document.getElementById('game-elements');
        const cellWidth = lawn.offsetWidth / 9;
        
        const frontX = this.x + 30;
        
        return this.game.plants.find(plant => {
            if (plant.row !== this.row) return false;
            const plantX = plant.col * cellWidth + cellWidth / 2;
            return plantX > frontX - 20 && plantX < frontX + 40;
        });
    }
    
    startEating(plant) {
        this.isEating = true;
        this.currentPlant = plant;
        this.element.classList.add('eating');
        
        this.attackTimer = setInterval(() => {
            if (this.currentPlant && this.currentPlant.health > 0) {
                this.currentPlant.takeDamage(this.damage);
            } else {
                this.stopEating();
            }
        }, this.config.attackInterval);
    }
    
    stopEating() {
        this.isEating = false;
        this.currentPlant = null;
        if (this.element) {
            this.element.classList.remove('eating');
        }
        if (this.attackTimer) {
            clearInterval(this.attackTimer);
            this.attackTimer = null;
        }
    }
    
    takeDamage(amount) {
        this.health -= amount;
        
        if (this.element) {
            const healthBar = this.element.querySelector('.health-bar-inner');
            const percent = Math.max(0, (this.health / this.maxHealth) * 100);
            healthBar.style.width = percent + '%';
        }
        
        if (this.health <= 0) {
            this.die();
        }
    }
    
    die() {
        this.stopEating();
        
        if (this.element) {
            this.element.classList.add('dying');
            setTimeout(() => {
                if (this.element && this.element.parentNode) {
                    this.element.parentNode.removeChild(this.element);
                }
            }, 1000);
        }
        
        this.game.addScore(10);
        this.game.removeZombie(this);
    }
}
