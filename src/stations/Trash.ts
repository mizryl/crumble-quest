import { Image } from "p5";
import { BaseStation } from "./BaseStation.js";
import { Player } from "../entities/Player";

export class Trash extends BaseStation {
    constructor(x: number, y: number, sprites: Image) {
        super(x, y, sprites, false, 'trash', true, true);
    }

    override interact(player: Player): void {
        if (player.inventoryFull) {
            player.inventoryFull = false;
            console.log("trashed item: " + player.itemGrabbed);
            player.itemGrabbed = '';
            
        }
    }
}