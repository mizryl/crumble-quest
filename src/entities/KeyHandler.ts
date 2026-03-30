
export class KeyHandler {
    public upPressed: boolean = false;
    public downPressed: boolean = false;
    public leftPressed: boolean = false;
    public rightPressed: boolean = false;

    handlePressed(k: string): void {
        let keyLower = k.toLowerCase();
        if (keyLower === 'w') this.upPressed = true;
        if (keyLower === 's') this.downPressed = true;
        if (keyLower === 'a') this.leftPressed = true;
        if (keyLower === 'd') this.rightPressed = true;
        
    }

    handleReleased(k: string): void {
        let keyLower = k.toLowerCase();
        if (keyLower === 'w') this.upPressed = false;
        if (keyLower === 's') this.downPressed = false;
        if (keyLower === 'a') this.leftPressed = false;
        if (keyLower === 'd') this.rightPressed = false;
    }
}