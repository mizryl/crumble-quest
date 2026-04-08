import { BaseStation } from "./BaseStation.js";
export class Trash extends BaseStation {
    constructor(x, y, sprites) {
        super(x, y, sprites, false, 'trash', true, true);
    }
    interact(player) {
        if (player.heldItem) {
            console.log("trashed item: " + player.heldItem);
            player.heldItem = null;
        }
    }
}
//# sourceMappingURL=Trash.js.map