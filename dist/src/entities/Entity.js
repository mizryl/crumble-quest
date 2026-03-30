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
        this.up = sprites.up;
        this.down = sprites.down;
        this.left = sprites.left;
        this.right = sprites.right;
        this.x = x;
        this.y = y;
        // this.moving = moving;
        // this.speed = speed;
        this.currentAnimation = this.down;
    }
}
//# sourceMappingURL=Entity.js.map