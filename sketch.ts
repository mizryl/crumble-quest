import { RollingPinButton } from './src/ui/RollingPinButton.js';

let startBtn: RollingPinButton;
let loadBtn: RollingPinButton;

let gameState: "START" | "PLAYING" | "RESULTS";

const MIN_WIDTH = 1280;
const MIN_HEIGHT = 704;

let font: any;
let cloudImg: any;

let dayCount = 0;

function preload(): void {
  font = loadFont('assets/fonts/PixelCode-Bold.ttf');
  cloudImg = loadImage('assets/img/cloud.png');
}

function setup(): void {
  console.log("Setup is running!")
  let w = Math.max(windowWidth, MIN_WIDTH);
  let h = Math.max(windowHeight, MIN_HEIGHT);
  createCanvas(w, h);
  
  startBtn = new RollingPinButton(w / 2, h / 2, "NEW GAME");
  loadBtn = new RollingPinButton(w / 2, h / 2 + 200, "LOAD GAME");

  gameState = "START";

  textFont(font);
  textAlign(CENTER, CENTER);
  console.log("Game initialized in START state");
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

  // textSize(100);
  // text("CRUMBLE QUEST", width/2, height/2 - 300);

}

function mousePressed(): void {
  switch (gameState) {
    case "START":
      
      break;
    case "RESULTS":
      
      break;
  }
}

function drawMainMenu(): void {

  let bob = Math.sin(frameCount * 0.05) * 15;

  if (cloudImg) image(cloudImg, width/2-600, (height/2 - 500) + bob, 1200, 400);

  
  fill(77, 61, 47);
  textSize(100);
  text("CRUMBLE QUEST", width/2, (height/2) + bob - 300);
  drawCloudBorder();
  startBtn.display();
  loadBtn.display();

}

function drawGameWorld(): void {

}

function drawResults(): void {

}

function drawCloudBorder() {
  fill(255, 255, 255, 200);
  noStroke();
  
  // Draw a bunch of overlapping circles around the edges
  // You can loop this to cover the whole perimeter!
  for (let i = 0; i < width; i += 80) {
    //top 
    ellipse(i, 20, 150, 100);
    //btm
    ellipse(i, height - 20, 150, 100);
  }
  
  for (let j = 0; j < height; j += 80) {
    ellipse(20, j, 100, 150); //left
    ellipse(width - 20, j, 100, 150); //right
  }
}

(window as any).preload = preload;
(window as any).setup = setup;
(window as any).draw = draw;
(window as any).mousePressed = mousePressed;