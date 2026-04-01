import { TileManager } from "../world/TileManager.js";
export class BaseStation {
    constructor(x, y, sprites, isOccupied, id, isSolid, isInteractive) {
        this.isHighlighted = false;
        this.x = x;
        this.y = y;
        this.stationSprites = sprites;
        this.isOccupied = isOccupied;
        this.id = id;
        this.isSolid = isSolid;
        this.isInteractive = isInteractive;
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
        if (!this.isInteractive) {
            this.isHighlighted = false;
            return;
        }
        this.isHighlighted = visible;
    }
    setBoundary(x, y) {
        this.x = x;
        this.y = y;
    }
    getHitbox(checkX = this.x, checkY = this.y) {
        const size = TileManager.TILE_SIZE;
        const hitboxHeight = size;
        const yOffset = size * 0.01;
        return {
            x: checkX * size,
            y: (checkY * size) + yOffset,
            w: size,
            h: hitboxHeight
        };
    }
}
//# sourceMappingURL=BaseStation.js.map