import { ProcessingStation } from "./ProcessingStation.js";
export class PrepTable extends ProcessingStation {
    constructor(x, y, sprites, recipeManager, maxItem) {
        super(x, y, sprites, false, 'prep', true, true, recipeManager, maxItem);
    }
    finishProcessing() {
        super.finishProcessing();
        // const result = this.recipeManager.getPrepResult(this.contents);
        // this.contents = [result];
        // if (result === 'ruined-food') {
        //     console.log("you messed up the recipe or steps");
        // } else {
        //     console.log(`Finished Product Created: ${result}`);
        // }
        let result = this.recipeManager.getResult(this.contents, "PREP");
        if (result === 'ruined-food') {
            result = this.recipeManager.getResult(this.contents, "ADD");
        }
        this.contents = [result];
        if (result === 'ruined-food') {
            console.log("Recipe Failed. No Recipe Match");
        }
        else {
            console.log(`Finished Product Created: ${result}`);
        }
    }
    work(dt) {
        const item = this.contents[0];
        if (this.contents.length === 1 && item === 'egg')
            return;
        super.work(dt);
    }
}
//# sourceMappingURL=PrepTable.js.map