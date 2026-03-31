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
    // public moving: boolean;
    // public speed: number;


    constructor(x: number, y: number, moving:boolean, speed: number,
                sprites: any) {
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

    abstract update(tileM: TileManager, stations: BaseStation[]): void;
    abstract display(): void;

    public getHitbox() {
        const size = TileManager.TILE_SIZE;
        return {
            x: this.x * size,
            y: this.y * size, 
            w:  size,
            h: size,
        }
        
    }
    
   
}