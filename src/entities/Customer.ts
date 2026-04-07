import { Entity } from "./Entity.js";
import { BaseStation } from "../stations/BaseStation.js";
import { TileManager } from "../world/TileManager.js";
import { RecipeManager } from "../data/RecipeManager.js";
import { PickupCounter } from "../stations/PickupCounter.js";
import { HUD } from "../ui/HUD.js";


export class Customer extends Entity {
    public state: 'WALK-IN' | 'WAITING' | 'ORDERED' | 'WAITING_FOR_FOOD' | 'PICKUP_FOOD' | 'LEAVING' = 'WALK-IN';
    public recipeName: string;
    public orderTaken: boolean = false;
    private targetX: number;
    private targetY: number;
    private hasSetWaitingSpot: boolean = false;
    private slot: any = null;
    private targetCounter : any;

    private static waitingSlots = [
        {x: 8, y: 7, occupied: false},
        {x: 9, y: 7, occupied: false},
        {x: 10, y: 7, occupied: false},
        {x: 11, y: 7, occupied: false},
        {x: 12, y: 7, occupied: false},
        {x: 13, y: 7, occupied: false},
        
    ];

    recipeManager: RecipeManager;
    hud: HUD;
    
    constructor(x: number, y: number, sprites: any, recipe: string, 
                targetX: number, targetY: number, recipeManager: RecipeManager, hud: HUD) {
        super(x, y, true, 0.05, sprites);     
        
        this.targetX = targetX;
        this.targetY = targetY;
        this.recipeName = recipe;
        this.currentAnimation = this.right;
        this.recipeManager = recipeManager;
        this.hud = hud;
    }

    override display() {
        super.display();
        if (this.orderTaken && (this.state === 'ORDERED' || this.state === 'WAITING' || this.state === "WAITING_FOR_FOOD")) {
            this.order();
        }
    }

    override update(tileM: TileManager, stations: BaseStation[]) {

        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = dist(this.x, this.y, this.targetX, this.targetY);

        if (distance > 0.1) {
            this.isMoving = true;

            if (Math.abs(dx) > this.speed) {
                this.currentAnimation = dx > 0 ? this.right : this.left;
                this.x += Math.sign(dx) * this.speed;
            }
            else if (Math.abs(dy) > this.speed) {
                this.currentAnimation = dy > 0 ? this.down : this.up;
                this.y += Math.sign(dy) * this.speed;
            }
        } else {
            this.isMoving = false;
            this.x = this.targetX;
            this.y = this.targetY;
            
            if (this.state === 'WALK-IN') {
                this.state = 'WAITING';
            } else if (this.state === 'ORDERED' && this.hasSetWaitingSpot) {
                this.state = 'WAITING_FOR_FOOD';
            }
            
        }

        if (this.state === 'ORDERED' && this.orderTaken && !this.hasSetWaitingSpot) {
            this.prepareWaitingSlot();
        }
        //scan for food
        if (this.state === 'WAITING_FOR_FOOD') {
            this.checkForOrder(stations);
        }
        //go to pickup counter
        if (this.state === 'PICKUP_FOOD' && this.isAtDestination()) {
            this.finalizePickup();
        }
        
        if (this.isMoving) {
            this.animate();
        } else {
            this.currentFrame = 0;
            this.currentAnimation = this.up;
        }
     
    }

    private animate() {
        if (!this.isMoving) {
            this.currentFrame = 0;
        } else {
            this.spriteCounter++;
            if (this.spriteCounter > 5) {
                this.currentFrame = (this.currentFrame + 1) % 4;
                this.spriteCounter = 0;
            }
        }
    }

    public isAtDestination(): boolean {
        const distance = dist(this.x, this.y, this.targetX, this.targetY);
        return distance < 0.1;
    }

    public order() {
        const size = TileManager.TILE_SIZE;
            //bubble position
            const bx = this.x * size;
            const by = this.y * size - 60; 
            const bubbleW = 50;
            const bubbleH = 45;
    
            //bubble bkg
            push();
            fill(255);
            noStroke();
            rect(bx + 5, by, bubbleW, bubbleH, 10);
    
            //tail
            triangle(bx + 20, by + bubbleH, bx + 30, by + bubbleH, bx + 25, by + bubbleH + 10);
            pop();
    
            //use the recipeName to get the correct sprite from the manager
            const foodImg = this.recipeManager.getSprite(this.recipeName);
            
            if (foodImg) {
                imageMode(CENTER);
                image(foodImg, bx + 5 + (bubbleW / 2), by + (bubbleH / 2), 32, 32);
                imageMode(CORNER); // Reset to default so it doesn't break other draws
            } else {
                // Fallback if image isn't loaded: show text
                noStroke();
                fill(0);
                textSize(8);
                textAlign(CENTER, CENTER);
                text(this.recipeName, bx + 5 + (bubbleW / 2), by + (bubbleH / 2));
            }
    }

    public handleWalkIn(): void {
        this.isMoving = true;
        this.currentAnimation = this.right;

        if (this.x < this.targetX) {
            this.x += this.speed;
        } else if (this.y > this.targetY) {
            this.currentAnimation = this.up;
            this.y -= this.speed;
        } else if (this.isAtDestination()) {
            this.state = 'WAITING';
            this.currentAnimation = this.up;
            this.isMoving = false;
        }
    }
    
    public prepareWaitingSlot(): void {
        
        if (!this.hasSetWaitingSpot) {
            const freeSlot = Customer.waitingSlots.find(s => !s.occupied);

            if (freeSlot) {
                freeSlot.occupied = true;
                this.slot = freeSlot;
                this.setTarget(freeSlot.x, freeSlot.y);
                this.hasSetWaitingSpot = true;
                this.isMoving = true;
            }
        }

        if (this.hasSetWaitingSpot && this.isAtDestination()) {
            this.state = 'WAITING_FOR_FOOD';
        }

    }

    public checkForOrder(stations: BaseStation[]): void {
        for (let station of stations) {
            if (station instanceof PickupCounter) {
                if (station.contents.includes(this.recipeName) && !station.isClaimed) {
                    station.isClaimed = true;
                    this.targetCounter = station;
                    this.setTarget(station.x, station.y);
                    this.state = 'PICKUP_FOOD';
                    this.isMoving = true;
                    this.hasSetWaitingSpot = false;
                    break; //stops looking after finding one
                }
            }
        }
    }

    public finalizePickup(): void {
        if (this.targetCounter) {
            this.targetCounter.contents = [];
            this.targetCounter.isClaimed = false;
        }

        const payment = this.recipeManager.getValue(this.recipeName);

        if (this.hud) {
            this.hud.addScore(payment);
        }
        

        this.leave();

    }

    public leave() {
        if (this.slot) {
            this.slot.occupied = false;
            this.slot = null;
        }
        this.state = 'LEAVING';
        this.setTarget(this.x, 10);
        this.isMoving = true;
    }

    public setTarget(tx: number, ty: number) {
        this.targetX = tx;
        this.targetY = ty;
    }
    
    public getTargetX(): number {
        return this.targetX;
    }

    public getTargetY(): number {
        return this.targetY;
    }

}