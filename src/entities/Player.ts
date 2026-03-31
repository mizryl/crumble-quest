import { Image } from "p5";
import { Entity } from './Entity.js';
// import { SpriteData } from "../interface.js";
import { KeyHandler } from "./KeyHandler.js";
import { TileManager } from "../world/TileManager.js";

export class Player extends Entity {
    private readonly tileSize = TileManager.TILE_SIZE;
    public keyH: KeyHandler;
    currentFrame: number = 0;

    public moving: boolean = false;

    constructor (x: number, y: number, sprites: any, keyH: KeyHandler) {
        super(x, y, false, 0.05, sprites);
        this.keyH = keyH;        
        this.currentAnimation = this.down;
    }

    override update(tileM: TileManager): void {
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
        } else {
            this.spriteCounter++;
            if (this.spriteCounter > 5) {
                this.currentFrame = (this.currentFrame + 1) % 4;
                this.spriteCounter = 0;
            }
        }

        this.x = constrain(this.x, 0, 14);
        this.y = constrain(this.y, 0.1, 3);
 
    }

    override display(): void {
        let img = this.currentAnimation[this.currentFrame];
        const size = TileManager.TILE_SIZE;
        // Calculate height based on the image's original proportions
        let displayWidth = this.tileSize; 
        let displayHeight = this.tileSize * (img.height / img.width); 
            
        image(img, this.x * size, this.y * size, displayWidth, displayHeight);
    }
    
}

