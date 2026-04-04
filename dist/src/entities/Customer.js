import { Entity } from "./Entity.js";
export class Customer extends Entity {
    constructor(x, y, sprites, recipe, targetX, targetY) {
        super(x, y, true, 0.05, sprites);
        this.state = 'WALK-IN';
        this.orderTaken = false;
        this.targetX = targetX;
        this.targetY = targetY;
        this.recipeName = recipe;
        this.currentAnimation = this.right;
    }
    update(ileM, stations) {
        if (this.state === 'WALK-IN') {
            this.currentAnimation = this.right;
            this.x += this.speed;
            this.isMoving = true;
            if (this.x >= this.targetX) {
                this.currentAnimation = this.up;
                this.y -= this.speed;
                if (this.y <= this.targetY) {
                    this.state = 'WAITING';
                    this.isMoving = false;
                }
            }
            if (this.isMoving) {
                this.animate();
            }
        }
    }
    // override display() {
    //     let img = this.currentAnimation[this.currentFrame];
    //     const size = TileManager.TILE_SIZE;
    //     // Calculate height based on the image's original proportions
    //     let displayWidth = this.tileSize; 
    //     let displayHeight = this.tileSize * (img.height / img.width); 
    //     image(img, this.x * size, this.y * size, displayWidth, displayHeight);
    // }
    // }
    animate() {
        if (!this.isMoving) {
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
}
//# sourceMappingURL=Customer.js.map