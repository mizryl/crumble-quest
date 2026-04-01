import { Image } from "p5";
import { ProcessingStation } from "./ProcessingStation.js";

export class PrepTable extends ProcessingStation {
    constructor(x: number, y: number, sprites: Image) {
        super(x, y, sprites, false, 'prep', true, true);

    }


    override interact(): void {
        
    }
    
    override startProcessing(): void {
        
    }
}