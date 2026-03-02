class Bullet {
    constructor(row, x, y, game, isIce = false) {
        this.row = row;
        this.x = x;
        this.y = y;
        this.game = game;
        this.damage = 20;
        this.speed = 5;
        this.isIce = isIce;
        this.id = 'bullet_' + Date.now() + '_' + Math.random();
        
        this.element = null;
        this.createElement();
    }
    
    createElement() {
        this.element = document.createElement('div');
        this.element.className = 'game-element bullet';
        this.element.textContent = this.isIce ? '❄️' : '🟢';
        
        const lawn = document.getElementById('game-elements');
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
        
        lawn.appendChild(this.element);
    }
    
    update() {
        if (!this.element) return;
        
        this.x += this.speed;
        this.element.style.left = this.x + 'px';
        
        const lawn = document.getElementById('game-elements');
        if (this.x > lawn.offsetWidth) {
            this.remove();
            return;
        }
        
        this.checkCollision();
    }
    
    checkCollision() {
        const lawn = document.getElementById('game-elements');
        const cellWidth = lawn.offsetWidth / 9;
        
        for (const zombie of this.game.zombies) {
            if (zombie.row !== this.row) continue;
            
            const zombieLeft = zombie.x;
            const zombieRight = zombie.x + 50;
            
            if (this.x >= zombieLeft && this.x <= zombieRight) {
                zombie.takeDamage(this.damage);
                if (this.isIce) {
                    zombie.applySlow();
                }
                this.remove();
                return;
            }
        }
    }
    
    remove() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        this.game.removeBullet(this);
    }
}
