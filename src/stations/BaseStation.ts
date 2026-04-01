import { Image } from "p5";
import { TileManager } from "../world/TileManager.js";
import { Collidable } from "../Collidable.js";
import { Player } from "../entities/Player.js";


export abstract class BaseStation implements Collidable{
    public stationSprites: Image;
    x: number;
    y: number;
    isOccupied: boolean;
    isHighlighted: boolean = false;
    isSolid: boolean;
    isInteractive: boolean;
    id: string;

    constructor(x: number, y: number, sprites: Image, isOccupied: boolean, id: string,
                isSolid: boolean, isInteractive: boolean) {
        this.x = x;
        this.y = y;
        this.stationSprites = sprites;
        this.isOccupied = isOccupied;
        this.id = id;
        this.isSolid = isSolid;
        this.isInteractive = isInteractive;

    }

    abstract interact(player: Player): void;

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

        if (!this.isInteractive) {
            this.isHighlighted = false;
            return;
        }

        this.isHighlighted = visible;
    }

    public setBoundary(x: number, y:number): void {
        this.x = x;
        this.y = y;
    }

      public getHitbox(checkX: number = this.x, checkY: number = this.y) {
        const size = TileManager.TILE_SIZE;
        const hitboxHeight = size ;
        const yOffset = size * 0.01;
        return {
            x: checkX * size,
            y: (checkY * size) + yOffset,
            w: size,
            h: hitboxHeight
        }
    }

}