import { Entity } from './Entity.js';
import { TileManager } from "../world/TileManager.js";
import { ProcessingStation } from "../stations/ProcessingStation.js";
import { Oven } from "../stations/Oven.js";
export class Player extends Entity {
    constructor(x, y, sprites, keyH, recipeManager) {
        super(x, y, false, 0.06, sprites, "Player");
        this.tileSize = TileManager.TILE_SIZE;
        this.currentFrame = 0;
        this.debugMode = true;
        this.moving = false;
        this.currentTargetStation = null;
        this.heldItem = null;
        this.keyH = keyH;
        this.currentAnimation = this.down;
        this.recipeManager = recipeManager;
    }
    display() {
        super.display();
        if (this.heldItem !== null) {
            this.drawHeldItem();
        }
    }
    update(tileM, stations) {
        let nextX = this.x;
        let nextY = this.y;
        if (this.heldItem !== null) {
            this.drawHeldItem();
        }
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
        nextY = constrain(nextY, 1.01, (tileM.worldHeight / this.tileSize) - 6);
        //collision 
        let collision = false;
        const playerHB = this.getHitbox(nextX, nextY);
        for (const s of stations) {
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
        this.recordMovement();
    }
    checkStationProximity(stations) {
        const size = TileManager.TILE_SIZE;
        //reset highlights
        for (const s of stations)
            s.setHighlight(false);
        const interactX = this.x * size;
        const interactY = this.y * size + 64; //waist down of the player
        //sensor box (Player's)
        const reachY = -32; //player has to stand on the tile to highlight
        const reachX = 15;
        let sensor = { x: 0, y: 0, w: 0, h: 0 };
        if (this.currentAnimation === this.up) {
            sensor = { x: interactX + 30, y: interactY - reachY, w: 10, h: reachY };
        }
        else if (this.currentAnimation === this.down) {
            sensor = { x: interactX + 10, y: (this.y * size) + 128, w: 44, h: reachY };
        }
        else if (this.currentAnimation === this.left) {
            sensor = { x: interactX - reachX + 25, y: interactY + 10, w: reachX, h: 44 };
        }
        else if (this.currentAnimation === this.right) {
            sensor = { x: interactX + size - 25, y: interactY + 10, w: reachX, h: 44 };
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
            this.currentTargetStation = targetStation;
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
    drawHeldItem() {
        const size = TileManager.TILE_SIZE;
        //bubble position
        const bx = this.x * size;
        const by = this.y * size - 60;
        const bubbleW = 50;
        const bubbleH = 45;
        push();
        fill(255);
        noStroke();
        translate(0, 10);
        rect(bx + 5, by, bubbleW, bubbleH, 10);
        triangle(bx + 20, by + bubbleH, bx + 30, by + bubbleH, bx + 25, by + bubbleH + 10);
        pop();
        if (this.heldItem !== null) {
            const img = this.recipeManager.getSprite(this.heldItem);
            if (img) {
                imageMode(CENTER);
                image(img, bx + 5 + (bubbleW / 2), by + (bubbleH / 2) + 10, 32, 32);
                imageMode(CORNER); // Reset to default so it doesn't break other draws
            }
            else {
                // Fallback if image isn't loaded: show text
                noStroke();
                fill(0);
                textSize(8);
                textAlign(CENTER, CENTER);
                text(this.heldItem, bx + 5 + (bubbleW / 2), by + (bubbleH / 2));
            }
        }
    }
}
//# sourceMappingURL=Player.js.map