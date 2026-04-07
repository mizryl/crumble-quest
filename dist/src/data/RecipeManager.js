export class RecipeManager {
    constructor() {
        this.recipes = new Map();
        this.itemSprites = {};
        this.loadRecipes();
    }
    loadRecipes() {
        this.addRecipe({
            id: 'sponge-cake',
            title: 'Sponge Cake',
            ingredients: ['flour', 'egg'],
            steps: [
                { action: 'PREP', item: 'flour+egg', output: 'batter' },
                { action: 'BAKE', item: 'batter', output: 'sponge-cake' },
            ],
            bakeTime: 5,
            value: 40,
            spriteKey: 'sponge-cake'
        });
        this.addRecipe({
            id: 'fruit-cake',
            title: 'Strawberry Cake',
            ingredients: ['flour', 'egg', 'fruit'],
            steps: [
                { action: 'PREP', item: 'flour+egg', output: 'batter' },
                { action: 'BAKE', item: 'batter', output: 'sponge-cake' },
                { action: 'ADD', item: 'sponge-cake+chopped-fruit', output: 'fruit-cake' }
            ],
            bakeTime: 5,
            value: 75,
            spriteKey: 'fruit-cake'
        });
        this.addRecipe({
            id: 'bread',
            title: 'Bread',
            ingredients: ['flour'],
            steps: [
                { action: 'PREP', item: 'flour', output: 'dough' },
                { action: 'BAKE', item: 'dough', output: 'bread' }
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
                { action: 'PREP', item: 'flour', output: 'dough' },
                { action: 'BAKE', item: 'dough', output: 'bread' },
                { action: 'FRY', item: 'egg', output: 'fried-egg' },
                { action: 'ADD', item: 'bread+fried-egg', output: 'egg-toast' }
            ],
            bakeTime: 5,
            value: 50,
            spriteKey: 'egg-toast'
        });
        this.addRecipe({
            id: 'jam-toast',
            title: 'Jam Toast',
            ingredients: ['flour', 'fruit'],
            steps: [
                { action: 'PREP', item: 'flour', output: 'dough' },
                { action: 'BAKE', item: 'dough', output: 'bread' },
                { action: 'PREP', item: 'fruit', output: 'chopped-fruit' },
                { action: 'FRY', item: 'chopped-fruit', output: 'jam' },
                { action: 'ADD', item: 'bread+jam', output: 'jam-toast' }
            ],
            bakeTime: 5,
            value: 100,
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
    getPrepResult(ingredients) {
        const sortedInput = [...ingredients].sort().join('+');
        //single item
        if (ingredients.length === 1) {
            const item = ingredients[0];
            if (item === 'flour')
                return 'dough';
            if (item === 'fruit')
                return 'chopped-fruit';
            return item;
        }
        //multi-item
        if (ingredients.length === 2) {
            if (sortedInput === 'egg+flour')
                return 'batter';
        }
        //jam toast assemble
        if (sortedInput === 'bread+jam')
            return 'jam-toast';
        if (sortedInput === 'bread+fried-egg')
            return 'egg-toast';
        if (sortedInput === 'sponge-cake+chopped-fruit')
            return 'fruit-cake';
        return 'ruined-food';
    }
    getResult(ingredients, action) {
        const inputStr = [...ingredients].sort().join('+');
        //look through recipes steps
        for (const recipe of this.getAllRecipes()) {
            const matchingStep = recipe.steps.find(step => {
                const itemSorted = step.item.split('+').sort().join('+');
                return step.action === action.toUpperCase() && itemSorted === inputStr;
            });
            if (matchingStep) {
                return matchingStep.output;
            }
        }
        return 'ruined-food';
    }
    canProcess(ingredients, stationId) {
        const sortedInput = [...ingredients].sort().join('+');
        const allRecipes = this.getAllRecipes();
        return allRecipes.some(recipe => {
            return recipe.steps.some(step => {
                // return step.action === stationId.toUpperCase() &&
                //         step.item === ingredients.join('+');
                const stepSorted = step.item.split('+').sort().join('+');
                return step.action === stationId.toUpperCase() && stepSorted === sortedInput;
            });
        });
    }
    registerSprite(key, img) {
        this.itemSprites[key] = img;
    }
    getSprite(itemkey) {
        return this.itemSprites[itemkey] || null;
    }
    getValue(itemId) {
        const recipe = this.getRecipeById(itemId);
        if (recipe) {
            return recipe.value;
        }
        return 0;
    }
    searchRecipes(query) {
        const all = this.getAllRecipes();
        if (!query || query.trim() === '')
            return all;
        let results = [];
        let lowerQuery = query.toLowerCase();
        for (let r of all) {
            let mathName = (r.id.toLowerCase().includes(lowerQuery) ||
                r.title.toLowerCase().includes(lowerQuery));
            let matchIngredient = r.ingredients.some(ing => ing.toLowerCase().includes(lowerQuery));
            if (mathName || matchIngredient) {
                results.push(r);
            }
        }
        return results;
    }
    getRecipeSortedByValue() {
        let sortedList = this.getAllRecipes();
        let n = sortedList.length;
        for (let i = 0; i < n - 1; i++) {
            let maxIndex = i;
            for (let j = i + 1; j < n; j++) {
                if (sortedList[j].value > sortedList[maxIndex].value) {
                    maxIndex = j;
                }
            }
            let temp = sortedList[maxIndex];
            sortedList[maxIndex] = sortedList[i];
            sortedList[i] = temp;
        }
        return sortedList;
    }
    // Add a parameter for the sort type
    getFilteredRecipes(query, sortType) {
        let list = this.searchRecipes(query);
        if (sortType !== 'none') {
            list = this.manualSortList(list, sortType);
        }
        return list;
    }
    manualSortList(list, criteria) {
        let n = list.length;
        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                let shouldSwap = false;
                if (criteria === 'value') {
                    // Sort by Price (High to Low)
                    shouldSwap = list[j].value < list[j + 1].value;
                }
                else {
                    // Sort by Title (A to Z)
                    shouldSwap = list[j].title > list[j + 1].title;
                }
                if (shouldSwap) {
                    let temp = list[j];
                    list[j] = list[j + 1];
                    list[j + 1] = temp;
                }
            }
        }
        return list;
    }
}
//# sourceMappingURL=RecipeManager.js.map