import { Color } from "p5";

export class HUD {
    private score: number = 0;
    private timer: number = 150;
    private maxTimer: number = 150;
    private dayCount: number = 0;

    //score-related
    public getScore(): number {
        return this.score;
    }

    public setScore(score: number): void {
        this.score = score;
    }

    public addScore(amount: number): void {
        this.score += amount;
    }

    public displayScore(x: number, y: number, w: number, h: number) {
        push();
        fill(255);
        rect(x, y, w, h);
        fill(0);
        textSize(20);
        textAlign(CENTER, CENTER);
        text(`$${this.getScore()}`, x + w/2, y + h/2);
        pop();
    }

    //timer-related

    public getTimer(): number {
        return this.timer;
    }

    public setTime(timer: number): void {
        this.timer = timer;
    }

    public displayTimer(x: number, y: number, d: number): void {
        let totalDayTime = 150;
        let percent = this.timer / totalDayTime;

        let colour: any = color(232, 158, 67);
        push()
        
        //clock shake
        let shakeAmount = 0;
        if (this.timer < 15 && this.timer > 0) {
            shakeAmount = map(this.timer, 10, 0, 0, 5);
            let offsetX = (noise(millis() * 0.1) - 0.5) * shakeAmount;
            let offsetY = (noise(millis() * 0.1 + 100) -0.5) * shakeAmount;

            translate(x + offsetX, y + offsetY);
        } else {
            translate(x, y);
        }

        //pulse
        let pulse = 1;
        if (this.timer < 10) {
            pulse = 1 + sin(frameCount * 0.2) * 0.1;
        }

        scale(pulse);


        rectMode(CENTER);
        // push();
        fill(50);
        circle(0, 0,d)
        if (this.timer < 10) {
            fill(colour)
        } else {
            fill(255);
        }
        
        circle(0, 0, d/1.1);

        let angle = (percent * TWO_PI) - HALF_PI;

        let radius = d/2 * 0.8;
        let handX = cos(angle) * radius;
        let handY = sin(angle) * radius;

        //clock hand
        stroke(200, 0, 0);
        strokeWeight(3);
        line(0, 0, handX, handY);

        fill (50);
        noStroke();
        circle(0, 0, 8);
        
        pop();
        noStroke();
    }

    public updateTime(dt: number): void {
        if (this.timer > 0) {
            this.timer -= dt;
        } else {
            this.timer = 0;
            this.addDayCount();
        }
    }

    public resetTimer() {
        this.setTime(this.maxTimer);
    }

    public addDayCount(){
        this.dayCount++;
    }

    public getDayCount(): number {
        return this.dayCount;
    }

    public setDayCount(day: number) {
        this.dayCount = day;
    }



}