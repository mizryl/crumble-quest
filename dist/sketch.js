import { RollingPinButton } from './src/ui/RollingPinButton.js';
import { TileManager } from './src/world/TileManager.js';
import { Player } from './src/entities/Player.js';
import { KeyHandler } from './src/entities/KeyHandler.js';
import { Crates } from './src/stations/Crates.js';
import { Oven } from './src/stations/Oven.js';
import { PrepTable } from './src/stations/PrepTable.js';
import { PickupCounter } from './src/stations/PickupCounter.js';
import { DisplayCounter } from './src/stations/DisplayCounter.js';
import { CheckoutCounter } from './src/stations/CheckoutStation.js';
import { Trash } from './src/stations/Trash.js';
import { RecipeManager } from './src/data/RecipeManager.js';
//start screen 
let startBtn;
let loadBtn;
let font;
let cloudImg;
//sprites-related
let tileM = new TileManager();
let mapData;
let playerSprites = { up: [], down: [], left: [], right: [] };
let stations = [];
let frontStations = [];
let stationSprites = {};
//game-related
let player;
let keyH;
let recipeManager;
let gameState;
let dayCount = 0;
function preload() {
    //tiles
    font = loadFont('assets/fonts/PixelCode-Bold.ttf');
    cloudImg = loadImage('assets/img/cloud.png');
    mapData = loadStrings('assets/map.txt');
    tileM.load();
    //player
    for (let i = 1; i <= 4; i++) {
        playerSprites.up.push(loadImage(`assets/img/c1up${i}.png`));
        playerSprites.down.push(loadImage(`assets/img/c1down${i}.png`));
        playerSprites.left.push(loadImage(`assets/img/c1left${i}.png`));
        playerSprites.right.push(loadImage(`assets/img/c1right${i}.png`));
    }
    //stations
    stationSprites['flour'] = loadImage('assets/img/flour.png');
    stationSprites['eggs'] = loadImage('assets/img/eggs.png');
    stationSprites['fruit'] = loadImage('assets/img/fruit.png');
    stationSprites['oven'] = loadImage('assets/img/oven.png');
    stationSprites['prep'] = loadImage('assets/img/prep-table.png');
    stationSprites['pickup'] = loadImage('assets/img/counter.png');
    stationSprites['display'] = loadImage('assets/img/display.png');
    stationSprites['checkout'] = loadImage('assets/img/counter.png');
    stationSprites['trash'] = loadImage('assets/img/trash.png');
}
function setup() {
    noSmooth();
    console.log("Setup is running!");
    tileM.parseLoadedMap(mapData);
    createCanvas(tileM.worldWidth, tileM.worldHeight);
    //homescreen
    startBtn = new RollingPinButton(tileM.worldWidth / 2, tileM.worldHeight / 2, "NEW GAME");
    loadBtn = new RollingPinButton(tileM.worldWidth / 2, tileM.worldHeight / 2 + 100, "LOAD GAME");
    gameState = "START";
    textFont(font);
    textAlign(CENTER, CENTER);
    console.log("Game initialized in START state");
    //Game-related
    keyH = new KeyHandler();
    player = new Player(5, 2, playerSprites, keyH);
    recipeManager = new RecipeManager();
    // console.log("Flour sprite status:", stationSprites['flour']);
    //stations
    stations.push(new Crates(3, 1.5, stationSprites['flour'], 'flour'));
    stations.push(new Crates(4, 1.5, stationSprites['eggs'], 'egg'));
    stations.push(new Crates(5, 1.5, stationSprites['fruit'], 'fruit'));
    stations.push(new Oven(10, 1.5, stationSprites['oven'], recipeManager, 1));
    stations.push(new Oven(12, 1.5, stationSprites['oven'], recipeManager, 1));
    stations.push(new PrepTable(7, 1.5, stationSprites['prep'], recipeManager, 2));
    stations.push(new PrepTable(8, 1.5, stationSprites['prep'], recipeManager, 2));
    stations.push(new Trash(1, 1.5, stationSprites['trash']));
    frontStations.push(new PickupCounter(8, 4.5, stationSprites['pickup']));
    frontStations.push(new PickupCounter(10, 4.5, stationSprites['pickup']));
    frontStations.push(new PickupCounter(12, 4.5, stationSprites['pickup']));
    frontStations.push(new PickupCounter(14, 4.5, stationSprites['pickup']));
    frontStations.push(new DisplayCounter(0, 3.5, stationSprites['display']));
    frontStations.push(new DisplayCounter(2, 3.5, stationSprites['display']));
    frontStations.push(new DisplayCounter(6, 3.5, stationSprites['display']));
    frontStations.push(new CheckoutCounter(4, 4.5, stationSprites['checkout']));
}
function draw() {
    background(235, 226, 214);
    switch (gameState) {
        case "START":
            drawMainMenu();
            break;
        case "PLAYING":
            drawGameWorld();
            break;
        case "RESULTS":
            drawResults();
            break;
    }
}
function mousePressed() {
    switch (gameState) {
        case "START":
            if (startBtn && startBtn.isClicked()) {
                // startGame();
                gameState = "PLAYING";
            }
            break;
        case "RESULTS":
            break;
    }
}
function drawMainMenu() {
    let bob = Math.sin(frameCount * 0.05) * 15;
    if (cloudImg)
        image(cloudImg, tileM.worldWidth / 2 - 300, (tileM.worldHeight / 2 - 250) + bob, 600, 200);
    fill(77, 61, 47);
    textSize(50);
    text("CRUMBLE QUEST", tileM.worldWidth / 2, (tileM.worldHeight / 2) + bob - 150);
    drawCloudBorder();
    startBtn.display();
    loadBtn.display();
}
function drawGameWorld() {
    background(235, 226, 214);
    const dt = deltaTime / 1000;
    const allStations = [...stations, ...frontStations];
    tileM.display();
    text("test", tileM.worldWidth / 2, tileM.worldHeight / 2);
    for (let s of stations) {
        s.display();
        if (s instanceof Oven) {
            s.update(dt);
        }
    }
    if (player) {
        player.update(tileM, allStations);
        player.display();
    }
    for (let s of frontStations) {
        s.display();
    }
}
function drawResults() {
}
function drawCloudBorder() {
    fill(255, 255, 255, 200);
    noStroke();
    for (let i = 0; i < tileM.worldWidth; i += 40) {
        ellipse(i, 10, 75, 50); //top
        ellipse(i, tileM.worldHeight - 10, 75, 50); //btm
    }
    for (let j = 0; j < tileM.worldHeight; j += 40) {
        ellipse(10, j, 50, 75); //left
        ellipse(tileM.worldWidth - 10, j, 50, 75); //right
    }
}
function startGame() {
    gameState = "PLAYING";
}
function keyPressed() {
    if (gameState == "PLAYING") {
        player.keyH.handlePressed(key);
    }
}
function keyReleased() {
    if (gameState == "PLAYING") {
        player.keyH.handleReleased(key);
    }
}
window.preload = preload;
window.setup = setup;
window.draw = draw;
window.mousePressed = mousePressed;
window.keyPressed = keyPressed;
window.keyReleased = keyReleased;
//# sourceMappingURL=sketch.js.map