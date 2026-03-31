import { BaseStation } from "./BaseStation.js";
export class ProcessingStation extends BaseStation {
    constructor(x, y, sprites, isOccupied) {
        super(x, y, sprites, isOccupied);
        this.processingTime = 5;
        this.currentProgress = 0;
        this.isFinsihed = false;
        this.isProcessing = false;
    }
    updateProgress(dt) {
        if (!this.isProcessing || this.isFinsihed)
            return;
        this.currentProgress += dt;
        if (this.currentProgress >= this.processingTime) {
            this.finishProcessing();
        }
    }
    finishProcessing() {
        this.isFinsihed = true;
        this.isProcessing = false;
        this.currentProgress = this.processingTime;
        console.log("Processing Complete");
    }
}
//# sourceMappingURL=ProcessingStation.js.map