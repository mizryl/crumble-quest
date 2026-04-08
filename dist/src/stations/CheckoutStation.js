import { BaseStation } from "./BaseStation.js";
import { TileManager } from "../world/TileManager.js";
import { customer, refreshQueue } from "../../sketch.js";
export class CheckoutCounter extends BaseStation {
    constructor(x, y, sprites) {
        super(x, y, sprites, false, "checkout", false, true);
    }
    interact(player) {
        const targetCustomer = customer.find(c => c.state === 'WAITING' && c.isAtDestination());
        if (targetCustomer && !targetCustomer.orderTaken) {
            targetCustomer.orderTaken = true;
            targetCustomer.state = 'ORDERED';
            targetCustomer.order();
            refreshQueue();
        }
    }
    display() {
        const size = TileManager.TILE_SIZE;
        push();
        if (this.isHighlighted)
            tint(150);
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
            rect(this.x * size + 1, this.y + 2 * size + 60, 4, 8);
            //screen
            translate(0, size * -2.55);
            rect(this.x * size, this.y * size, 16, 8);
            pop();
            pop();
        }
        pop();
    }
    getHitbox(checkX = this.x, checkY = this.y) {
        const size = TileManager.TILE_SIZE;
        return {
            x: checkX * size,
            y: (checkY * size) - (size * 0.25),
            w: size * 2, // Correct: 2 tiles wide
            h: size
        };
    }
}
//# sourceMappingURL=CheckoutStation.js.map