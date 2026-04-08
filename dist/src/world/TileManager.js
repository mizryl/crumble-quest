export class TileManager {
    constructor() {
        this.map = [];
        this.tileImg = [];
    }
    load() {
        this.tileImg[0] = loadImage('assets/img/tile1.png');
        this.tileImg[1] = loadImage('assets/img/tile2.png');
        this.tileImg[2] = loadImage('assets/img/wall1.png');
        this.tileImg[3] = loadImage('assets/img/wall2.png');
        const lines = loadStrings('assets/map.txt');
        loadStrings('assets/map.txt', (result) => {
            this.parseLoadedMap(result);
        });
    }
    display() {
        if (this.map.length === 0)
            return;
        // Calculate how many tiles fit on the current screen
        const tilesX = Math.ceil(width / TileManager.TILE_SIZE);
        const tilesY = Math.ceil(height / TileManager.TILE_SIZE);
        for (let y = 0; y < tilesY; y++) {
            for (let x = 0; x < tilesX; x++) {
                const id = this.map[y][x];
                if (this.tileImg[id]) {
                    image(this.tileImg[id], x * TileManager.TILE_SIZE, y * TileManager.TILE_SIZE, TileManager.TILE_SIZE, TileManager.TILE_SIZE);
                }
            }
        }
    }
    parseLoadedMap(lines) {
        if (lines && lines.length > 0) {
            this.map = lines.map(line => line.trim().split(/\s+/).map(Number));
            console.log("Map successfully parsed in Setup!");
        }
        else {
            console.error("TileManager received empty map data!");
        }
    }
    // The total width in pixels
    get worldWidth() {
        return this.map.length > 0 ? this.map[0].length * TileManager.TILE_SIZE : 0;
    }
    // The total height in pixels
    get worldHeight() {
        return this.map.length * TileManager.TILE_SIZE;
    }
    canPlayerWalk(x, y) {
        x = constrain(x, 0, this.worldWidth);
    }
}
TileManager.TILE_SIZE = 64;
//# sourceMappingURL=TileManager.js.map