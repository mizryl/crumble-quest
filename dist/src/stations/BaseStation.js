import { TileManager } from "../world/TileManager.js";
export class BaseStation {
    constructor(x, y, sprites, isOccupied) {
        this.isHighlighted = false;
        this.isSolid = true;
        this.x = x;
        this.y = y;
        this.stationSprites = sprites;
        this.isOccupied = isOccupied;
    }
    display() {
        const size = TileManager.TILE_SIZE;
        push();
        if (this.isHighlighted) {
            tint(150, 150, 150);
        }
        else {
            noTint();
        }
        if (this.stationSprites) {
            image(this.stationSprites, this.x * size, this.y * size, size, size);
        }
        pop();
    }
    setHighlight(visible) {
        this.isHighlighted = visible;
    }
    setBoundary(x, y) {
        this.x = x;
        this.y = y;
    }
    getHitbox() {
        const size = TileManager.TILE_SIZE;
        return {
            x: this.x * size,
            y: this.y * size,
            w: size,
            h: size
        };
    }
}
//# sourceMappingURL=BaseStation.js.map