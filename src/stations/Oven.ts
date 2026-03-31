import { ProcessingStation } from './ProcessingStation.js';
import { Image } from 'p5';

export class Oven extends ProcessingStation {

    constructor(x: number, y: number, sprites: Image) {
        super(x, y, sprites, false);
    }

    override startProcessing(): void {
        
    }

    override interact():void {
        console.log("baking");
    }
}