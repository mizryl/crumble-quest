import { Entity } from "./Entity.js";
import { TileManager } from "../world/TileManager.js";
import { PickupCounter } from "../stations/PickupCounter.js";
export class Customer extends Entity {
    constructor(x, y, sprites, recipe, targetX, targetY, recipeManager, hud, mood) {
        super(x, y, true, 0.05, sprites, "Customer");
        this.state = 'WALK-IN';
        this.orderTaken = false;
        this.hasSetWaitingSpot = false;
        this.slot = null;
        this.patience = 45;
        this.maxPatience = 45;
        this.targetX = targetX;
        this.targetY = targetY;
        this.recipeName = recipe;
        this.currentAnimation = this.right;
        this.recipeManager = recipeManager;
        this.hud = hud;
        this.moodSprites = mood;
    }
    display() {
        super.display();
        if (this.orderTaken && (this.state === 'ORDERED' || this.state === 'WAITING' || this.state === "WAITING_FOR_FOOD")) {
            this.order();
        }
        if (this.state === "WAITING" || this.state === "WAITING_FOR_FOOD") {
        }
        // this.displayPatienceIcon();
        this.drawPatienceBar();
        this.displayPatienceIcon();
    }
    update(tileM, stations) {
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = dist(this.x, this.y, this.targetX, this.targetY);
        if (distance > 0.1) {
            this.isMoving = true;
            if (Math.abs(dx) > this.speed) {
                this.currentAnimation = dx > 0 ? this.right : this.left;
                this.x += Math.sign(dx) * this.speed;
            }
            else if (Math.abs(dy) > this.speed) {
                this.currentAnimation = dy > 0 ? this.down : this.up;
                this.y += Math.sign(dy) * this.speed;
            }
        }
        else {
            this.isMoving = false;
            this.x = this.targetX;
            this.y = this.targetY;
            if (this.state === 'WALK-IN') {
                this.state = 'WAITING';
                this.recipeManager.recordWalkIn();
            }
            else if (this.state === 'ORDERED' && this.hasSetWaitingSpot) {
                this.state = 'WAITING_FOR_FOOD';
            }
        }
        if (this.state === 'WAITING' || this.state === "WAITING_FOR_FOOD") {
            this.patience -= deltaTime / 1000;
            if (this.patience <= 0) {
                this.leaveAngry();
            }
        }
        if (this.state === 'ORDERED' && this.orderTaken && !this.hasSetWaitingSpot) {
            this.prepareWaitingSlot();
        }
        //scan for food
        if (this.state === 'WAITING_FOR_FOOD') {
            this.checkForOrder(stations);
        }
        //go to pickup counter
        if (this.state === 'PICKUP_FOOD' && this.isAtDestination()) {
            this.finalizePickup();
            this.recipeManager.recordSale(this.recipeName);
        }
        if (this.isMoving) {
            this.animate();
        }
        else {
            this.currentFrame = 0;
            this.currentAnimation = this.up;
        }
        this.recordMovement();
    }
    animate() {
        if (!this.isMoving) {
            this.currentFrame = 0;
        }
        else {
            this.spriteCounter++;
            if (this.spriteCounter > 5) {
                this.currentFrame = (this.currentFrame + 1) % 4;
                this.spriteCounter = 0;
            }
        }
    }
    isAtDestination() {
        const distance = dist(this.x, this.y, this.targetX, this.targetY);
        return distance < 0.1;
    }
    order() {
        const size = TileManager.TILE_SIZE;
        //bubble position
        const bx = this.x * size;
        const by = this.y * size - 60;
        const bubbleW = 50;
        const bubbleH = 45;
        //bubble bkg
        push();
        fill(255);
        noStroke();
        rect(bx + 5, by, bubbleW, bubbleH, 10);
        //tail
        triangle(bx + 20, by + bubbleH, bx + 30, by + bubbleH, bx + 25, by + bubbleH + 10);
        pop();
        //use the recipeName to get the correct sprite from the manager
        const foodImg = this.recipeManager.getSprite(this.recipeName);
        if (foodImg) {
            imageMode(CENTER);
            image(foodImg, bx + 5 + (bubbleW / 2), by + (bubbleH / 2), 32, 32);
            imageMode(CORNER); // Reset to default so it doesn't break other draws
        }
        else {
            // Fallback if image isn't loaded: show text
            noStroke();
            fill(0);
            textSize(8);
            textAlign(CENTER, CENTER);
            text(this.recipeName, bx + 5 + (bubbleW / 2), by + (bubbleH / 2));
        }
    }
    handleWalkIn() {
        this.isMoving = true;
        this.currentAnimation = this.right;
        if (this.x < this.targetX) {
            this.x += this.speed;
        }
        else if (this.y > this.targetY) {
            this.currentAnimation = this.up;
            this.y -= this.speed;
        }
        else if (this.isAtDestination()) {
            this.state = 'WAITING';
            this.currentAnimation = this.up;
            this.isMoving = false;
        }
    }
    prepareWaitingSlot() {
        if (!this.hasSetWaitingSpot) {
            const freeSlot = Customer.waitingSlots.find(s => !s.occupied);
            if (freeSlot) {
                freeSlot.occupied = true;
                this.slot = freeSlot;
                this.setTarget(freeSlot.x, freeSlot.y);
                this.hasSetWaitingSpot = true;
                this.isMoving = true;
            }
        }
        if (this.hasSetWaitingSpot && this.isAtDestination()) {
            this.state = 'WAITING_FOR_FOOD';
        }
    }
    checkForOrder(stations) {
        for (let station of stations) {
            if (station instanceof PickupCounter) {
                if (station.contents.includes(this.recipeName) && !station.isClaimed) {
                    station.isClaimed = true;
                    this.targetCounter = station;
                    this.setTarget(station.x, station.y);
                    this.state = 'PICKUP_FOOD';
                    this.isMoving = true;
                    this.hasSetWaitingSpot = false;
                    break; //stops looking after finding one
                }
            }
        }
    }
    finalizePickup() {
        if (this.targetCounter) {
            this.targetCounter.contents = [];
            this.targetCounter.isClaimed = false;
        }
        const payment = this.recipeManager.getValue(this.recipeName);
        if (this.hud) {
            this.hud.addScore(payment);
        }
        this.leave();
    }
    leave() {
        if (this.slot) {
            this.slot.occupied = false;
            this.slot = null;
        }
        this.state = 'LEAVING';
        this.setTarget(this.x, 10);
        this.isMoving = true;
    }
    leaveAngry() {
        this.leave();
        this.hud.addScore(-20);
    }
    displayPatienceIcon() {
        if (this.state !== 'WAITING' && this.state !== 'WAITING_FOR_FOOD' && this.state !== 'ORDERED') {
            return;
        }
        const size = TileManager.TILE_SIZE;
        const percent = (this.patience / this.maxPatience) * 100;
        let img;
        if (percent > 60)
            img = this.moodSprites.happy;
        else if (percent > 30)
            img = this.moodSprites.neutral;
        else
            img = this.moodSprites.angry;
        push();
        if (img) {
            imageMode(CENTER);
            const bob = Math.sin(frameCount * 0.1) * 2;
            image(img, this.x * size + (size / 2) - 14, this.y * size - size / 16 + 5 + bob, 16, 16);
        }
        pop();
    }
    drawPatienceBar() {
        if (this.state !== 'WAITING' && this.state !== 'WAITING_FOR_FOOD' && this.state !== 'ORDERED') {
            return;
        }
        const size = TileManager.TILE_SIZE;
        const totalBarWidth = 34;
        const barHeight = 6;
        const screenX = this.x * size + (size / 2) + 10;
        const screenY = this.y * size;
        push();
        rectMode(CENTER);
        // Background (The white bar)
        noStroke();
        fill(255, 255, 255, 180);
        rect(screenX, screenY + 5, totalBarWidth, barHeight, 2);
        // Calculate Fill
        const fillPercent = constrain(this.patience / this.maxPatience, 0, 1);
        const currentFillWidth = fillPercent * totalBarWidth;
        if (this.patience > this.maxPatience * 0.6)
            fill(46, 204, 113);
        else if (this.patience > this.maxPatience * 0.3)
            fill(241, 196, 15);
        else
            fill(frameCount % 20 < 10 ? 255 : 150, 50, 50);
        // Draw the actual progress
        const leftEdge = screenX - (totalBarWidth / 2);
        const fillX = leftEdge + (currentFillWidth / 2);
        rect(fillX, screenY + 5, currentFillWidth, barHeight, 2);
        pop();
    }
    setTarget(tx, ty) {
        this.targetX = tx;
        this.targetY = ty;
    }
    getTargetX() {
        return this.targetX;
    }
    getTargetY() {
        return this.targetY;
    }
}
Customer.waitingSlots = [
    { x: 8, y: 7, occupied: false },
    { x: 9, y: 7, occupied: false },
    { x: 10, y: 7, occupied: false },
    { x: 11, y: 7, occupied: false },
    { x: 12, y: 7, occupied: false },
    { x: 13, y: 7, occupied: false },
];
//# sourceMappingURL=Customer.js.map