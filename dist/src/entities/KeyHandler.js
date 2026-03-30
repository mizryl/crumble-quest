export class KeyHandler {
    constructor() {
        this.upPressed = false;
        this.downPressed = false;
        this.leftPressed = false;
        this.rightPressed = false;
    }
    handlePressed(k) {
        let keyLower = k.toLowerCase();
        if (keyLower === 'w')
            this.upPressed = true;
        if (keyLower === 's')
            this.downPressed = true;
        if (keyLower === 'a')
            this.leftPressed = true;
        if (keyLower === 'd')
            this.rightPressed = true;
    }
    handleReleased(k) {
        let keyLower = k.toLowerCase();
        if (keyLower === 'w')
            this.upPressed = false;
        if (keyLower === 's')
            this.downPressed = false;
        if (keyLower === 'a')
            this.leftPressed = false;
        if (keyLower === 'd')
            this.rightPressed = false;
    }
}
//# sourceMappingURL=KeyHandler.js.map