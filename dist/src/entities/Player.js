import { Entity } from './Entity.js';
import { TileManager } from "../world/TileManager.js";
import { ProcessingStation } from "../stations/ProcessingStation.js";
import { Oven } from "../stations/Oven.js";
export class Player extends Entity {
    constructor(x, y, sprites, keyH) {
        super(x, y, false, 0.05, sprites);
        this.tileSize = TileManager.TILE_SIZE;
        this.currentFrame = 0;
        this.debugMode = false;
        this.moving = false;
        // inventoryFull: boolean = false;
        this.heldItem = null;
        this.keyH = keyH;
        this.currentAnimation = this.down;
    }
    update(tileM, stations) {
        let nextX = this.x;
        let nextY = this.y;
        this.moving = this.keyH.upPressed || this.keyH.downPressed ||
            this.keyH.leftPressed || this.keyH.rightPressed;
        if (this.keyH.upPressed) {
            this.currentAnimation = this.up;
            nextY -= this.speed;
        }
        if (this.keyH.downPressed) {
            this.currentAnimation = this.down;
            nextY += this.speed;
        }
        if (this.keyH.leftPressed) {
            this.currentAnimation = this.left;
            nextX -= this.speed;
        }
        if (this.keyH.rightPressed) {
            this.currentAnimation = this.right;
            nextX += this.speed;
        }
        if (!this.moving) {
            this.currentFrame = 0;
        }
        else {
            this.spriteCounter++;
            if (this.spriteCounter > 5) {
                this.currentFrame = (this.currentFrame + 1) % 4;
                this.spriteCounter = 0;
            }
        }
        //boundaries
        nextX = constrain(nextX, 0, (tileM.worldWidth / this.tileSize) - 1);
        nextY = constrain(nextY, 0.1, (tileM.worldHeight / this.tileSize) - 7);
        //collision 
        let collision = false;
        const playerHB = this.getHitbox(nextX, nextY);
        for (const s of stations) {
            // if (s.id === 'display' || s.id === 'checkout' || s.id === 'pickup') continue;
            if (!s.isSolid)
                continue;
            const stationHB = s.getHitbox();
            if (playerHB.x < stationHB.x + stationHB.w &&
                playerHB.x + playerHB.w > stationHB.x &&
                playerHB.y < stationHB.y + stationHB.h &&
                playerHB.y + playerHB.h > stationHB.y) {
                collision = true;
                break;
            }
            //debugging player's hitbox
            if (this.debugMode) {
                push();
                noFill();
                stroke(0, 255, 0);
                strokeWeight(1);
                rect(playerHB.x, playerHB.y, playerHB.w, playerHB.h);
                pop();
            }
        }
        if (!collision) {
            this.x = nextX;
            this.y = nextY;
        }
        if (this.debugMode) {
            push();
            noFill();
            stroke(0, 0, 255);
            strokeWeight(2);
            for (let s of stations) {
                let hb = s.getHitbox();
                rect(hb.x, hb.y, hb.w, hb.h);
            }
            pop();
        }
        this.checkStationProximity(stations);
    }
    display() {
        let img = this.currentAnimation[this.currentFrame];
        const size = TileManager.TILE_SIZE;
        // Calculate height based on the image's original proportions
        let displayWidth = this.tileSize;
        let displayHeight = this.tileSize * (img.height / img.width);
        image(img, this.x * size, this.y * size, displayWidth, displayHeight);
    }
    checkStationProximity(stations) {
        const size = TileManager.TILE_SIZE;
        //reset highlights
        for (const s of stations)
            s.setHighlight(false);
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
        let targetStation = null;
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
            //single click (deposit/pickup)
            if (this.keyH.interactPressed) {
                targetStation.interact(this);
                this.keyH.interactPressed = false;
            }
            //continuous hold
            if (targetStation instanceof ProcessingStation) {
                // Check if this is a station that REQUIRES manual labor
                const isManualStation = !(targetStation instanceof Oven);
                if (this.keyH.processPressed && !this.heldItem && isManualStation) {
                    // Only call work if the player is holding the key AND it's manual
                    targetStation.work(deltaTime / 1000);
                }
                else if (isManualStation) {
                    // If it's a manual station and the key ISN'T pressed, stop it
                    targetStation.stopProcessing();
                }
                // Note: We don't call anything for Oven here because the 
                // Oven's own update() method handles its progress!
            }
        }
        if (this.debugMode) {
            push();
            noFill();
            stroke(255, 0, 0);
            strokeWeight(2);
            rect(sensor.x, sensor.y, sensor.w, sensor.h);
            pop();
        }
    }
}
//# sourceMappingURL=Player.js.map