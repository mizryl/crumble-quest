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
        return this.isHovered;
    }
}
//# sourceMappingURL=Button.js.map