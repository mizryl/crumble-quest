import { Image } from "p5";
import { Entity } from './Entity.js';
// import { SpriteData } from "../interface.js";
import { KeyHandler } from "./KeyHandler.js";
import { TileManager } from "../world/TileManager.js";
import { BaseStation } from "../stations/BaseStation.js";

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

    override update(tileM: TileManager, stations: BaseStation[]): void {
        this.moving = this.keyH.upPressed || this.keyH.downPressed ||
                                this.keyH.leftPressed || this.keyH.rightPressed;

        if (this.keyH.upPressed) {
            this.currentAnimation = this.up;
            this.y -= this.speed;
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

        this.checkStationProximity(stations);
 
    }

    override display(): void {
        let img = this.currentAnimation[this.currentFrame];
        const size = TileManager.TILE_SIZE;
        // Calculate height based on the image's original proportions
        let displayWidth = this.tileSize; 
        let displayHeight = this.tileSize * (img.height / img.width); 
            
        image(img, this.x * size, this.y * size, displayWidth, displayHeight);
    }

    private checkStationProximity(stations: BaseStation[]): void {
    const size = TileManager.TILE_SIZE;

    //reset highlights
    for (const s of stations) s.setHighlight(false);

    const interactX = this.x * size;
    const interactY = this.y * size + 64; //waist down of the player

    //sensor box
    const reachY = -32; //player has to stand on the tile to highlight
    const reachX = 15;
    let sensor = { x: 0, y: 0, w: 0, h: 0 };

    if (this.currentAnimation === this.up) {
        sensor = { x: interactX + 10, y: interactY - reachY, w: 44, h: reachY };
    } 
    else if (this.currentAnimation === this.down) {
        sensor = { x: interactX + 10, y: (this.y * size) + 128, w: 44, h: reachY };
    } 
    else if (this.currentAnimation === this.left) {
        sensor = { x: interactX - reachX, y: interactY + 10, w: reachX, h: 44 };
    } 
    else if (this.currentAnimation === this.right) {
        sensor = { x: interactX + size, y: interactY + 10, w: reachX, h: 44 };
    }

    //Collision Check (AABB)
    let targetStation: BaseStation | null = null;
    for (const station of stations) {
        const hb = station.getHitbox();
        
        if (sensor.x < hb.x + hb.w &&
            sensor.x + sensor.w > hb.x &&
            sensor.y < hb.y + hb.h &&
            sensor.y + sensor.h > hb.y) {
            targetStation = station;
            break;
        }
    }

    if (targetStation) {
        targetStation.setHighlight(true);
        if (this.keyH.interactPressed) {
            targetStation.interact();
            this.keyH.interactPressed = false;
        }
    }
}
    
}

