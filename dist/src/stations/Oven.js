import { ProcessingStation } from './ProcessingStation.js';
export class Oven extends ProcessingStation {
    constructor(x, y, sprites, recipeManager, maxItem) {
        super(x, y, sprites, false, "oven", true, true, recipeManager, maxItem);
    }
    update(dt) {
        if (this.contents.length === 0 || this.isFinished) {
            this.isProcessing = false;
            return;
        }
        const item = this.contents[0];
        // if (!this.needsBaking(item) && !this.needsFrying(item)) {
        //     this.isProcessing = false;
        //     console.log("Can't fry or bake this'");
        //     return;
        // }
        if (!this.recipeManager.canProcess(this.contents, "BAKE") &&
            !this.recipeManager.canProcess(this.contents, "FRY")) {
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
    // private needsBaking(item: string): boolean {
    //     return ['dough', 'batter'].includes(item);
    // }
    // private needsFrying(item: string): boolean {
    //     return ['egg', 'chopped-fruit'].includes(item);
    // }
    finishProcessing() {
        super.finishProcessing();
        const input = this.contents[0];
        if (this.recipeManager.canProcess(this.contents, "BAKE")) {
            this.contents = [this.recipeManager.getBakeResult(input)];
        }
        else if (this.recipeManager.canProcess(this.contents, 'FRY')) {
            this.contents = [this.recipeManager.getFryResult(input)];
        }
        console.log(`DING! ${this.id} finished: ${this.contents[0]}`);
    }
}
//# sourceMappingURL=Oven.js.map