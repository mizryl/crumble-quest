export class HUD {
    constructor() {
        this.score = 0;
        this.timer = 150;
        this.maxTimer = 150;
        this.dayCount = 0;
    }
    //score-related
    getScore() {
        return this.score;
    }
    setScore(score) {
        this.score = score;
    }
    addScore(amount) {
        this.score += amount;
    }
    displayScore(x, y, w, h) {
        push();
        fill(255);
        rect(x, y, w, h);
        fill(0);
        textSize(20);
        textAlign(CENTER, CENTER);
        text(`$${this.getScore()}`, x + w / 2, y + h / 2);
        pop();
    }
    //timer-related
    getTimer() {
        return this.timer;
    }
    setTime(timer) {
        this.timer = timer;
    }
    displayTimer(x, y, d) {
        let totalDayTime = 150;
        let percent = this.timer / totalDayTime;
        let colour = color(232, 158, 67);
        push();
        //clock shake
        let shakeAmount = 0;
        if (this.timer < 15 && this.timer > 0) {
            shakeAmount = map(this.timer, 10, 0, 0, 5);
            let offsetX = (noise(millis() * 0.1) - 0.5) * shakeAmount;
            let offsetY = (noise(millis() * 0.1 + 100) - 0.5) * shakeAmount;
            translate(x + offsetX, y + offsetY);
        }
        else {
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
        circle(0, 0, d);
        if (this.timer < 10) {
            fill(colour);
        }
        else {
            fill(255);
        }
        circle(0, 0, d / 1.1);
        let angle = (percent * TWO_PI) - HALF_PI;
        let radius = d / 2 * 0.8;
        let handX = cos(angle) * radius;
        let handY = sin(angle) * radius;
        //clock hand
        stroke(200, 0, 0);
        strokeWeight(3);
        line(0, 0, handX, handY);
        fill(50);
        noStroke();
        circle(0, 0, 8);
        pop();
        noStroke();
    }
    updateTime(dt) {
        if (this.timer > 0) {
            this.timer -= dt;
        }
        else {
            this.timer = 0;
            this.addDayCount();
        }
    }
    resetTimer() {
        this.setTime(this.maxTimer);
    }
    addDayCount() {
        this.dayCount++;
    }
    getDayCount() {
        return this.dayCount;
    }
    setDayCount(day) {
        this.dayCount = day;
    }
}
//# sourceMappingURL=HUD.js.map