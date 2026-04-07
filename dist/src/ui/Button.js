export class Button {
    constructor(x, y, w, h, label) {
        this.isHovered = false;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.label = label;
    }
    checkHover() {
        this.isHovered = (mouseX > this.x - this.w / 2 &&
            mouseX < this.x + this.w / 2 &&
            mouseY > this.y - this.h / 2 &&
            mouseY < this.y + this.h / 2);
    }
    isClicked() {
        return this.isHovered && mouseIsPressed;
    }
    display() {
        push();
        noFill();
        noStroke();
        translate(this.x, this.y);
        if (this.isHovered)
            scale(1.1);
        rectMode(CENTER);
        rect(0, 0, this.w, this.h);
        fill(77, 61, 47);
        textAlign(CENTER);
        textSize(14);
        text(this.label, 0, 0);
        pop();
    }
}
//# sourceMappingURL=Button.js.map