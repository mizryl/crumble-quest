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
import { Trash } from './src/stations/Trash.js';
import { RecipeManager } from './src/data/RecipeManager.js';
import { Customer } from './src/entities/Customer.js';
import { HUD } from './src/ui/HUD.js';
import { ProcessingStation } from './src/stations/ProcessingStation.js';
import { Button } from './src/ui/Button.js';

//btns
let startBtn: RollingPinButton;
let loadBtn: RollingPinButton;
let nextDayBtn: RollingPinButton;
let returnBtn: Button;


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
const SPAWN_INTERVAL = 8000;

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

let gameState: "START" | "PLAYING" | "RESULTS" | "PAUSED";
let dayCount = 0;

//recipe book 
let searchQuery = '';
let scrollY = 0;

let lastBackspaceTime = 0;
const BACKSPACE_DELAY = 100;
const maxQueryLength: number = 30;



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
  
}

function setup(): void {
  noSmooth();
  console.log("Setup is running!")
  tileM.parseLoadedMap(mapData);
  createCanvas(tileM.worldWidth, tileM.worldHeight);
  
  //btns
  startBtn = new RollingPinButton(tileM.worldWidth / 2, tileM.worldHeight / 2, "NEW GAME");
  loadBtn = new RollingPinButton(tileM.worldWidth / 2, tileM.worldHeight / 2 + 100, "LOAD GAME");
  nextDayBtn = new RollingPinButton(width/2, height/2 + 150, "START NEXT DAY");
  returnBtn = new Button(width/2, height/2 + 210, 220, 40, "Return to Title Screen");




  gameState = "RESULTS";

  textFont(font);
  textAlign(CENTER, CENTER);
  console.log("Game initialized in START state");

  //Game-related
  recipeManager = new RecipeManager();
  keyH = new KeyHandler();
  player = new Player(5, 2, playerSprites, keyH, recipeManager);
  hud = new HUD();

  stations.push(new Crates(6, 2.5, stationSprites['flour'], 'flour'));
  stations.push(new Crates(7, 2.5, stationSprites['eggs'], 'egg'));
  stations.push(new Crates(8, 2.5, stationSprites['fruit'], 'fruit'));
  stations.push(new Oven(3, 2.5, stationSprites['oven'], recipeManager, 1));
  stations.push(new Oven(11, 2.5, stationSprites['oven'], recipeManager, 1));
  stations.push(new Oven(12, 2.5, stationSprites['oven'], recipeManager, 1));
  stations.push(new PrepTable(2, 2.5, stationSprites['prep'], recipeManager, 2));
  stations.push(new PrepTable(4, 2.5, stationSprites['prep'], recipeManager, 2));
  stations.push(new PrepTable(10, 2.5, stationSprites['prep'], recipeManager, 2));
  stations.push(new PrepTable(13, 2.5, stationSprites['prep'], recipeManager, 2));
  stations.push(new Trash(0, 2.5, stationSprites['trash']));
  frontStations.push(new PickupCounter(8, 5.5, stationSprites['pickup-left'], recipeManager));
  frontStations.push(new PickupCounter(9, 5.5, stationSprites['pickup-right'], recipeManager));
  frontStations.push(new PickupCounter(10, 5.5, stationSprites['pickup-left'], recipeManager));
  frontStations.push(new PickupCounter(11, 5.5, stationSprites['pickup-right'], recipeManager));
  frontStations.push(new PickupCounter(12, 5.5, stationSprites['pickup-left'], recipeManager));
  frontStations.push(new PickupCounter(13, 5.5, stationSprites['pickup-right'], recipeManager));
  frontStations.push(new PickupCounter(14, 5.5, stationSprites['pickup-left'], recipeManager));
  frontStations.push(new DisplayCounter(0, 4.5, stationSprites['display']));
  frontStations.push(new DisplayCounter(2, 4.5, stationSprites['display']));
  frontStations.push(new DisplayCounter(6, 4.5, stationSprites['display']));
  frontStations.push(new CheckoutCounter(4, 5.5, stationSprites['checkout']));
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
    case "PLAYING":
      drawGameWorld();
      hud.updateTime(deltaTime / 1000);
      break;

    case "PAUSED":
      drawGameWorld();
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
      if (startBtn && startBtn.isClicked()) {
        startGame();
      }

      if (loadBtn.isClicked()) {
        loadGame();
      }
      break;
    case "PLAYING":
        if (player.currentTargetStation) {
            player.currentTargetStation.interact(player);
        }
      break;
    case "RESULTS":
       saveGame();
      if (nextDayBtn && nextDayBtn.isClicked()) {
        startNextDay();
      }

      if (returnBtn && returnBtn.isClicked()) {
        gameState = "START";
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
    if (player) player.update(tileM, allStations);
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

if (customer.length < 5 && spawnTimer > SPAWN_INTERVAL) {
    const spriteKeys = Object.keys(customerSprites);
    const randomKey = random(spriteKeys);
    const selectedSprites = customerSprites[randomKey];
    const allRecipes = recipeManager.getAllRecipes();

    if (selectedSprites && allRecipes.length > 0) {
        const randomRecipe = random(allRecipes);
        
        //vertical line queue
        const queueX = 5; 
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
      return false;
    }
    return true;
  });

}

export function refreshQueue() {
  const waitingArea = customer.filter(c => c.state === 'WALK-IN' || c.state === 'WAITING');

  waitingArea.forEach((c, index) => {
    const queueX = 5;
    const queueY = 5 + index;
    c.setTarget(queueX, queueY);
  });
}

function drawPausedOverlay(): void {
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

    // Calculate Handle
    // handleHeight represents the visible portion of the list
    let handleHeight = constrain(map(viewHeight, totalListHeight, totalListHeight + viewHeight, trackHeight - 200, 30), 30, trackHeight);
    // scrollPos maps how far we've scrolled to the track length
    let scrollPos = map(scrollY, 0, max(1, totalListHeight - viewHeight), 0, trackHeight - handleHeight);
    
    // Draw Handle
    fill(77, 61, 47);
    rect(trackX, -125 + scrollPos + handleHeight/2, 12, handleHeight, 5);
  }

  // 3. DRAW RECIPES
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
  // stroke(77, 61, 47);
  // strokeWeight(4);
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
  // text(bestSeller, 0, 80);
  text(recipeManager.getTopSellingTitle(), 0, 80);
  pop();
  pop();
  nextDayBtn.display();
  nextDayBtn.checkHover();
  returnBtn.display();
  returnBtn.checkHover();
}

function startNextDay(): void {
  hud.resetTimer();
  customer = [];
  spawnTimer = 0;

  if (player && player.keyH) {
    player.keyH.clearKeys(); // We will create this method below
  }

  // 3. Clear the stations (Remove any leftover dough/food on counters)
  const allStations = [...stations, ...frontStations];
  for (let s of allStations) {
    if (s instanceof PickupCounter) s.contents = [];
      if (s instanceof ProcessingStation) {
          s.isProcessing = false;
          s.currentProgress = 0;
          s.contents = [];
      }
  }
  player.currentAnimation = player.down;
  player.isMoving = false;
  player.x = 5;
  player.y = 2;
  gameState = "PLAYING";
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
  gameState = "PLAYING";
  spawnTimer = SPAWN_INTERVAL;
  
}

function keyPressed() {

  if (keyCode === ESCAPE || (key.toLowerCase() === 'r')) {
    if (gameState === 'PLAYING') {
      gameState = 'PAUSED';
  
    } else if (gameState === 'PAUSED') {
      gameState = 'PLAYING';
      console.log('Game Resumed');
    }
    return false;
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
    gameState = "PLAYING";
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