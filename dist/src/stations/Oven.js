import { ProcessingStation } from './ProcessingStation.js';
import { TileManager } from '../world/TileManager.js';
export class Oven extends ProcessingStation {
    constructor(x, y, sprites, recipeManager, maxItem) {
        super(x, y, sprites, false, "oven", true, true, recipeManager, maxItem);
    }
    display() {
        super.display();
        if (this.contents.length > 0) {
            const itemName = this.contents[0];
            const img = this.recipeManager.getSprite(itemName);
            const size = TileManager.TILE_SIZE;
            let px = this.x * size;
            let py = this.y * size;
            if (img) {
                push();
                fill(255, 255, 255, 75);
                translate(0, -25);
                ellipse(px + size / 2, py - 2, size / 1.5);
                image(img, px + size / 4, py - 20, size / 2, size / 2);
                pop();
            }
            else {
                fill(77, 61, 47);
                textSize(5);
                text(itemName, px + px / 2, this.y);
            }
        }
    }
    update(dt) {
        if (this.contents.length === 0 || this.isFinished) {
            this.isProcessing = false;
            return;
        }
        const item = this.contents[0];
        const canBake = this.recipeManager.canProcess(this.contents, "BAKE");
        const canFry = this.recipeManager.canProcess(this.contents, "FRY");
        if (!canBake && !canFry) {
            this.isProcessing = false;
            return;
        }
        //items are baked and fried automatically
        this.isProcessing = true;
        this.updateProgress(dt);
        console.log(`Cooking Progress: ${Math.floor((this.currentProgress / this.processingTime) * 100)}%`);
    }
    interact(player) {
        super.interact(player);
    }
    finishProcessing() {
        super.finishProcessing();
        const input = this.contents[0];
        let action = "BAKE";
        if (this.recipeManager.canProcess(this.contents, "FRY")) {
            action = "FRY";
        }
        const result = this.recipeManager.getResult(this.contents, action);
        this.contents = [result];
        // if (this.recipeManager.canProcess(this.contents, "BAKE")) {
        //     this.contents = [this.recipeManager.getBakeResult(input)];
        // } else if (this.recipeManager.canProcess(this.contents, 'FRY')) {
        //     this.contents = [this.recipeManager.getFryResult(input)];
        // } 
        console.log(`DING! ${this.id} finished: ${this.contents[0]}`);
    }
    getTransformedItem() {
        if (this.isFinished) {
            return this.contents[0];
        }
        let result = this.recipeManager.getResult(this.contents, 'BAKE');
        if (result === 'ruined-food') {
            result = this.recipeManager.getResult(this.contents, 'FRY');
        }
        return result;
    }
}
//# sourceMappingURL=Oven.js.map