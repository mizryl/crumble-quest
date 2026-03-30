import { Image } from "p5";
import { Entity } from './Entity.js';
import { SpriteData } from "../interface.js";
import { KeyHandler } from "./KeyHandler.js";

export class Player extends Entity {
    private readonly tileSize = 128;
    keyH: KeyHandler = new KeyHandler;
    currentFrame: number = 0;

    constructor (x: number, y: number, sprites: any) {
        super(x, y, false, 4, sprites);
        this.currentAnimation = this.down;

    }

    override update(): void {
        let moving: boolean = this.keyH.upPressed || this.keyH.downPressed ||
                                this.keyH.leftPressed || this.keyH.rightPressed;

        if (this.keyH.upPressed) {
            this.currentAnimation = this.up;
            this.y -= this.speed;
            console.log("UP");
        } else if (this.keyH.downPressed) {
            this.currentAnimation = this.down;
            this.y += this.speed;
        } else if (this.keyH.leftPressed) {
            this.currentAnimation = this.left;
            this.x -= this.speed;
        } else if (this.keyH.rightPressed) {
            this.currentAnimation = this.right;
            this.x += this.speed;
        }

        if (!moving) {
            this.currentFrame = 0;
        } else {
            this.spriteCounter++;
            if (this.spriteCounter > 5) {
                this.currentFrame = (this.currentFrame + 1) % 4;
                this.spriteCounter = 0;
            }
        }
        
        
    }

    override display(): void {
        // let img = this.currentAnimation[this.currentFrame];
        // image(img, this.x, this.y, 128,  256);
        let img = this.currentAnimation[this.currentFrame];
        
        // Calculate height based on the image's original proportions
        let displayWidth = this.tileSize; 
        let displayHeight = this.tileSize * (img.height / img.width); 
            
        image(img, this.x, this.y, displayWidth, displayHeight);
    }
    
}

