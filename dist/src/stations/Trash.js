import { BaseStation } from "./BaseStation.js";
export class Trash extends BaseStation {
    constructor(x, y, sprites) {
        super(x, y, sprites, false, 'trash', true, true);
    }
    interact(player) {
        if (player.inventoryFull) {
            player.inventoryFull = false;
            console.log("trashed item: " + player.itemGrabbed);
            player.itemGrabbed = '';
        }
    }
}
//# sourceMappingURL=Trash.js.map