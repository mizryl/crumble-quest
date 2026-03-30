export class KeyHandler {
    constructor() {
        this.upPressed = false;
        this.downPressed = false;
        this.leftPressed = false;
        this.rightPressed = false;
    }
    handlePressed(k) {
        if (k == 'w')
            this.upPressed = true;
        if (k == 's')
            this.downPressed = true;
        if (k == 'a')
            this.leftPressed = true;
        if (k == 'd')
            this.rightPressed = true;
    }
    handleReleased(k) {
        if (k == 'w')
            this.upPressed = false;
        if (k == 's')
            this.downPressed = false;
        if (k == 'a')
            this.leftPressed = false;
        if (k == 'd')
            this.rightPressed = false;
    }
}
//# sourceMappingURL=KeyHandler.js.map