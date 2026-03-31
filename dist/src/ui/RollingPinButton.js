import { Button } from './Button.js';
export class RollingPinButton extends Button {
    constructor(x, y, label) {
        super(x, y, 300, 60, label);
        this.rot = 0;
    }
    display() {
        this.checkHover();
        push();
        translate(this.x, this.y);
        if (this.isHovered) {
            this.rot = lerp(this.rot, 0.1, 0.1);
            scale(1.05);
        }
        else {
            this.rot = lerp(this.rot, 0, 0.1);
        }
        rotate(this.rot);
        noStroke();
        rectMode(CENTER);
        fill(198, 153, 107); //wood body
        rect(0, 0, this.w, this.h, 4);
        fill(186, 144, 100); //handle
        rect(-this.w / 2 - 30, 0, 60, 30);
        rect(this.w / 2 + 30, 0, 60, 30);
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(30);
        text(this.label, 0, 0);
        pop();
    }
}
//# sourceMappingURL=RollingPinButton.js.map