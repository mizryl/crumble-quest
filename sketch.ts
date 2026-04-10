import { Image } from 'p5';
import { SoundFile } from 'p5';

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
import { Trash } from './src/stations/Trash.js';
import { RecipeManager } from './src/data/RecipeManager.js';
import { Customer } from './src/entities/Customer.js';
import { HUD } from './src/ui/HUD.js';
import { ProcessingStation } from './src/stations/ProcessingStation.js';
import { Button } from './src/ui/Button.js';

import { MovementLogger } from './src/data/MovementLogger.js';

//btns
let startBtn: RollingPinButton;
let loadBtn: RollingPinButton;
let tutorialBtn: RollingPinButton;
let nextDayBtn: RollingPinButton;
let returnBtn: Button;
let downloadBtn: Button;



let font: any;
let cloudImg: any;

//sprites-related
let tileM: TileManager = new TileManager();
let mapData: string[];
let playerSprites: SpriteData = { up: [], down: [], left: [], right: [] };
let stations: BaseStation[] = [];
let frontStations: BaseStation[] = [];
let stationSprites: { [key: string]: Image } = {};

//customer
export let customer: Customer[]= [];
let spawnTimer = 0;
const SPAWN_INTERVAL = 5000;

const customerSprites: Record<string, any> = {
  'c2': { up: [], down: [], left: [], right: []},
  'c3': { up: [], down: [], left: [], right: []}
  // 'c4': { up: [], down: [], left: [], right: []}
}

//moods
let moodSprite: {happy: any, neutral: any, angry: any} = {
  happy: null,
  neutral: null,
  angry: null
};

//game-related
let player: Player;
let keyH: KeyHandler;
let recipeManager: RecipeManager;
let hud: HUD;

let gameState: "START" | "TUTORIAL" | "PLAYING" | "RESULTS" | "PAUSED";
let dayCount = 0;

//recipe book 
let searchQuery = '';
let scrollY = 0;

let lastBackspaceTime = 0;
const BACKSPACE_DELAY = 100;
const maxQueryLength: number = 30;

// tutorial
let tutorialPage = 0;
const MAX_TUTORIAL_PAGES = 4; 

let isDownloading = false;
let bgm: any;

let previousState: string = "START";
let musicPlaying: boolean = true;


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
  stationSprites['pickup-left'] = loadImage('assets/img/counter-left.png');
  stationSprites['pickup-right'] = loadImage('assets/img/counter-right.png');
  stationSprites['display'] = loadImage('assets/img/display.png');
  stationSprites['checkout'] = loadImage('assets/img/counter.png');
  stationSprites['trash'] = loadImage('assets/img/trash.png');

  //customer
  for (let c = 2; c <= 3; c++) {
    let id = `c${c}`;

      for (let i = 1; i <= 4; i++) {
        customerSprites[id].up.push(loadImage(`assets/img/${id}up${i}.png`));
        customerSprites[id].down.push(loadImage(`assets/img/${id}down${i}.png`));
        customerSprites[id].left.push(loadImage(`assets/img/${id}left${i}.png`));
        customerSprites[id].right.push(loadImage(`assets/img/${id}right${i}.png`));
      }
  }

  //patience moods
  moodSprite.happy = loadImage('assets/img/mood/happy.png');
  moodSprite.neutral = loadImage('assets/img/mood/neutral.png');
  moodSprite.angry = loadImage('assets/img/mood/mad.png');
  
  bgm = loadSound('assets/audio/music.mp3');
}

