import { Image } from "p5";
import { TileManager } from "../world/TileManager.js";
import { Collidable } from "../Collidable.js";
import { BaseStation } from "../stations/BaseStation.js";

export abstract class Entity implements Collidable {
    public up: Image[] = [];
    public down: Image[] = [];
    public left: Image[] = [];
    public right: Image[] = [];
    public currentAnimation: Image[] = [];
    protected currentFrame: number = 0;
    protected spriteCounter: number = 0;
    isSolid: boolean = true;

    public x: number;
    public y: number;
    public speed: number;
    public isMoving: boolean;

    public entityId: string;
    public totalDistanceMoved: number = 0;
    protected lastX: number;
    protected lastY: number;


    constructor(x: number, y: number, moving:boolean, speed: number,
                sprites: any, id: string) {
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

    public display(): void {
        let img = this.currentAnimation[this.currentFrame];
        const size = TileManager.TILE_SIZE;
        // Calculate height based on the image's original proportions
        let displayWidth = size; 
        let displayHeight = size * (img.height / img.width); 
            
        image(img, this.x * size, this.y * size, displayWidth, displayHeight);
    }

    abstract update(tileM: TileManager, stations: BaseStation[]): void;

    public getHitbox(checkX: number = this.x, checkY: number = this.y) {
        const size = TileManager.TILE_SIZE;
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

    protected recordMovement(): void {
        const d = dist(this.lastX, this.lastY, this.x, this.y);
        
        // Only add if movement actually occurred to avoid precision noise
        if (d > 0.0001) {
            this.totalDistanceMoved += d;
        }

        this.lastX = this.x;
        this.lastY = this.y;
    }
    
   
}