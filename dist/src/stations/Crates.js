import { BaseStation } from "./BaseStation.js";
export class Crates extends BaseStation {
    constructor(x, y, sprites, type) {
        super(x, y, sprites, false);
        this.ingredientType = type;
    }
    interact() {
        console.log(`Crate Opened. ${this.ingredientType} Grabbed`);
        //add player.holdItem(this.ingredientType);
    }
}
//# sourceMappingURL=Crates.js.map