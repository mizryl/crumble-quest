import { Recipe } from "./Recipe.js";
import { ProcessingStation } from "../stations/ProcessingStation.js";

export class RecipeManager {
    recipes: Map<string, Recipe> = new Map();
    private servedStats: Map<string, number> = new Map();
    private itemSprites: { [key: string]: any} = {};

    public totalCustomersEntered: number = 0;
    public totalOrdersCompleted: number = 0;

    constructor() {
        this.loadRecipes();
    }

    private loadRecipes(): void {
        this.addRecipe({
            id: 'sponge-cake',
            title: 'Sponge Cake',
            ingredients: ['flour', 'egg'],
            steps: [
                { action: 'PREP', item: 'flour+egg', output: 'batter'},
                { action: 'BAKE', item: 'batter', output: 'sponge-cake'},
            ],
            bakeTime: 5,
            value: 40,
            spriteKey:'sponge-cake'
        });

        this.addRecipe({
            id: 'fruit-cake',
            title: 'Strawberry Cake',
            ingredients: ['flour', 'egg', 'fruit'],
            steps: [
                { action: 'PREP', item: 'flour+egg', output: 'batter'},
                { action: 'BAKE', item: 'batter', output: 'sponge-cake'},
                { action: 'ADD', item: 'sponge-cake+chopped-fruit', output: 'fruit-cake'}
            ],
            bakeTime: 5,
            value: 75,
            spriteKey:'fruit-cake'
        });

        this.addRecipe({
            id: 'bread',
            title: 'Bread',
            ingredients: ['flour'],
            steps: [
                { action: 'PREP', item: 'flour', output: 'dough'},
                { action: 'BAKE', item: 'dough', output: 'bread'}

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
                { action: 'PREP', item: 'flour', output: 'dough'},
                { action: 'BAKE', item: 'dough', output: 'bread'},
                { action: 'FRY', item: 'egg', output: 'fried-egg'},
                { action: 'ADD', item: 'bread+fried-egg', output: 'egg-toast'}

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
                { action: 'PREP', item: 'flour', output: 'dough'},
                { action: 'BAKE', item: 'dough', output: 'bread'},
                { action: 'PREP', item: 'fruit', output: 'chopped-fruit'},
                { action: 'FRY', item: 'chopped-fruit', output: 'jam'},
                { action: 'ADD', item: 'bread+jam', output: 'jam-toast'}

            ],
            bakeTime: 5,
            value: 100,
            spriteKey: 'jam-toast'
        });
    }

    addRecipe(recipe: Recipe): void {
        if (!recipe.id) {
            console.error("Recipe msut have an ID");

            return;
        }
        this.recipes.set(recipe.id, recipe);
    }

    getRecipeById(id: string): Recipe | undefined {
        return this.recipes.get(id);
    }

    getAllRecipes(): Recipe[] {
        return Array.from(this.recipes.values());
    }

    getPrepResult(ingredients: string[]) : string {
        const sortedInput = [...ingredients].sort().join('+');

        //single item
        if (ingredients.length === 1) {
            const item = ingredients[0];
            if (item === 'flour') return 'dough';
            if (item === 'fruit') return 'chopped-fruit';
            return item;
        }

        //multi-item
        if (ingredients.length === 2) {
            if (sortedInput === 'egg+flour') return 'batter';
        }

        //jam toast assemble
        if (sortedInput === 'bread+jam') return 'jam-toast';
        if (sortedInput === 'bread+fried-egg') return 'egg-toast';
        if (sortedInput === 'sponge-cake+chopped-fruit') return 'fruit-cake';

        return 'ruined-food';        

    }

    getResult(ingredients: string[], action: string): string {
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

    public canProcess(ingredients: string[], stationId: string): boolean {
        const sortedInput = [...ingredients].sort().join('+');
        const allRecipes = this.getAllRecipes();
       
        return allRecipes.some(recipe => {
            return recipe.steps.some(step => {
                // return step.action === stationId.toUpperCase() &&
                //         step.item === ingredients.join('+');
                const stepSorted = step.item.split('+').sort().join('+');
                return step.action === stationId.toUpperCase() && stepSorted === sortedInput;
            })
        })
    }

    public registerSprite(key: string, img: any): void {
        this.itemSprites[key] = img;
    }

    public getSprite(itemkey: string): any {
        return this.itemSprites[itemkey] || null;
    }

    public getValue(itemId: string): number {
        const recipe = this.getRecipeById(itemId);

        if (recipe) {
            return recipe.value;
        }

        return 0;
    }

    public searchRecipes(query: string): Recipe[] {
        const all = this.getAllRecipes();
        if (!query || query.trim() === '') return all;

        let results: Recipe[] = [];
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

    public getRecipeSortedByValue(): Recipe[] {
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
public getFilteredRecipes(query: string, sortType: 'value' | 'title' | 'none'): Recipe[] {
    let list = this.searchRecipes(query);
    
    if (sortType !== 'none') {
        list = this.manualSortList(list, sortType);
    }
    
    return list;
}

    public manualSortList(list: Recipe[], criteria: 'value' | 'title'): Recipe[] {
        let n = list.length;
        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                
                let shouldSwap = false;
                if (criteria === 'value') {
                    // Sort by Price (High to Low)
                    shouldSwap = list[j].value < list[j + 1].value;
                } else {
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

    public recordSale(recipeId: string): void {
        const bakeCount = this.servedStats.get(recipeId) || 0;
        this.servedStats.set(recipeId, bakeCount + 1);
        console.log(`${recipeId} has been baked ${bakeCount + 1} times.`);

        this.totalOrdersCompleted++;

    }

    public getBestSeller(): Recipe[] {
        const allRecipes = this.getAllRecipes();

        return allRecipes.sort((a, b) => {
            const countA = this.servedStats.get(a.id) || 0;
            const countB = this.servedStats.get(b.id) || 0;

            return countB - countA;
        });

    }

    public getTopSellingTitle(): string {
    const list = this.getBestSeller();
    
    // Check if the very first item in our sorted list has actually been sold
    if (list.length > 0) {
        const topItem = list[0];
        const sales = this.servedStats.get(topItem.id) || 0;
        
        if (sales > 0) {
            return topItem.title;
        }
    }
    
        return "None";
    }

    public recordWalkIn(): void {
        this.totalCustomersEntered++;
    }

    public getSaveData() {
        return {
            totalOrders: this.totalOrdersCompleted,
            totalWalkIns: this.totalCustomersEntered,
            // Convert the Map to an Object so JSON can handle it
            stats: Object.fromEntries(this.servedStats)
        };
    }

    public loadSaveData(data: any) {
        this.totalOrdersCompleted = data.totalOrders || 0;
        this.totalCustomersEntered = data.totalWalkIns || 0;
        // Rebuild the Map from the saved object
        this.servedStats = new Map(Object.entries(data.stats || {}));
    }


    
}