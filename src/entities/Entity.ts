import { Image } from "p5";

export abstract class Entity {
    public up: Image[] = [];
    public down: Image[] = [];
    public left: Image[] = [];
    public right: Image[] = [];
    protected currentAnimation: Image[] = [];
    protected currentFrame: number = 0;
    
    public x: number;
    public y: number;
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
        // this.moving = moving;
        // this.speed = speed;
        this.currentAnimation = this.down;
    }

    abstract update(): void;
    abstract display(): void;

}