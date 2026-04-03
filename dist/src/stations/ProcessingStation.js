import { BaseStation } from "./BaseStation.js";
export class ProcessingStation extends BaseStation {
    constructor(x, y, sprites, isOccupied, id, isSolid, isInteractive, recipeManager, maxItem) {
        super(x, y, sprites, isOccupied, id, isSolid, isInteractive);
        this.processingTime = 3;
        this.currentProgress = 0;
        this.isFinished = false;
        this.isProcessing = false;
        this.contents = [];
        this.recipeManager = recipeManager;
        this.maxItem = maxItem;
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
        // if (this.isProcessing && !player.heldItem) return; //can't touch it while prepping
        //DEPOSIT
        if (player.heldItem && this.contents.length < this.maxItem) {
            this.contents.push(player.heldItem);
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
                // this.isFinished = false;
                // this.currentProgress = 0;
            }
            else {
                player.heldItem = this.contents.join('+');
                console.log('pickup: ' + this.contents.join('+'));
            }
            this.contents = []; //clears table
            this.isFinished = false;
            this.isProcessing = false;
            this.currentProgress = 0;
        }
    }
    // player manually process the item
    work(dt) {
        if (this.isFinished || this.contents.length === 0)
            return;
        this.isProcessing = true;
        this.currentProgress += dt;
        console.log(`Manual Progress: ${Math.floor((this.currentProgress / this.processingTime) * 100)}%`);
        if (this.currentProgress >= this.processingTime) {
            this.finishProcessing();
        }
    }
    getTransformedItem() {
        return this.contents[0] || '';
    }
}
//# sourceMappingURL=ProcessingStation.js.map