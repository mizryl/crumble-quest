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
        this.currentAnimation = this.down;
    }
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