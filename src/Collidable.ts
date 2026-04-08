
export interface Collidable {
    isSolid: boolean;
    
    getHitbox(x?: number, y?: number) : {x: number, y: number, w: number, h: number};
}