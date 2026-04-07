import { BaseStation } from "./BaseStation.js";
import { TileManager } from "../world/TileManager.js";
export class ProcessingStation extends BaseStation {
    constructor(x, y, sprites, isOccupied, id, isSolid, isInteractive, recipeManager, maxItem) {
        super(x, y, sprites, isOccupied, id, isSolid, isInteractive);
        this.processingTime = 1;
        this.currentProgress = 0;
        this.isFinished = false;
        this.isProcessing = false;
        this.contents = [];
        this.recipeManager = recipeManager;
        this.maxItem = maxItem;
    }
    display() {
        super.display();
    }
    drawInterface() {
        // this. drawContents();
        if (this.processingTime > 0 && this.isProcessing) {
            this.drawProgressBar();
        }
    }
    drawProgressBar() {
        const barW = 60;
        const barH = 8;
        const barX = this.x * TileManager.TILE_SIZE + 2;
        const barY = this.y * TileManager.TILE_SIZE + 10;
        fill(25);
        // noStroke();
        rect(barX, barY, barW * this.processingTime, barH, 2);
        let progress = this.currentProgress / this.processingTime;
        fill(86, 196, 93);
        rect(barX, barY, barW * this.currentProgress, barH, 2);
    }
    startProcessing() {
        if (this.isFinished || this.contents.length === 0) {
            this.isProcessing = false;
            return;
        }
    }
    stopProcessing() {
        if (this.isFinished)
            return;
        if (this.isProcessing) {
            this.isProcessing = false;
            console.log("processing has stopped");
        }
    }
    updateProgress(dt) {
        if (!this.isProcessing || this.isFinished)
            return;
        this.currentProgress += dt;
        if (this.currentProgress >= this.processingTime) {
            this.finishProcessing();
        }
    }
    finishProcessing() {
        this.isFinished = true;
        this.isProcessing = false;
        this.currentProgress = this.processingTime;
        console.log("Processing Complete");
    }
    interact(player) {
        //DEPOSIT
        if (player.heldItem && this.contents.length < this.maxItem) {
            this.contents.push(player.heldItem);
            // this.contents.sort();
            player.heldItem = null;
            this.isFinished = false; //resets when new items are added
            this.currentProgress = 0;
            console.log(this.contents);
            return;
        }
        //PICK UP
        if (!player.heldItem && this.contents.length > 0) {
            if (this.isFinished) {
                player.heldItem = this.getTransformedItem();
                console.log(`You picked-up: ${player.heldItem}`);
                this.contents = []; //clears table
                this.isFinished = false;
                this.isProcessing = false;
                this.currentProgress = 0;
            }
            else {
                player.heldItem = this.contents.pop() || null;
                if (this.contents.length === 0) {
                    this.isProcessing = false;
                    this.currentProgress = 0;
                    return;
                }
            }
            if (this.contents.length === 0) {
                this.isProcessing = false;
                this.currentProgress = 0;
            }
        }
    }
    // player manually process the item
    work(dt) {
        if (this.isFinished || this.contents.length === 0)
            return;
        this.isProcessing = true;
        this.currentProgress += dt;
        // console.log(`Manual Progress: ${Math.floor((this.currentProgress / this.processingTime) * 100)}%`);
        if (this.currentProgress >= this.processingTime) {
            this.finishProcessing();
        }
    }
}
//# sourceMappingURL=ProcessingStation.js.map