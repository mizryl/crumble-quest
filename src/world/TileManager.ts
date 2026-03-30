import { Image } from "p5";

export class TileManager {
    private readonly tileSize = 128;

    public map: number[][] = [];
    private tileImg: Image[] = [];

    public load() {
        this.tileImg[0] = loadImage('assets/img/tile1.png');
        this.tileImg[1] = loadImage('assets/img/tile2.png');
        this.tileImg[2] = loadImage('assets/img/wall1.png');
        this.tileImg[3] = loadImage('assets/img/wall2.png');
        const lines = loadStrings('assets/map.txt') as unknown as string[];

        if (lines && lines.length > 0) {
            this.map = lines.map (line => 
                line.trim().split(/\+/).map(Number)
            );
            console.log("map loaded sucessfully", this.map);
        } else {
            console.error("failed to load map.txt");
        }
   
    }

    public display() {
        if (this.map.length === 0) return;
    
        // Calculate how many tiles fit on the current screen
        const tilesX = Math.ceil(width / this.tileSize);
        const tilesY = Math.ceil(height / this.tileSize);
    
        for (let y = 0; y < tilesY; y++) {
            let mapY: number;

            if (y < 2) {
                mapY = y;
            } else {
                mapY = 2 + ((y-2) % (this.map.length - 2));
            }
            for (let x = 0; x < tilesX; x++) {
                // The % operator wraps the index back to 0 when it hits the map limit
                // const mapY = y % this.map.length;
                const mapX = x % this.map[mapY].length;
                
                const id = this.map[mapY][mapX];
                if (this.tileImg[id]) {
                    image(this.tileImg[id], x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
                }
            }
        }
    }

    public parseLoadedMap(lines: string[]) {
        if (lines && lines.length > 0) {
            this.map = lines.map(line => line.trim().split(/\s+/).map(Number));
            console.log("Map successfully parsed in Setup!");
        } else {
            console.error("TileManager received empty map data!");
        }
    }

}