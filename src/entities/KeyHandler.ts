
export class KeyHandler {
    public upPressed: boolean = false;
    public downPressed: boolean = false;
    public leftPressed: boolean = false;
    public rightPressed: boolean = false;
    public interactPressed: boolean = false;
    public processPressed: boolean = false;
    public pausePressed: boolean = false;

    public backspacePressed: boolean = false;
    private backspaceTimer: number = 0;
    private readonly backspaceDelay: number = 100;

    handlePressed(k: string): void {
        let keyLower = k.toLowerCase();
        if (keyLower === 'w') this.upPressed = true;
        if (keyLower === 's') this.downPressed = true;
        if (keyLower === 'a') this.leftPressed = true;
        if (keyLower === 'd') this.rightPressed = true;
        if (keyLower === 'j') this.interactPressed = true;
        if (keyLower === 'k' || k === ' ') this.processPressed = true;
        
    }

    handleReleased(k: string): void {
        let keyLower = k.toLowerCase();
        if (keyLower === 'w') this.upPressed = false;
        if (keyLower === 's') this.downPressed = false;
        if (keyLower === 'a') this.leftPressed = false;
        if (keyLower === 'd') this.rightPressed = false;
        if (keyLower === 'j') this.interactPressed = false;
        if (keyLower === 'k' || k === ' ') this.processPressed = false;
    }

    public handleSearchBackspace(currentQuery: string): string {
        if (this.backspacePressed) {
            if (millis() - this.backspaceTimer > this.backspaceDelay) {
                this.backspaceTimer = millis();
                return currentQuery.slice(0, -1);
            }
        }
        return currentQuery;
    }

    public clearKeys(): void {
        this.upPressed = false;
        this.downPressed = false;
        this.leftPressed = false;
        this.rightPressed = false;
        this.interactPressed= false;
        this.processPressed = false;
        this.pausePressed= false;
        
    }

}