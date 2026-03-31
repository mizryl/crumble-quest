
export class KeyHandler {
    public upPressed: boolean = false;
    public downPressed: boolean = false;
    public leftPressed: boolean = false;
    public rightPressed: boolean = false;
    public interactPressed: boolean = false;

    handlePressed(k: string): void {
        let keyLower = k.toLowerCase();
        if (keyLower === 'w') this.upPressed = true;
        if (keyLower === 's') this.downPressed = true;
        if (keyLower === 'a') this.leftPressed = true;
        if (keyLower === 'd') this.rightPressed = true;
        if (keyLower === 'e' || k === ' ') this.interactPressed = true;
        
    }

    handleReleased(k: string): void {
        let keyLower = k.toLowerCase();
        if (keyLower === 'w') this.upPressed = false;
        if (keyLower === 's') this.downPressed = false;
        if (keyLower === 'a') this.leftPressed = false;
        if (keyLower === 'd') this.rightPressed = false;
        if (keyLower === 'e' || k === ' ') this.interactPressed = false;
    }

    public consumeInteract(): boolean {
        if (this.interactPressed) {
            this.interactPressed = false;
            return true; //tells the game the player has interacted
        }
        return false; //tell the game, nothing to do here
    }


}