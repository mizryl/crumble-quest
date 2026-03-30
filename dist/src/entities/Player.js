import { Entity } from './Entity.js';
import { KeyHandler } from "./KeyHandler.js";
export class Player extends Entity {
    constructor(x, y, sprites) {
        super(x, y, false, 1, sprites);
        this.playerSize = 128;
        this.keyH = new KeyHandler;
        this.currentAnimation = this.down;
    }
    update() {
        let moving = this.keyH.upPressed || this.keyH.downPressed ||
            this.keyH.leftPressed || this.keyH.rightPressed;
    }
    display() {
        let img = this.currentAnimation[this.currentFrame];
        image(img, this.x, this.y, this.playerSize, this.playerSize);
    }
}
//# sourceMappingURL=Player.js.map