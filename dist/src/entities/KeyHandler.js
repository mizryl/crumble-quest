export class KeyHandler {
    constructor() {
        this.upPressed = false;
        this.downPressed = false;
        this.leftPressed = false;
        this.rightPressed = false;
        this.interactPressed = false;
        this.processPressed = false;
        this.pausePressed = false;
        this.backspacePressed = false;
        this.backspaceTimer = 0;
        this.backspaceDelay = 100;
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
        if (keyLower === 'e')
            this.interactPressed = true;
        if (keyLower === 'f' || k === ' ')
            this.processPressed = true;
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
        if (keyLower === 'e')
            this.interactPressed = false;
        if (keyLower === 'f' || k === ' ')
            this.processPressed = false;
    }
    handleSearchBackspace(currentQuery) {
        if (this.backspacePressed) {
            if (millis() - this.backspaceTimer > this.backspaceDelay) {
                this.backspaceTimer = millis();
                return currentQuery.slice(0, -1);
            }
        }
        return currentQuery;
    }
    clearKeys() {
        this.upPressed = false;
        this.downPressed = false;
        this.leftPressed = false;
        this.rightPressed = false;
        this.interactPressed = false;
        this.processPressed = false;
        this.pausePressed = false;
        console.log("Input buffer cleared for the new day.");
    }
}
//# sourceMappingURL=KeyHandler.js.map