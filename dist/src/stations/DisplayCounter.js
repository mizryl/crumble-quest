import { BaseStation } from "./BaseStation.js";
import { TileManager } from "../world/TileManager.js";
export class DisplayCounter extends BaseStation {
    constructor(x, y, sprites) {
        super(x, y, sprites, false);
    }
    interact() {
    }
    display() {
        const size = TileManager.TILE_SIZE;
        if (this.stationSprites) {
            image(this.stationSprites, this.x * size, this.y * size, size * 2, size * 2);
        }
    }
}
//# sourceMappingURL=DisplayCounter.js.map