function setup(): void {
  noSmooth();
  pixelDensity(2);
  // console.log("Setup is running!")
  tileM.parseLoadedMap(mapData);
  createCanvas(tileM.worldWidth, tileM.worldHeight);
  
  //btns
  startBtn = new RollingPinButton(tileM.worldWidth / 2, tileM.worldHeight / 2, "NEW GAME");
  loadBtn = new RollingPinButton(tileM.worldWidth / 2, tileM.worldHeight / 2 + 100, "LOAD GAME");
  tutorialBtn = new RollingPinButton(width/2, height/2 + 200, "HOW TO PLAY");
  nextDayBtn = new RollingPinButton(width/2, height/2 + 150, "START NEXT DAY");
  returnBtn = new Button(width/2, height/2 + 210, 220, 40, "Return to Title Screen");
  downloadBtn = new Button(width/2, height/2 + 250, 200, 30, "Download Movement Log");




  gameState = "START";

  textFont(font);
  textAlign(CENTER, CENTER);
  // console.log("Game initialized in START state");

  //Game-related
  recipeManager = new RecipeManager();
  keyH = new KeyHandler();
  player = new Player(5, 3, playerSprites, keyH, recipeManager);
  hud = new HUD();

  stations.push(new Crates(5, 3.5, stationSprites['flour'], 'flour'));
  stations.push(new Crates(6, 3.5, stationSprites['eggs'], 'egg'));
  stations.push(new Crates(8, 3.5, stationSprites['fruit'], 'fruit'));
  stations.push(new Crates(9, 3.5, stationSprites['flour'], 'flour'));
  stations.push(new Oven(3, 3.5, stationSprites['oven'], recipeManager, 1));
  stations.push(new Oven(11, 3.5, stationSprites['oven'], recipeManager, 1));
  stations.push(new Oven(12, 3.5, stationSprites['oven'], recipeManager, 1));
  stations.push(new PrepTable(2, 3.5, stationSprites['prep'], recipeManager, 2));
  stations.push(new PrepTable(4, 3.5, stationSprites['prep'], recipeManager, 2));
  stations.push(new PrepTable(7, 3.5, stationSprites['prep'], recipeManager, 2));
  stations.push(new PrepTable(10, 3.5, stationSprites['prep'], recipeManager, 2));
  stations.push(new PrepTable(13, 3.5, stationSprites['prep'], recipeManager, 2));
  stations.push(new Trash(0, 3.5, stationSprites['trash']));
  frontStations.push(new PickupCounter(8, 5.5, stationSprites['pickup-left'], recipeManager));
  frontStations.push(new PickupCounter(9, 5.5, stationSprites['pickup-right'], recipeManager));
  frontStations.push(new PickupCounter(10, 5.5, stationSprites['pickup-left'], recipeManager));
  frontStations.push(new PickupCounter(11, 5.5, stationSprites['pickup-right'], recipeManager));
  frontStations.push(new PickupCounter(12, 5.5, stationSprites['pickup-left'], recipeManager));
  frontStations.push(new PickupCounter(13, 5.5, stationSprites['pickup-right'], recipeManager));
  frontStations.push(new PickupCounter(14, 5.5, stationSprites['pickup-left'], recipeManager));
  frontStations.push(new DisplayCounter(0, 4.5, stationSprites['display']));
  frontStations.push(new DisplayCounter(2, 4.5, stationSprites['display']));
  frontStations.push(new DisplayCounter(4, 4.5, stationSprites['display']));
  frontStations.push(new CheckoutCounter(6, 5.5, stationSprites['checkout']));
  //food
  recipeManager.registerSprite('sponge-cake', loadImage('assets/img/food/sponge-cake.png'));
  recipeManager.registerSprite('fruit-cake', loadImage('assets/img/food/fruit-cake.png'));
  recipeManager.registerSprite('bread', loadImage('assets/img/food/bread.png'));
  recipeManager.registerSprite('egg-toast', loadImage('assets/img/food/egg-toast.png'));
  recipeManager.registerSprite('jam-toast', loadImage('assets/img/food/jam-toast.png'));
  recipeManager.registerSprite('ruined-food', loadImage('assets/img/food/ruined-food.png'));
  //ingredients
  recipeManager.registerSprite('flour', loadImage('assets/img/food/flour.png'));
  recipeManager.registerSprite('dough', loadImage('assets/img/food/dough.png'));
  recipeManager.registerSprite('batter', loadImage('assets/img/food/batter.png'));
  recipeManager.registerSprite('egg', loadImage('assets/img/food/egg.png'));
  recipeManager.registerSprite('fried-egg', loadImage('assets/img/food/fried-egg.png'));
  recipeManager.registerSprite('fruit', loadImage('assets/img/food/fruit.png'));
  recipeManager.registerSprite('chopped-fruit', loadImage('assets/img/food/chopped-fruit.png'));
  recipeManager.registerSprite('jam', loadImage('assets/img/food/jam.png'));

}

