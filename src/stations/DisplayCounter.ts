import { Image } from "p5";
import { BaseStation } from "./BaseStation.js";
import { TileManager } from "../world/TileManager.js";

export class DisplayCounter extends BaseStation {
    constructor(x: number, y: number, sprites: Image) {

        super(x, y, sprites, false);
    }

    override interact() {

    }


    override display(): void {
        const size = TileManager.TILE_SIZE;

        if (this.stationSprites) {
            image(this.stationSprites, this.x * size, this.y * size, size * 2, size*2);
        }
    }
}