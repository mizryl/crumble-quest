import { TileManager } from "../world/TileManager.js";
export class Entity {
    // public moving: boolean;
    // public speed: number;
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
        // this.moving = moving;
        // this.speed = speed;
        this.currentAnimation = this.down;
    }
    getHitbox() {
        const size = TileManager.TILE_SIZE;
        return {
            x: this.x * size,
            y: this.y * size,
            w: size,
            h: size,
        };
    }
}
//# sourceMappingURL=Entity.js.map