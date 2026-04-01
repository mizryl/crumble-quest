import { ProcessingStation } from './ProcessingStation.js';
export class Oven extends ProcessingStation {
    constructor(x, y, sprites) {
        super(x, y, sprites, false, "oven", true, true);
    }
    startProcessing() {
    }
    interact() {
        console.log("baking");
    }
}
//# sourceMappingURL=Oven.js.map