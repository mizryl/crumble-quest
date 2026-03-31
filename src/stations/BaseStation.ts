import { Image } from "p5";
import { TileManager } from "../world/TileManager.js";


export abstract class BaseStation {
    public stationSprites: Image;;
    x: number;
    y: number;
    isOccupied: boolean;
    isHighlighted: boolean = false;

    constructor(x: number, y: number, sprites: Image, isOccupied: boolean) {
        this.x = x;
        this.y = y;
        this.stationSprites = sprites;
        this.isOccupied = isOccupied;
    }

    abstract interact(): void;

    public display(): void {
        const size = TileManager.TILE_SIZE

        push();
        if (this.isHighlighted) {
            tint(0, 200, 255);
        } else {
            noTint();
        }

        if (this.stationSprites) {
            image(this.stationSprites, this.x * size, this.y * size, size, size);
        }
    }

    //highlights the station when the player is facing it
    public setHighlight(visible: boolean): void {
        this.isHighlighted = visible;
    }

}