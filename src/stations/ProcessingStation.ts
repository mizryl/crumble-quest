import { BaseStation } from "./BaseStation.js";

export abstract class ProcessingStation extends BaseStation {

    public processingTime: number = 5;
    public currentProgress: number = 0;
    public isFinished: boolean = false;
    protected isProcessing: boolean = false;

    constructor(x: number, y: number, sprites: any, isOccupied: boolean, id: string,
                isSolid: boolean, isInteractive: boolean) {
        super(x, y, sprites, isOccupied, id, isSolid, isInteractive);
    }

    abstract startProcessing(): void;
    
    protected updateProgress(dt: number): void {
        if (!this.isProcessing || this.isFinished) return;

        this.currentProgress += dt;

        if (this.currentProgress >= this.processingTime) {
            this.finishProcessing();
        }
    }

    private finishProcessing(): void {
        this.isFinished = true;
        this.isProcessing = false;
        this.currentProgress = this.processingTime;
        console.log("Processing Complete");    
    }

}