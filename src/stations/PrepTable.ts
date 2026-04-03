import { Image } from "p5";
import { ProcessingStation } from "./ProcessingStation.js";
import { RecipeManager } from "../data/RecipeManager.js";

export class PrepTable extends ProcessingStation {

    constructor(x: number, y: number, sprites: Image, recipeManager: RecipeManager, maxItem: number) {
        super(x, y, sprites, false, 'prep', true, true, recipeManager, maxItem);
    }

    protected override finishProcessing(): void {
        super.finishProcessing();
        const result = this.recipeManager.getPrepResult(this.contents);
        this.contents = [result];

        if (result === 'ruined-food') {
            console.log("you messed up the recipe or steps");
        } else {
            console.log(`Finished Product Created: ${result}`);
        }
    }

    override work(dt: number): void {
        
        if (this.recipeManager.canProcess(this.contents, "PREP")) {
            super.work(dt);
        }

        // super.work(dt);

        
    }

}