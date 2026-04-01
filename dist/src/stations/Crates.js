import { BaseStation } from "./BaseStation.js";
export class Crates extends BaseStation {
    constructor(x, y, sprites, type) {
        super(x, y, sprites, false, type, true, true);
        this.ingredientType = type;
    }
    interact(player) {
        //add player.holdItem(this.ingredientType);
        if (!player.inventoryFull) {
            console.log(`Crate Opened. ${this.ingredientType} Grabbed`);
            player.inventoryFull = true;
            player.itemGrabbed = this.ingredientType;
            console.log(player.itemGrabbed);
        }
    }
}
//# sourceMappingURL=Crates.js.map