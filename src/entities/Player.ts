import { Image } from "p5";
import { Entity } from './Entity.js';
import { SpriteData } from "../interface.js";
import { KeyHandler } from "./KeyHandler.js";

export class Player extends Entity {
    private readonly playerSize = 128;
    keyH: KeyHandler = new KeyHandler;

    constructor (x: number, y: number, sprites: any) {
        super(x, y, false, 1, sprites);
        this.currentAnimation = this.down;

    }

    override update(): void {
        let moving: boolean = this.keyH.upPressed || this.keyH.downPressed ||
                                this.keyH.leftPressed || this.keyH.rightPressed;
        
    }

    override display(): void {
        let img = this.currentAnimation[this.currentFrame];
        image(img, this.x, this.y, this.playerSize, this.playerSize);
    }
    
}

