import { BaseStation } from "./BaseStation.js";
import { TileManager } from "../world/TileManager.js";
export class PickupCounter extends BaseStation {
    constructor(x, y, sprites, recipeManager) {
        super(x, y, sprites, false, "pickup", false, true);
        this.contents = [];
        this.maxItem = 1;
        this.isClaimed = false;
        this.recipeManager = recipeManager;
    }
    interact(player) {
        //deposit
        if (player.heldItem && this.contents.length < this.maxItem) {
            this.contents.push(player.heldItem);
            player.heldItem = null;
            this.isClaimed = false;
            console.log(`Placed ${this.contents[0]}`);
            return;
            //pickup
        }
        else if (!player.heldItem && this.contents.length > 0) {
            player.heldItem = this.contents.pop() || null;
            this.isClaimed = false;
            console.log(`Picked Up ${player.heldItem}`);
        }
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
                image(img, this.x * size + size / 4, this.y * size - 20, size - 32, size - 32);
            }
            else {
                fill(77, 61, 47);
                textSize(5);
                text(itemName, this.x * size + px / 2, this.y);
            }
        }
    }
    getHitbox(checkX = this.x, checkY = this.y) {
        const size = TileManager.TILE_SIZE;
        return {
            x: checkX * size,
            y: (checkY * size) - (size * 0.25),
            w: size,
            h: size * 1.2
        };
    }
}
//# sourceMappingURL=PickupCounter.js.map