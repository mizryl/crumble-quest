import { BaseStation } from "./BaseStation.js";

export abstract class ProcessingStation extends BaseStation {

    public processingTime: number = 5;
    public currentProgress: number = 0;
    public isFinsihed: boolean = false;
    protected isProcessing: boolean = false;

    constructor(x: number, y: number, sprites: any, isOccupied: boolean) {
        super(x, y, sprites, isOccupied)
    }

    abstract startProcessing(): void;
    
    protected updateProgress(dt: number): void {
        if (!this.isProcessing || this.isFinsihed) return;

        this.currentProgress += dt;

        if (this.currentProgress >= this.processingTime) {
            this.finishProcessing();
        }
    }

    private finishProcessing(): void {
        this.isFinsihed = true;
        this.isProcessing = false;
        this.currentProgress = this.processingTime;
        console.log("Processing Complete");    
    }

}