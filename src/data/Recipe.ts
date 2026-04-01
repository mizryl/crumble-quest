export interface RecipeStep {
    action: 'ADD' | 'BAKE' | 'PREP';
    item: string;
}

export interface Recipe {
    id: 'fruit-cake' | 'bread' | 'egg-toast' | 'jam-toast' | 'sponge-cake';
    title: string;
    ingredients: string[];
    steps: RecipeStep[];
    bakeTime: number;
    value: number;
    spriteKey: string
}


export interface Ingredients {
    id: string;
    state: 'raw' | 'cooked' | 'burnt';
}