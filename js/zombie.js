class Zombie {
    constructor(type, row, game) {
        this.type = type;
        this.config = ZOMBIE_CONFIG[type];
        this.row = row;
        this.game = game;
        
        this.health = this.config.health;
        this.maxHealth = this.config.health;
        this.baseSpeed = this.config.speed;
        this.speed = this.config.speed;
        this.damage = this.config.damage;
        this.id = 'zombie_' + Date.now() + '_' + Math.random();
        
        this.x = window.innerWidth + 50;
        this.col = 9;
        
        this.isEating = false;
        this.currentPlant = null;
        this.attackTimer = null;
        this.element = null;
        
        this.hasPole = this.type === 'polevaulting';
        this.hasJumped = false;
        this.isSlowed = false;
        this.slowTimer = null;
        
        this.createElement();
    }
    
    createElement() {
        this.element = document.createElement('div');
        this.element.className = 'game-element zombie';
        this.element.id = this.id;
        
        let emoji = this.config.emoji;
        if (this.type === 'conehead') {
            emoji = '🧟';
        } else if (this.type === 'polevaulting') {
            emoji = this.hasPole ? '🎋' : '🧟';
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
                if (this.type === 'polevaulting' && this.hasPole && !this.hasJumped) {
                    this.jumpOver(plantInFront);
                } else {
                    this.startEating(plantInFront);
                }
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
    
    jumpOver(plant) {
        const lawn = document.getElementById('game-elements');
        const cellWidth = lawn.offsetWidth / 9;
        const plantX = plant.col * cellWidth + cellWidth / 2;
        
        this.element.style.transition = 'left 0.5s ease-in';
        this.x = plantX + 80;
        this.element.style.left = this.x + 'px';
        
        setTimeout(() => {
            this.element.style.transition = 'left 0.1s linear';
            this.hasPole = false;
            this.hasJumped = true;
            this.speed = this.baseSpeed * 0.5;
            this.updateEmoji();
        }, 500);
    }
    
    updateEmoji() {
        if (!this.element) return;
        const emojiEl = this.element.querySelector('.zombie-emoji');
        if (this.type === 'polevaulting') {
            emojiEl.textContent = this.hasPole ? '🎋' : '🧟';
        } else if (this.type === 'conehead') {
            emojiEl.textContent = this.health > 100 ? '🧢' : '🧟';
        } else if (this.type === 'buckethead') {
            emojiEl.textContent = this.health > 400 ? '🪣' : '🧟';
        }
    }
    
    applySlow() {
        if (this.isSlowed) {
            clearTimeout(this.slowTimer);
        } else {
            this.isSlowed = true;
            this.speed = this.baseSpeed * 0.5;
            if (this.element) {
                this.element.classList.add('slowed');
            }
        }
        
        this.slowTimer = setTimeout(() => {
            this.isSlowed = false;
            this.speed = this.baseSpeed;
            if (this.element) {
                this.element.classList.remove('slowed');
            }
        }, 3000);
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
        
        if (this.type === 'conehead' && this.health <= 100) {
            this.updateEmoji();
        } else if (this.type === 'buckethead' && this.health <= 400) {
            this.updateEmoji();
        }
        
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
        
        if (this.slowTimer) {
            clearTimeout(this.slowTimer);
        }
        
        if (this.element) {
            this.element.classList.add('dying');
            setTimeout(() => {
                if (this.element && this.element.parentNode) {
                    this.element.parentNode.removeChild(this.element);
                }
            }, 1000);
        }
        
        this.game.addScore(this.config.isFlag ? 50 : 10);
        this.game.removeZombie(this);
    }
}
