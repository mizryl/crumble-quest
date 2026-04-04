import { TileManager } from "../world/TileManager.js";
export class Entity {
    constructor(x, y, moving, speed, sprites) {
        this.up = [];
        this.down = [];
        this.left = [];
        this.right = [];
        this.currentAnimation = [];
        this.currentFrame = 0;
        this.spriteCounter = 0;
        this.isSolid = true;
        this.up = sprites.up;
        this.down = sprites.down;
        this.left = sprites.left;
        this.right = sprites.right;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.isMoving = moving;
        this.currentAnimation = this.down;
    }
    display() {
        let img = this.currentAnimation[this.currentFrame];
        const size = TileManager.TILE_SIZE;
        // Calculate height based on the image's original proportions
        let displayWidth = size;
        let displayHeight = size * (img.height / img.width);
        image(img, this.x * size, this.y * size, displayWidth, displayHeight);
    }
    // abstract display(): void;
    getHitbox(checkX = this.x, checkY = this.y) {
        const size = TileManager.TILE_SIZE;
        // const padding = size * 0.1;
        const widthScale = 0.7;
        const hBoxW = size * widthScale;
        const xOffset = (size - hBoxW) / 2;
        return {
            x: (checkX * size) + xOffset,
            y: (checkY * size) + 110,
            w: hBoxW,
            h: size / 2,
        };
    }
}
//# sourceMappingURL=Entity.js.map