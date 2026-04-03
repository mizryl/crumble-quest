import { ProcessingStation } from "./ProcessingStation.js";
export class PrepTable extends ProcessingStation {
    constructor(x, y, sprites, recipeManager, maxItem) {
        super(x, y, sprites, false, 'prep', true, true, recipeManager, maxItem);
    }
    finishProcessing() {
        super.finishProcessing();
        const result = this.recipeManager.getPrepResult(this.contents);
        this.contents = [result];
        if (result === 'ruined-food') {
            console.log("you messed up the recipe or steps");
        }
        else {
            console.log(`Finished Product Created: ${result}`);
        }
    }
    work(dt) {
        if (this.recipeManager.canProcess(this.contents, "PREP")) {
            super.work(dt);
        }
        // super.work(dt);
    }
}
//# sourceMappingURL=PrepTable.js.map