import { Image } from "p5";
import { BaseStation } from "./BaseStation.js";
import { TileManager } from "../world/TileManager.js";

export class PickupCounter extends BaseStation {
    constructor(x: number, y: number, sprites: Image) {
        super(x, y, sprites, false, "pickup", false, true);
    
    }

    override interact() {

    }

    override display(): void {
        const size = TileManager.TILE_SIZE;

        push();
        if  (this.isHighlighted) {
            tint(150, 150, 150);
        } else {
            noTint();
        }

        if (this.stationSprites) {
            image(this.stationSprites, this.x * size, this.y * size, size *2, size);
        }

        pop();

    }

    public override getHitbox(checkX: number = this.x, checkY: number = this.y) {
        const size = TileManager.TILE_SIZE;
        return {
            x: checkX * size,
            y: (checkY * size) - (size * 0.25),
            w: size * 2, // Matches the size * 2 in display()
            h: size * 1.2
        };
    }

}