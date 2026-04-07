import { TileManager } from "../world/TileManager.js";
export class Entity {
    constructor(x, y, moving, speed, sprites, id) {
        this.up = [];
        this.down = [];
        this.left = [];
        this.right = [];
        this.currentAnimation = [];
        this.currentFrame = 0;
        this.spriteCounter = 0;
        this.isSolid = true;
        this.totalDistanceMoved = 0;
        this.up = sprites.up;
        this.down = sprites.down;
        this.left = sprites.left;
        this.right = sprites.right;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.isMoving = moving;
        this.currentAnimation = this.down;
        // Initialize logging values
        this.entityId = id;
        this.lastX = x;
        this.lastY = y;
    }
    display() {
        let img = this.currentAnimation[this.currentFrame];
        const size = TileManager.TILE_SIZE;
        // Calculate height based on the image's original proportions
        let displayWidth = size;
        let displayHeight = size * (img.height / img.width);
        image(img, this.x * size, this.y * size, displayWidth, displayHeight);
    }
    getHitbox(checkX = this.x, checkY = this.y) {
        const size = TileManager.TILE_SIZE;
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
    recordMovement() {
        const d = dist(this.lastX, this.lastY, this.x, this.y);
        // Only add if movement actually occurred to avoid precision noise
        if (d > 0.0001) {
            this.totalDistanceMoved += d;
        }
        this.lastX = this.x;
        this.lastY = this.y;
    }
}
//# sourceMappingURL=Entity.js.map