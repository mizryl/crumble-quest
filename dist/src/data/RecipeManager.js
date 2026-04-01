class RecipeManager {
    constructor() {
        this.recipes = new Map();
        this.loadRecipes();
    }
    loadRecipes() {
        this.addRecipe({
            id: 'sponge-cake',
            title: 'Sponge Cake',
            ingredients: ['flour', 'egg'],
            steps: [
                { action: 'PREP', item: 'flour' },
                { action: 'ADD', item: 'egg' },
                { action: 'BAKE', item: 'batter' },
            ],
            bakeTime: 5,
            value: 50,
            spriteKey: 'cake'
        });
        this.addRecipe({
            id: 'fruit-cake',
            title: 'Strawberry Cake',
            ingredients: ['flour', 'egg', 'fruit'],
            steps: [
                { action: 'PREP', item: 'flour' },
                { action: 'ADD', item: 'egg' },
                { action: 'BAKE', item: 'batter' },
                { action: 'ADD', item: 'fruit' }
            ],
            bakeTime: 5,
            value: 50,
            spriteKey: 'fruit-cake'
        });
        this.addRecipe({
            id: 'bread',
            title: 'Bread',
            ingredients: ['flour'],
            steps: [
                { action: 'PREP', item: 'flour' },
                { action: 'BAKE', item: 'dough' }
            ],
            bakeTime: 5,
            value: 15,
            spriteKey: 'bread'
        });
        this.addRecipe({
            id: 'egg-toast',
            title: 'Egg Toast',
            ingredients: ['flour', 'egg'],
            steps: [
                { action: 'PREP', item: 'flour' },
                { action: 'BAKE', item: 'dough' },
                { action: 'PREP', item: 'egg' },
                { action: 'ADD', item: 'egg' }
            ],
            bakeTime: 5,
            value: 35,
            spriteKey: 'egg-toast'
        });
        this.addRecipe({
            id: 'jam-toast',
            title: 'Jam Toast',
            ingredients: ['flour', 'fruit'],
            steps: [
                { action: 'PREP', item: 'flour' },
                { action: 'BAKE', item: 'dough' },
                { action: 'PREP', item: 'fruit' },
                { action: 'ADD', item: 'fruit' }
            ],
            bakeTime: 5,
            value: 15,
            spriteKey: 'jam-toast'
        });
    }
    addRecipe(recipe) {
        if (!recipe.id) {
            console.error("Recipe msut have an ID");
            return;
        }
        this.recipes.set(recipe.id, recipe);
    }
    getRecipeById(id) {
        return this.recipes.get(id);
    }
    getAllRecipes() {
        return Array.from(this.recipes.values());
    }
}
export {};
//# sourceMappingURL=RecipeManager.js.map