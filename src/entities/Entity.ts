import { Image } from "p5";
import { TileManager } from "../world/TileManager.js";
import { Collidable } from "../Collidable.js";
import { BaseStation } from "../stations/BaseStation.js";

export abstract class Entity implements Collidable {
    public up: Image[] = [];
    public down: Image[] = [];
    public left: Image[] = [];
    public right: Image[] = [];
    protected currentAnimation: Image[] = [];
    protected currentFrame: number = 0;
    protected spriteCounter: number = 0;
    isSolid: boolean = true;

    public x: number;
    public y: number;
    public speed: number;
    public isMoving: boolean;


    constructor(x: number, y: number, moving:boolean, speed: number,
                sprites: any) {
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

    public display(): void {
        let img = this.currentAnimation[this.currentFrame];
        const size = TileManager.TILE_SIZE;
        // Calculate height based on the image's original proportions
        let displayWidth = size; 
        let displayHeight = size * (img.height / img.width); 
            
        image(img, this.x * size, this.y * size, displayWidth, displayHeight);
    }

    abstract update(tileM: TileManager, stations: BaseStation[]): void;
    // abstract display(): void;

    public getHitbox(checkX: number = this.x, checkY: number = this.y) {
        const size = TileManager.TILE_SIZE;
        // const padding = size * 0.1;
        const widthScale = 0.7;
        const hBoxW = size * widthScale;
        const xOffset = (size - hBoxW) / 2;
        return {
            x: (checkX * size) + xOffset,
            y: (checkY * size) + 110, 
            w:  hBoxW,
            h: size /2,
        }
        
    }
    
   
}