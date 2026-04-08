import { Image } from "p5";
import { BaseStation } from "./BaseStation.js";
import { Player } from "../entities/Player.js";

export class Crates extends BaseStation{

    private ingredientType: string;
    
    constructor(x: number, y: number, sprites: Image, type: string) {
        super(x,y, sprites, false, type, true, true);
        this.ingredientType = type;
    }

    override interact(player: Player): void {
        
        //add player.holdItem(this.ingredientType);
        if (!player.heldItem) {
            console.log(`Crate Opened. ${this.ingredientType} Grabbed`);
            player.heldItem = this.ingredientType;
            console.log(player.heldItem);
        }
    }

}