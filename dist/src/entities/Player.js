import { Entity } from './Entity.js';
import { TileManager } from "../world/TileManager.js";
export class Player extends Entity {
    constructor(x, y, sprites, keyH) {
        super(x, y, false, 0.05, sprites);
        this.tileSize = TileManager.TILE_SIZE;
        this.currentFrame = 0;
        this.moving = false;
        this.keyH = keyH;
        this.currentAnimation = this.down;
    }
    update(tileM) {
        this.moving = this.keyH.upPressed || this.keyH.downPressed ||
            this.keyH.leftPressed || this.keyH.rightPressed;
        if (this.keyH.upPressed) {
            this.currentAnimation = this.up;
            this.y -= this.speed;
            this.moving = true;
        }
        if (this.keyH.downPressed) {
            this.currentAnimation = this.down;
            this.y += this.speed;
        }
        if (this.keyH.leftPressed) {
            this.currentAnimation = this.left;
            this.x -= this.speed;
        }
        if (this.keyH.rightPressed) {
            this.currentAnimation = this.right;
            this.x += this.speed;
        }
        if (!this.moving) {
            this.currentFrame = 0;
        }
        else {
            this.spriteCounter++;
            if (this.spriteCounter > 5) {
                this.currentFrame = (this.currentFrame + 1) % 4;
                this.spriteCounter = 0;
            }
        }
        this.x = constrain(this.x, 0, 14);
        this.y = constrain(this.y, 0.1, 3);
    }
    display() {
        let img = this.currentAnimation[this.currentFrame];
        const size = TileManager.TILE_SIZE;
        // Calculate height based on the image's original proportions
        let displayWidth = this.tileSize;
        let displayHeight = this.tileSize * (img.height / img.width);
        image(img, this.x * size, this.y * size, displayWidth, displayHeight);
    }
}
//# sourceMappingURL=Player.js.map