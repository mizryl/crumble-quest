import { BaseStation } from "./BaseStation.js";
export class ProcessingStation extends BaseStation {
    constructor(x, y, sprites, isOccupied, id, isSolid, isInteractive) {
        super(x, y, sprites, isOccupied, id, isSolid, isInteractive);
        this.processingTime = 5;
        this.currentProgress = 0;
        this.isFinished = false;
        this.isProcessing = false;
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
}
//# sourceMappingURL=ProcessingStation.js.map