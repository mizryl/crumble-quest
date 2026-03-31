import { Image } from "p5";
import { BaseStation } from "./BaseStation.js";

export class Crates extends BaseStation{

    private ingredientType: string;
    
    constructor(x: number, y: number, sprites: Image, type: string) {
        super(x,y, sprites, false);
        this.ingredientType = type;
    }

    override interact(): void {
        console.log(`Crate Opened. ${this.ingredientType} Grabbed`);
        //add player.holdItem(this.ingredientType);
    }

}