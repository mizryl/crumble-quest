import { TileManager } from "../world/TileManager.js";
export class BaseStation {
    ;
    constructor(x, y, sprites, isOccupied) {
        this.isHighlighted = false;
        this.x = x;
        this.y = y;
        this.stationSprites = sprites;
        this.isOccupied = isOccupied;
    }
    display() {
        const size = TileManager.TILE_SIZE;
        push();
        if (this.isHighlighted) {
            tint(0, 200, 255);
        }
        else {
            noTint();
        }
        if (this.stationSprites) {
            image(this.stationSprites, this.x * size, this.y * size, size, size);
        }
    }
    //highlights the station when the player is facing it
    setHighlight(visible) {
        this.isHighlighted = visible;
    }
}
//# sourceMappingURL=BaseStation.js.map