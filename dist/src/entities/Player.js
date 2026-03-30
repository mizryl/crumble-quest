import { Entity } from './Entity.js';
export class Player extends Entity {
    constructor(x, y, sprites) {
        super(x, y, false, 1, sprites);
        this.currentAnimation = this.down;
    }
    update() {
        let moving = this.keyH.upPressed || this.keyH.downPressed ||
            this.keyH.leftPressed || this.keyH.rightPressed;
    }
    display() {
        let img = this.currentAnimation[this.currentFrame];
        image(img, this.x, this.y);
    }
}
//# sourceMappingURL=Player.js.map