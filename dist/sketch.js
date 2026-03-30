import { RollingPinButton } from './src/ui/RollingPinButton.js';
import { TileManager } from './src/world/TileManager.js';
import { Player } from './src/entities/Player.js';
import { KeyHandler } from './src/entities/KeyHandler.js';
let startBtn;
let loadBtn;
let tileM = new TileManager();
let mapData;
let playerSprites = {
    up: [],
    down: [],
    left: [],
    right: []
};
let player;
let keyH;
let gameState;
const MIN_WIDTH = 1280;
const MIN_HEIGHT = 704;
let font;
let cloudImg;
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
    // if (player) {
    //   player.update();
    //   player.display();
    // }
}
function setup() {
    // noSmooth();
    pixelDensity(1);
    console.log("Setup is running!");
    let w = Math.max(windowWidth, MIN_WIDTH);
    let h = Math.max(windowHeight, MIN_HEIGHT);
    createCanvas(w, h);
    tileM.parseLoadedMap(mapData);
    startBtn = new RollingPinButton(w / 2, h / 2, "NEW GAME");
    loadBtn = new RollingPinButton(w / 2, h / 2 + 200, "LOAD GAME");
    gameState = "START";
    textFont(font);
    textAlign(CENTER, CENTER);
    console.log("Game initialized in START state");
    player = new Player(windowWidth / 2, windowHeight / 2, playerSprites);
    keyH = new KeyHandler;
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
        image(cloudImg, width / 2 - 600, (height / 2 - 500) + bob, 1200, 400);
    fill(77, 61, 47);
    textSize(100);
    text("CRUMBLE QUEST", width / 2, (height / 2) + bob - 300);
    drawCloudBorder();
    startBtn.display();
    loadBtn.display();
}
function drawGameWorld() {
    background(235, 226, 214);
    tileM.display();
    text("test", width / 2, height / 2);
    if (player) {
        player.update();
        player.display();
    }
}
function drawResults() {
}
function drawCloudBorder() {
    fill(255, 255, 255, 200);
    noStroke();
    for (let i = 0; i < width; i += 80) {
        ellipse(i, 20, 150, 100); //top
        ellipse(i, height - 20, 150, 100); //btm
    }
    for (let j = 0; j < height; j += 80) {
        ellipse(20, j, 100, 150); //left
        ellipse(width - 20, j, 100, 150); //right
    }
}
function startGame() {
    gameState = "PLAYING";
}
function keyPressed() {
    if (gameState == "PLAYING") {
        keyH.handlePressed(key);
    }
}
function keyReleased() {
    if (gameState == "PLAYING") {
        keyH.handleReleased(key);
    }
}
window.preload = preload;
window.setup = setup;
window.draw = draw;
window.mousePressed = mousePressed;
//# sourceMappingURL=sketch.js.map