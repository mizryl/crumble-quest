import { Entity } from './Entity.js';
import { KeyHandler } from "./KeyHandler.js";
export class Player extends Entity {
    constructor(x, y, sprites) {
        super(x, y, false, 4, sprites);
        this.tileSize = 128;
        this.keyH = new KeyHandler;
        this.currentFrame = 0;
        this.currentAnimation = this.down;
    }
    update() {
        let moving = this.keyH.upPressed || this.keyH.downPressed ||
            this.keyH.leftPressed || this.keyH.rightPressed;
        if (this.keyH.upPressed) {
            this.currentAnimation = this.up;
            this.y -= this.speed;
            console.log("UP");
        }
        else if (this.keyH.downPressed) {
            this.currentAnimation = this.down;
            this.y += this.speed;
        }
        else if (this.keyH.leftPressed) {
            this.currentAnimation = this.left;
            this.x -= this.speed;
        }
        else if (this.keyH.rightPressed) {
            this.currentAnimation = this.right;
            this.x += this.speed;
        }
        if (!moving) {
            this.currentFrame = 0;
        }
        else {
            this.spriteCounter++;
            if (this.spriteCounter > 5) {
                this.currentFrame = (this.currentFrame + 1) % 4;
                this.spriteCounter = 0;
            }
        }
    }
    display() {
        // let img = this.currentAnimation[this.currentFrame];
        // image(img, this.x, this.y, 128,  256);
        let img = this.currentAnimation[this.currentFrame];
        // Calculate height based on the image's original proportions
        let displayWidth = this.tileSize;
        let displayHeight = this.tileSize * (img.height / img.width);
        image(img, this.x, this.y, displayWidth, displayHeight);
    }
}
//# sourceMappingURL=Player.js.map