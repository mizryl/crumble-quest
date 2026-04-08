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
            const foodImg = this.recipeManager.getSprite(itemName);
            if (img) {
                imageMode(CENTER);
                image(img, bx + 5 + (bubbleW / 2), by + (bubbleH / 2), 32, 32);
                imageMode(CORNER); // Reset to default so it doesn't break other draws
            }
            else {
                // Fallback if image isn't loaded: show text
                noStroke();
                fill(0);
                textSize(8);
                textAlign(CENTER, CENTER);
                text(itemName, bx + 5 + (bubbleW / 2), by + (bubbleH / 2));
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
        // console.log(`Cooking Progress: ${Math.floor((this.currentProgress / this.processingTime) * 100)}%`);
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