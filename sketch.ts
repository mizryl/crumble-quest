import { Image } from 'p5';
import { RollingPinButton } from './src/ui/RollingPinButton.js';
import { TileManager } from './src/world/TileManager.js';
import { Player } from './src/entities/Player.js'

import { SpriteData } from './src/interface.js';
import { KeyHandler } from './src/entities/KeyHandler.js';
import { BaseStation } from './src/stations/BaseStation.js';
import { Crates } from './src/stations/Crates.js';
import { Oven } from './src/stations/Oven.js';
import { PrepTable } from './src/stations/PrepTable.js';
import { PickupCounter } from './src/stations/PickupCounter.js';
import { DisplayCounter } from './src/stations/DisplayCounter.js';
import { CheckoutCounter } from './src/stations/CheckoutStation.js';

//start screen 
let startBtn: RollingPinButton;
let loadBtn: RollingPinButton;
let font: any;
let cloudImg: any;

//sprites-related
let tileM: TileManager = new TileManager();
let mapData: string[];
let playerSprites: SpriteData = { up: [], down: [], left: [], right: [] };
let stations: BaseStation[] = [];
let frontStations: BaseStation[] = [];

let stationSprites: { [key: string]: Image } = {};

//game-related
let player: Player;
let keyH: KeyHandler;

let gameState: "START" | "PLAYING" | "RESULTS";

let dayCount = 0;

function preload(): void {
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


}

function setup(): void {
  noSmooth();
  // const cnv = createCanvas(tileM.worldWidth, tileM.worldHeight);
  
  // // Force the CSS of the canvas to stay crisp
  // cnv.elt.style.imageRendering = 'pixelated';
  console.log("Setup is running!")
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
  console.log("Flour sprite status:", stationSprites['flour']);
  //stations
  stations.push(new Crates(1, 1.5, stationSprites['flour'], 'flour'));
  stations.push(new Crates(2, 1.5, stationSprites['eggs'], 'egg'));
  stations.push(new Crates(3, 1.5, stationSprites['fruit'], 'fruit'));
  stations.push(new Oven(8, 1.5, stationSprites['oven']));
  stations.push(new Oven(10, 1.5, stationSprites['oven']));
  stations.push(new PrepTable(5, 1.5, stationSprites['prep']));
  stations.push(new PrepTable(6, 1.5, stationSprites['prep']));
  frontStations.push(new PickupCounter(8, 4.5, stationSprites['pickup']));
  frontStations.push(new PickupCounter(10, 4.5, stationSprites['pickup']));
  frontStations.push(new PickupCounter(12, 4.5, stationSprites['pickup']));
  frontStations.push(new PickupCounter(14, 4.5, stationSprites['pickup']));
  frontStations.push(new DisplayCounter(0, 3.5, stationSprites['display']));
  frontStations.push(new DisplayCounter(2, 3.5, stationSprites['display']));
  frontStations.push(new DisplayCounter(6, 3.5, stationSprites['display']));
  frontStations.push(new CheckoutCounter(4, 4.5, stationSprites['checkout']));
}

function draw(): void {
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

function mousePressed(): void {
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

function drawMainMenu(): void {

  let bob = Math.sin(frameCount * 0.05) * 15;

  if (cloudImg) image(cloudImg, tileM.worldWidth/2-300, (tileM.worldHeight/2 - 250) + bob, 600, 200);

  
  fill(77, 61, 47);
  textSize(50);
  text("CRUMBLE QUEST", tileM.worldWidth/2, (tileM.worldHeight/2) + bob - 150);
  drawCloudBorder();

  startBtn.display();
  loadBtn.display();
}

function drawGameWorld(): void {
  background(235, 226, 214);
  tileM.display();
  text("test", tileM.worldWidth/2, tileM.worldHeight/2);
  
  
  for (let s of stations) {
 
    s.display();
  }
  
  if (player) {
    player.update(tileM, stations);
    player.display();

  }

  for (let s of frontStations) {
    s.display();
  }

}

function drawResults(): void {

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

function startGame(): void {
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

(window as any).preload = preload;
(window as any).setup = setup;
(window as any).draw = draw;
(window as any).mousePressed = mousePressed;
(window as any).keyPressed = keyPressed;
(window as any).keyReleased = keyReleased;