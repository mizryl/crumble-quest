import { BaseStation } from "./BaseStation.js";
import { RecipeManager } from "../data/RecipeManager.js";
import { Player } from "../entities/Player.js";
import { TileManager } from "../world/TileManager.js";

export abstract class ProcessingStation extends BaseStation {

    public processingTime: number = 1;
    public currentProgress: number = 0;
    public isFinished: boolean = false;
    public isProcessing: boolean = false;
    protected recipeManager: RecipeManager;
    public contents: string[] = [];
    protected maxItem: number;

    constructor(x: number, y: number, sprites: any, isOccupied: boolean, id: string,
                isSolid: boolean, isInteractive: boolean, recipeManager: RecipeManager, maxItem: number) {
        super(x, y, sprites, isOccupied, id, isSolid, isInteractive);

        this.recipeManager = recipeManager;
        this.maxItem = maxItem;
    }

    abstract getTransformedItem(): string;

    override display(): void {
        super.display();

    }

    public drawInterface(): void {
        // this. drawContents();
        if (this.processingTime > 0 && this.isProcessing) {
            this.drawProgressBar();
        }
    }

    protected drawProgressBar(): void {
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


    public startProcessing(): void {
        if (this.isFinished || this.contents.length === 0) {
            this.isProcessing = false;
            return;
        }
    }
    public stopProcessing(): void {
        if (this.isFinished) return;

        if (this.isProcessing) {
            this.isProcessing = false;
            // console.log("processing has stopped")
        }
    }
    
    public updateProgress(dt: number): void {
        if (!this.isProcessing || this.isFinished) return;

        this.currentProgress += dt;

        if (this.currentProgress >= this.processingTime) {
            this.finishProcessing();
        }
    }

    protected finishProcessing(): void {
        this.isFinished = true;
        this.isProcessing = false;
        this.currentProgress = this.processingTime;
        // console.log("Processing Complete");    
    }

    override interact(player: Player): void {

        //DEPOSIT
        if (player.heldItem && this.contents.length < this.maxItem) {
            this.contents.push(player.heldItem);
            // this.contents.sort();
            player.heldItem = null;
            this.isFinished = false; //resets when new items are added
            this.currentProgress = 0;
            // console.log(this.contents);
            return;
        }

        //PICK UP
        if (!player.heldItem && this.contents.length > 0) {
            if (this.isFinished) {
                player.heldItem = this.getTransformedItem();
                // console.log(`You picked-up: ${player.heldItem}`)
                this.contents = []; //clears table
                this.isFinished = false;
                this.isProcessing = false;
                this.currentProgress = 0;
            } else {
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
    public work(dt: number): void {
        if (this.isFinished || this.contents.length === 0) return;

        this.isProcessing = true;
        this.currentProgress += dt;

        // console.log(`Manual Progress: ${Math.floor((this.currentProgress / this.processingTime) * 100)}%`);

        if (this.currentProgress >= this.processingTime) {
            this.finishProcessing();
        }
    }
}