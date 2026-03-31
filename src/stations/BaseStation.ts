import { Image } from "p5";
import { TileManager } from "../world/TileManager.js";
import { Collidable } from "../Collidable.js";


export abstract class BaseStation implements Collidable{
    public stationSprites: Image;
    x: number;
    y: number;
    isOccupied: boolean;
    isHighlighted: boolean = false;
    isSolid: boolean = true;

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
            tint(150, 150, 150);
        } else {
            noTint();
        }

        if (this.stationSprites) {
            image(this.stationSprites, this.x * size, this.y * size, size, size);
        }
        pop();
    }
    
    public setHighlight(visible: boolean): void {
        this.isHighlighted = visible;
    }

    public setBoundary(x: number, y:number): void {
        this.x = x;
        this.y = y;
    }

      public getHitbox() {
        const size = TileManager.TILE_SIZE;
        return {
            x: this.x * size,
            y: this.y * size,
            w: size,
            h: size
        }
    }

}