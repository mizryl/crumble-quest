import { ProcessingStation } from "./ProcessingStation.js";
import { TileManager } from "../world/TileManager.js";
export class PrepTable extends ProcessingStation {
    constructor(x, y, sprites, recipeManager, maxItem) {
        super(x, y, sprites, false, 'prep', true, true, recipeManager, maxItem);
    }
    display() {
        super.display();
        if (this.contents.length > 0) {
            // const itemName = this.contents[0];
            // const img = this.recipeManager.getSprite(itemName);
            const size = TileManager.TILE_SIZE;
            let px = this.x * size;
            let py = this.y * size;
            this.contents.forEach((itemName, index) => {
                const img = this.recipeManager.getSprite(itemName);
                const offsetX = px + (index * 30);
                const offsetY = py - 20;
                if (img) {
                    image(img, offsetX, offsetY, size - 32, size - 32);
                }
                else {
                    fill(255); // Nice dark brown for readability
                    textSize(8);
                    textAlign(LEFT);
                    text(itemName, offsetX, offsetY);
                }
            });
        }
    }
    finishProcessing() {
        super.finishProcessing();
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
    getTransformedItem() {
        if (this.isFinished) {
            return this.contents[0];
        }
        let result = this.recipeManager.getResult(this.contents, 'PREP');
        if (result === 'ruined-food') {
            result = this.recipeManager.getResult(this.contents, "ADD");
        }
        return result;
    }
}
//# sourceMappingURL=PrepTable.js.map