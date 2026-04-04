import { Image } from "p5";
import { BaseStation } from "./BaseStation.js";
import { TileManager } from "../world/TileManager.js";

export class DisplayCounter extends BaseStation {
    constructor(x: number, y: number, sprites: Image) {
        super(x, y, sprites, false, "display", false, false);
    }

    override interact() {

    }

    override display(): void {
        const size = TileManager.TILE_SIZE;

        if (this.stationSprites) {
            image(this.stationSprites, this.x * size, this.y * size, size * 2, size*2);
        }
    }
    
    public override getHitbox(checkX: number = this.x, checkY: number = this.y) {
        const size = TileManager.TILE_SIZE;
        return {
            x: checkX * size,
            y: (checkY * size) + (size * 0.25), 
            w: size * 2, //2 tiles wide
            h: size 
        };
    }
}