function draw(): void {
  background(235, 226, 214);
  
  switch (gameState) {
    case "START":
      drawMainMenu();
      break;
    case "TUTORIAL":
      drawMainMenu();
      drawTutorialOverlay();
      break;
    case "PLAYING":
      drawGameWorld();
      hud.updateTime(deltaTime / 1000);
      break;

    case "PAUSED":
      if (previousState === "START" || previousState === "TUTORIAL") {
        drawMainMenu(); 
      } else if (previousState === "RESULTS") {
          drawGameWorld();
          drawResults();
      } else {
          drawGameWorld();
      }
      drawPausedOverlay();
      
      if (keyIsDown(BACKSPACE)) { // BACKSPACE is a p5 constant (8)
        if (millis() - lastBackspaceTime > BACKSPACE_DELAY) {
          searchQuery = searchQuery.slice(0, -1);
          lastBackspaceTime = millis();
        }
      }
      
      break;
    case "RESULTS":
      drawGameWorld();
      drawResults();
      break;
  }
}

function mousePressed(): void {
  switch (gameState) {
    case "START":
      
    if (bgm && !bgm.isPlaying()) {
        bgm.loop();
        bgm.setVolume(0.05);
      }
      
      if (startBtn && startBtn.isClicked()) startGame();
      if (loadBtn && loadBtn.isClicked()) loadGame();
      if (tutorialBtn.isClicked()) { 

        drawTutorialOverlay();
    }
      
      break;

    case "TUTORIAL": 
      drawTutorialOverlay();
      tutorialPage++;

      if (tutorialPage > MAX_TUTORIAL_PAGES) {
        tutorialPage = 0; // reset for next time
        gameState = "START"; // Go back to menu
      }
      break;

    case "PLAYING":
        if (player.currentTargetStation) {
            player.currentTargetStation.interact(player);
        }
      break;

    case "RESULTS":
      saveGame(); //save automatically
      
      if (bgm && bgm.isPlaying()) {
        bgm.setVolume(0.05);
      }

      if (nextDayBtn && nextDayBtn.isClicked()) {
        startNextDay();
      }

      if (returnBtn && returnBtn.isClicked()) {
        gameState = "START";
        return;
      }

      if (downloadBtn.isClicked() && !isDownloading) {
        isDownloading = true; // Lock it
        
        // Create a clean, shallow copy of the entities
        const currentCustomers = [...customer]; 
        const allMovers = [player, ...currentCustomers];
    
        // console.log(`Exporting report for ${allMovers.length} entities...`);
        
        try {
          MovementLogger.exportReport(allMovers);
        } catch (err) {
          console.error("Download failed:", err);
        } finally {
          // Small delay before allowing another download to prevent spam
          setTimeout(() => { isDownloading = false; }, 1000);
        }
      }
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
  tutorialBtn.display();
}

function drawTutorialOverlay(): void {
  gameState = "TUTORIAL";
  push();
  // Semi-transparent background
  fill(0, 0, 0, 200);
  rect(0, 0, width, height);

  // Main UI Panel
  translate(width/2, height/2);
  fill(250, 243, 217);
  stroke(77, 61, 47);
  strokeWeight(4);
  rectMode(CENTER);
  rect(0, 0, 500, 580, 15);

  fill(77, 61, 47);
  noStroke();
  textAlign(CENTER);
  textSize(32);
  text("HOW TO PLAY", 0, -240);

  // Page Content
  switch(tutorialPage) {
    case 0:
      drawMovementTutorial();
      break;
    case 1:
      drawCookingTutorial();
      break;
    case 2: 
      drawRecipeTutorial(); 
      break;
    case 3:
      drawInteractionTutorial();
      break;
    case 4:
      drawServingTutorial();
      break;
  }


  // footer
  textSize(16);
  fill(77, 61, 47, 150);
  text(`Page ${tutorialPage + 1} of ${MAX_TUTORIAL_PAGES + 1}`, 0, 230);
  textSize(14);
  text("Click anywhere to continue", 0, 260);
  
  pop();
}

function drawMovementTutorial() {
  push();
  textSize(24);
  text("MOVEMENT", 0, -160);

  const keySize = 50;
  const spacing = 5;
  const totalSize = keySize + spacing;

  const keys = [
    ["W", 0, -totalSize],      // Top
    ["A", -totalSize, 0],      // Left
    ["S", 0, 0],               // Center/Down
    ["D", totalSize, 0]        // Right
  ];

  push();
  translate(0, -20);
  
  for (let k of keys) {
    let label = k[0] as string;
    let x = k[1] as number;
    let y = k[2] as number;

    drawKey(label, x, y, keySize);
    drawKey("Shift", 0, 120, 110 );
  }
  pop();

  textSize(16);
  text("Use keys to move the baker", 0, 40);
  text("Hold SHIFT to Sprint!", 0, 150);
  pop();
}

function drawCookingTutorial() {
  push();
  textSize(24);
  textAlign(CENTER);
  text("THE KITCHEN FLOW", 0, -100);

  // flowchart steps
  const steps = [
    { label: "1. GET", sprite: stationSprites['flour'], x: -140 },
    { label: "2. PREP/ADD", sprite: stationSprites['prep'], x: 0 },
    { label: "3. BAKE", sprite: stationSprites['oven'], x: 140 }
  ];

  steps.forEach(step => {
    // Draw Sprite
    if (step.sprite) {
      imageMode(CENTER);
      image(step.sprite, step.x, -20, 60, 60);
    }
    
    // Draw Label
    fill(77, 61, 47);
    textSize(16);
    textAlign(CENTER);
    text(step.label, step.x, 35);
  });

  // Draw arrows between steps
  textSize(20);
  text("➔", -70, -20);
  text("➔", 70, -20);

  // Summary Text
  textSize(14);
  text("Follow the Recipe Book (ESC) to see\nwhat ingredients each dish needs!", 0, 100);
  pop();
}

function drawRecipeTutorial() {
  push();
  textSize(24);
  textAlign(CENTER);
  text("RECIPES & MISTAKES", 0, -140);

  push();
  translate(0, -70);
  
  drawKey("ESC", 0, 0, 80); 
  pop();

  // Recipe Book Text
  textAlign(CENTER);
  fill(77, 61, 47);
  textSize(16);
  text("THE RECIPE BOOK", 0, -15);
  textSize(12);
  fill(120, 110, 90);
  text("Open the book to check ingredients, steps, and prices.", 0, 5);

  // --- MIDDLE: Ruined Food ---
  const ruinedY = 85;
  rectMode(CENTER);
  fill(255, 100, 100, 30); 
  noStroke();
  rect(0, ruinedY, 420, 85, 10);

  const ruinedSprite = recipeManager.getSprite('ruined-food');
  if (ruinedSprite) {
    imageMode(CENTER);
    image(ruinedSprite, -160, ruinedY, 50, 50);
  }

  fill(77, 61, 47);
  textAlign(LEFT, CENTER);
  textSize(14);
  text("RUINED FOOD", -120, ruinedY - 20);
  textSize(11);
  text("Mixing the wrong ingredients creates waste.\nThese items cannot be baked or served!", -120, ruinedY + 10);

  // --- BOTTOM: The Trash ---
  push();
  translate(0, 175);
  if (stationSprites['trash']) {
    imageMode(CENTER);
    image(stationSprites['trash'], -160, 0, 50, 50);
  }
  
  textAlign(LEFT, CENTER);
  fill(77, 61, 47);
  textSize(14);
  text("TRASH STATION", -120, -10);
  textSize(11);
  fill(120, 110, 90);
  text("Throw away ruined food or unwanted items\nto clear your hands.", -120, 15);
  pop();

  pop();
}

function drawInteractionTutorial() {
  push();
  textSize(24);
  textAlign(CENTER);
  text("ACTIONS", 0, -100);

  const keySize = 50;
  const longKeyWidth = 140;

  //INTERACT KEY (J / Click)
  push();
  translate(-110, -10); 
  drawKey("J", 0, 0, keySize);
  textSize(14);
  fill(77, 61, 47);
  text("INTERACT", 0, 45);
  textSize(11);
  fill(120, 110, 90);
  text("(Pick up, Drop,\nTake Orders)", 0, 65);
  pop();

  //PROCESS KEY (K / Space)
  push();
  translate(110, -10);
  drawKey("K", 0, 0, keySize);
  drawKey("SPACE", 0, 70, longKeyWidth); 
  textSize(14);
  fill(77, 61, 47);
  text("PROCESS", 0, 115);
  textSize(11);
  fill(120, 110, 90);
  text("(Chop, Mix, Bake)", 0, 135);
  pop();
  
  // Mouse reminder at the bottom
  textSize(12);
  fill(77, 61, 47);
  text("You can also use MOUSE CLICK to interact!", 0, 180);
  pop();
}

function drawServingTutorial(): void {
  textSize(24);
  text("SERVING GUESTS", 0, -180);

  // --- TOP HALF: Taking Orders ---
  push();
  translate(-100, -100);
  drawKey("J", 0, 0);
  textAlign(LEFT, CENTER);
  textSize(16);
  fill(77, 61, 47);
  text("TAKE ORDER", 60, -10);
  textSize(12);
  fill(120, 110, 90);
  text("Stand in front of a guest\nand press J to take orders.", 60, 20);
  pop();

  // --- MIDDLE: Patience Meter ---
  push();
  translate(0, -10); 

  if (moodSprite.neutral) {
    imageMode(CENTER);
    image(moodSprite.neutral, -60, 0, 40, 40); 
  }

  const tutBarW = 120;
  const tutBarH = 15;
  const barX = 40;

  rectMode(CENTER);
  noStroke();
  fill(255, 255, 255, 200);
  rect(barX, 0, tutBarW, tutBarH, 5);
  
  fill(241, 196, 15); 
  rect(barX - 20, 0, tutBarW - 40, tutBarH, 5);

  textAlign(CENTER);
  fill(77, 61, 47);
  textSize(14);
  text("Watch their PATIENCE! If it runs out,\nthey leave without paying.", 0, 45);
  pop();

  // --- BOTTOM: The Pickup Counter ---
  push();
  translate(0, 150);
  
  if (stationSprites['pickup-left']) {
    imageMode(CENTER);
    image(stationSprites['pickup-left'], 0, -30, 80, 80);
  }

  translate(0, 40); 
  fill(235, 226, 214);
  stroke(77, 61, 47);
  rectMode(CENTER);
    
  noStroke();
  fill(77, 61, 47);
  textSize(14);
  textAlign(CENTER, CENTER);
  text("Place finished food on PICKUP COUNTER", 0, 0);
  pop();
}


function drawKey(label: string, x: number, y: number, w: number = 50): void {
  push();
  rectMode(CENTER);
  fill(235, 226, 214);
  stroke(77, 61, 47);
  strokeWeight(2);
  rect(x, y, w, 50, 8); 
  
  // shadow/depth effect
  fill(180, 170, 150);
  noStroke();
  rect(x, y + 22, w - 10, 4, 2);

  noStroke();
  fill(77, 61, 47);
  textAlign(CENTER, CENTER);
  // smaller font for long words like "SPACE" or "CLICK"
  textSize(label.length > 1 ? 12 : 20); 
  text(label, x, y + 2);
  pop();
}


function drawGameWorld(): void {
  background(235, 226, 214);
  const dt = deltaTime / 1000;
  const allStations = [...stations, ...frontStations];

  tileM.display();
  
  for (let s of stations)  s.display();
  
  if (player) player.display();

  for (let s of frontStations) s.display();

  for (let s of stations) {
    if (s instanceof Oven || s instanceof PrepTable) {
      s.drawInterface();
    }
  }

  //timer
  const timer = hud.getTimer();
  hud.displayScore(20, 20, 150, 40);
  hud.displayTimer(tileM.worldWidth - 60, 40, 70);

  if (gameState === 'PLAYING') {
    spawnTimer += dt;

    
    if (player) {
      if (keyIsDown(SHIFT)) {
      player.speed = 0.14;
    } else {
      player.speed = 0.07;
    }
      player.update(tileM, allStations);
    }
    manageCustomer(dt);
    
    for (let s of stations) {
      if (s instanceof Oven) s.update(dt);
    }
    if (timer <= 0) {
      gameState = 'RESULTS';
  
    }

  } else if (gameState === 'PAUSED') {
    drawPausedOverlay();
  } 

}

function manageCustomer(dt: number): void {
spawnTimer += deltaTime;

if (customer.length < 4 && spawnTimer > SPAWN_INTERVAL) {
    const spriteKeys = Object.keys(customerSprites);
    const randomKey = random(spriteKeys);
    const selectedSprites = customerSprites[randomKey];
    const allRecipes = recipeManager.getAllRecipes();

    if (selectedSprites && allRecipes.length > 0) {
        const randomRecipe = random(allRecipes);
        
        //vertical line queue
        const queueX = 7; 
        const queueY = 5 + (customer.length * 1);

        const c = new Customer(-1, 8, selectedSprites, randomRecipe.id, queueX, queueY, recipeManager, hud, moodSprite);
        customer.push(c);
        refreshQueue();
        spawnTimer = 0;
    }
}

  for (let c of customer) {
    c.update(tileM, frontStations);
    c.display();
  }

  //removes customer
  customer = customer.filter(c => {
    if (c.state === 'LEAVING' && c.isAtDestination()) {
      // spawnTimer = 0;
      return false;
    }
    return true;
  });

}

export function refreshQueue() {
  const waitingArea = customer.filter(c => c.state === 'WALK-IN' || c.state === 'WAITING');

  waitingArea.forEach((c, index) => {
    const queueX = 7;
    const queueY = 5 + index;
    if (c.getTargetX() !== queueX || c.getTargetY() !== queueY) {
      c.setTarget(queueX, queueY);
    }
  });
}

function drawPausedOverlay(): void {

  player.keyH.clearKeys();
  
  push();
  //Book Background
  translate(width/2, height/2);
  fill(250, 243, 217);
  stroke(77, 61, 47);
  strokeWeight(4);
  rectMode(CENTER);
  rect(0, 0, 500, 580, 10);

  //Title & Search Info
  fill(77, 61, 47);
  noStroke();
  textAlign(CENTER);
  textSize(24);
  text("RECIPE BOOK", 0, -240);
  textSize(14);
  textAlign(LEFT, CENTER);
  text("Searching: " + searchQuery + (frameCount % 60 < 30 ? "|" : ""), -200, -195);

  let recipes = recipeManager.getFilteredRecipes(searchQuery, 'title');

  
  // Dimensions (Scroll)
  let cardHeight = 140; 
  let spacing = 145; 
  let viewTop = -180;
  let viewBottom = 260;
  let viewHeight = viewBottom - viewTop;


  // Scrollbar
  let totalListHeight = recipes.length * spacing;
  let trackHeight = 280;
  let trackX = 235; // Right edge of the book
  let trackY = 40;

  if (totalListHeight > viewHeight) {
    // Draw Track
    fill(200, 190, 160, 150);
    noStroke();
    rect(trackX, trackY, 10, trackHeight, 5);

    // handleHeight represents the visible portion of the list
    let handleHeight = constrain(map(viewHeight, totalListHeight, totalListHeight + viewHeight, trackHeight - 200, 30), 30, trackHeight);
    // scrollPos maps how far we've scrolled to the track length
    let scrollPos = map(scrollY, 0, max(1, totalListHeight - viewHeight), 0, trackHeight - handleHeight);
    
    // Draw Handle
    fill(77, 61, 47);
    rect(trackX, -125 + scrollPos + handleHeight/2, 12, handleHeight, 5);
  }

  // DRAW RECIPES
  push();
  for (let i = 0; i < recipes.length; i++) {
    let r = recipes[i];
    // Calculate yPos based on index, spacing, and scrollY
    let yPos = viewTop + (i * spacing) - scrollY + 80;

    //Only draw if the card is visible within the book "window"
    if (yPos > viewTop + 70 && yPos < viewBottom - 60) {
      push();
      translate(0, yPos);
      
      //Card Background
      fill(255, 255, 255, 200);
      noStroke();
      rectMode(CENTER);
      rect(0, 0, 440, cardHeight, 8);

      //photo (left side)
      let sprite = recipeManager.getSprite(r.spriteKey);
      if (sprite) {
        imageMode(CENTER);
        image(sprite, -180, -15, 60, 60); 
      }

      //Title & Price
      fill(77, 61, 47);
      textAlign(LEFT, TOP);
      textSize(18);
      text(r.title.toUpperCase(), -140, -45);
      
      textAlign(RIGHT, TOP);
      text(`$${r.value}`, 200, -45);

      //Ingredients
      textSize(10);
      fill(120, 100, 80);
      textAlign(LEFT, TOP);
      text("INGREDIENTS: " + r.ingredients.join(", "), -140, -20);

      //draw recipe steps
      stroke(77, 61, 47, 40);
      line(-140, -3, 200, -3); 
      noStroke();
      
      textSize(9);
      
      for (let s = 0; s < r.steps.length; s++) {
        let step = r.steps[s];
        let stepY = 5 + (s * 11); 

        const cleanOutput = step.output.replace('-', ' ');
        const cleanItem = step.item.replace('-', ' ');

        fill(77, 61, 47);
        text(`• ${step.action}: ${cleanItem} ➔ ${cleanOutput}`, -140, stepY);
      }
      pop();
    }
  }
  pop();
  pop();
}

function drawResults(): void {
  push();

  translate(width/2, height/2);
  fill(255, 240);
  noStroke();
  rectMode(CENTER);
  rect(0, 0, 500, 580, 2);

  textSize(32);
  textAlign(CENTER);
  fill(0);
  text(`Day ${hud.getDayCount()} Complete!`, 0, -240);
  textAlign(LEFT, CENTER);
  fill(87, 78, 62);
  textSize(20)
  text(`Total Earned: `, -220, -180);
  text(`Guest Served: `, -220, -140);
  text(`Most Baked Item: `, -220, -100);

  push();
  const bestSeller = recipeManager.getBestSeller();

  textAlign(RIGHT, CENTER);
  translate(220, -180);
  text(`$${hud.getScore()}`, 0, 0);
  text(`${recipeManager.totalOrdersCompleted}/${recipeManager.totalCustomersEntered}`, 0, 40);
  text(recipeManager.getTopSellingTitle(), 0, 80);
  pop();
  pop();
  
  nextDayBtn.display();
  nextDayBtn.checkHover();
  returnBtn.display();
  returnBtn.checkHover();
  downloadBtn.display();
  downloadBtn.checkHover();
}

function startNextDay(): void {
  hud.resetTimer();
  customer = [];
  spawnTimer = 0;

  if (player && player.keyH) {
    player.keyH.clearKeys();
  }

  //Clear the stations (Remove any leftover dough/food on counters)
  const allStations = [...stations, ...frontStations];
  for (let s of allStations) {
    if (s instanceof PickupCounter) s.contents = [];
      if (s instanceof ProcessingStation) {
          s.isProcessing = false;
          s.currentProgress = 0;
          s.contents = [];
      }
  }
  if (player) {
    player.currentAnimation = player.down;
    player.isMoving = false;
    player.heldItem = null;
  }
  
  gameState = "PLAYING";
  spawnTimer = SPAWN_INTERVAL;
}

function mouseWheel(event: any) {
  if (gameState === "PAUSED") {
    scrollY += event.delta;
    
    let recipesToShow = recipeManager.getFilteredRecipes(searchQuery, 'title');
    
    //use space and approx height of the recipe book
    let maxScroll = max(0, (recipesToShow.length * 145) - 360);
    
    scrollY = constrain(scrollY, 0, maxScroll);
  }
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
  hud.setScore(0);
  hud.setDayCount(0);
  hud.resetTimer();

  startNextDay();

  recipeManager.totalOrdersCompleted = 0;
  recipeManager.totalCustomersEntered = 0;

  gameState = "PLAYING";
  spawnTimer = SPAWN_INTERVAL;

  
}

function keyPressed() {

  if (keyCode === ESCAPE) {
    if (gameState === 'PAUSED') {
      gameState = previousState as any;
    } else {
      previousState = gameState;
      gameState = 'PAUSED';
    }
    
    return false;
  }

  if (key === '1') {
    if (bgm.isPlaying()) {
      bgm.pause();
      musicPlaying = false;
      console.log("Music Paused");
    } else {
      bgm.loop();
      bgm.setVolume(0.05);
      musicPlaying = true;
      console.log("Music Resumed");
    }
  }

  if (gameState === 'PAUSED') {
    if (keyCode === BACKSPACE) {
      searchQuery = searchQuery.slice(0, -1);
    }

    //clears search with enter
    if (keyCode === ENTER) {
      searchQuery = "";
    }
  }

  if (gameState == "PLAYING") {
    player.keyH.handlePressed(key);
  }

  
}

function keyReleased() {
  if (gameState == "PLAYING") {
    player.keyH.handleReleased(key);
  }

}

function keyTyped() {
  if (gameState === 'PAUSED') {
    if (searchQuery.length < maxQueryLength) {
      if (key.length === 1) {
        searchQuery += key;
      }
    }
  }
}

function saveGame(): void {
  const gameStateData = {
    day: hud.getDayCount(),
    timer: hud.getTimer(),
    score: hud.getScore(),
    recipeStats: recipeManager.getSaveData()
  };

  //store as a string in the browser
  localStorage.setItem('CrumbleQuestSave', JSON.stringify(gameStateData));
  console.log("Game Saved.");
}

function loadGame(): void {
  const savedString = localStorage.getItem('CrumbleQuestSave');

  if (savedString) {
    const data = JSON.parse(savedString);
    hud.setDayCount(data.day);
    hud.setTime(data.timer);
    hud.setScore(data.score);
    recipeManager.loadSaveData(data.recipeStats);
    gameState = "RESULTS";
  } else {
    console.log("No File Found.")
  }
}

(window as any).preload = preload;
(window as any).setup = setup;
(window as any).draw = draw;
(window as any).mousePressed = mousePressed;
(window as any).keyPressed = keyPressed;
(window as any).keyReleased = keyReleased;
(window as any).mouseWheel = mouseWheel;
(window as any).keyTyped = keyTyped;
