import { BaseStation } from "./BaseStation.js";
import { TileManager } from "../world/TileManager.js";
export class CheckoutCounter extends BaseStation {
    constructor(x, y, sprites) {
        super(x, y, sprites, false);
    }
    interact() {
    }
    display() {
        const size = TileManager.TILE_SIZE;
        if (this.isHighlighted) {
            tint(0, 200, 225);
        }
        else {
            noTint();
        }
        if (this.stationSprites) {
            push();
            image(this.stationSprites, this.x * size, this.y * size, size * 2, size);
            fill(100);
            push();
            translate(size + 32, 0);
            rectMode(CENTER);
            rect(this.x * size, this.y * size, 32, 16);
            //neck
            translate(this.x + 4, size * 2.3);
            rect(this.x * size + 1, this.y + 2 * size, 4, 8);
            //screen
            translate(0, size * -2.55);
            rect(this.x * size, this.y * size, 16, 8);
            pop();
            pop();
        }
    }
}
//# sourceMappingURL=CheckoutStation.js.map