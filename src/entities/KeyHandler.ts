
export class KeyHandler {
    public upPressed: boolean = false;
    public downPressed: boolean = false;
    public leftPressed: boolean = false;
    public rightPressed: boolean = false;

    handlePressed(k: string): void {
        if (keyIsDown(0x77)) this.upPressed = true;
        if (k == 's') this.downPressed = true;
        if (k == 'a') this.leftPressed = true;
        if (k == 'd') this.rightPressed = true;
        
    }

    handleReleased(k: string): void {
        if (k == 'w') this.upPressed = false;
        if (k == 's') this.downPressed = false;
        if (k == 'a') this.leftPressed = false;
        if (k == 'd') this.rightPressed = false;
    }
}