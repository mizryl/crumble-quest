export class KeyHandler {
    constructor() {
        this.upPressed = false;
        this.downPressed = false;
        this.leftPressed = false;
        this.rightPressed = false;
        this.interactPressed = false;
        this.processPressed = false;
        // public consumeInteract(): boolean {
        //     if (this.interactPressed) {
        //         this.interactPressed = false;
        //         return true; //tells the game the player has interacted
        //     }
        //     return false; //tell the game, nothing to do here
        // }
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
        if (keyLower === 'e' || k === ' ')
            this.interactPressed = true;
        if (keyLower === 'f')
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
        if (keyLower === 'e' || k === ' ')
            this.interactPressed = false;
        if (keyLower === 'f')
            this.processPressed = false;
    }
}
//# sourceMappingURL=KeyHandler.js.map