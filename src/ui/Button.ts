declare const mouseX: any;
declare const mouseY: any;

export class Button {
    x: number;
    y: number;
    w: number;
    h: number;
    label: string;
    isHovered: boolean = false;
    
    constructor(x: number, y: number, w: number, h: number, label: string) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.label = label;
    }

    checkHover(): void {
        this.isHovered = (
            mouseX > this.x - this.w / 2 &&
            mouseX < this.x + this.w / 2 &&
            mouseY > this.y - this.h / 2 &&
            mouseY < this.y + this.h / 2
        );
    }

    isClicked(): boolean {
        return this.isHovered;
    }
}
