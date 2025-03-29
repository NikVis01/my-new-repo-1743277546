export interface RecipeIngredient {
  id: string;
  quantity: number;
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: RecipeIngredient[];
  result: string;
  description: string;
  locked: boolean;
  unlockedBy?: string;
}

export const recipes: Recipe[] = [
  {
    id: 'stone_axe',
    name: 'Stone Axe',
    ingredients: [
      { id: 'wood', quantity: 2 },
      { id: 'stone', quantity: 3 },
      { id: 'fiber', quantity: 1 },
    ],
    result: 'axe',
    description: 'A basic tool for chopping wood more efficiently.',
    locked: false,
  },
  {
    id: 'stone_pickaxe',
    name: 'Stone Pickaxe',
    ingredients: [
      { id: 'wood', quantity: 2 },
      { id: 'stone', quantity: 4 },
      { id: 'fiber', quantity: 1 },
    ],
    result: 'pickaxe',
    description: 'A tool for mining stone and ore.',
    locked: false,
  },
  {
    id: 'wooden_spear',
    name: 'Wooden Spear',
    ingredients: [
      { id: 'wood', quantity: 3 },
      { id: 'flint', quantity: 1 },
      { id: 'fiber', quantity: 2 },
    ],
    result: 'spear',
    description: 'A simple weapon for hunting and defense.',
    locked: false,
  },
  {
    id: 'cooked_meat_recipe',
    name: 'Cooked Meat',
    ingredients: [
      { id: 'meat', quantity: 1 },
      { id: 'fire', quantity: 1 },
    ],
    result: 'cooked_meat',
    description: 'Cook raw meat to make it safe to eat.',
    locked: true,
    unlockedBy: 'fire',
  },
  {
    id: 'berry_juice_recipe',
    name: 'Berry Juice',
    ingredients: [
      { id: 'berries', quantity: 3 },
      { id: 'water', quantity: 1 },
      { id: 'water_container', quantity: 1 },
    ],
    result: 'berry_juice',
    description: 'A refreshing drink made from berries.',
    locked: true,
    unlockedBy: 'water_container',
  },
  {
    id: 'herbal_medicine',
    name: 'Herbal Medicine',
    ingredients: [
      { id: 'herbs', quantity: 3 },
      { id: 'berries', quantity: 1 },
      { id: 'water', quantity: 1 },
    ],
    result: 'medicine',
    description: 'A medicinal preparation that heals wounds.',
    locked: true,
    unlockedBy: 'water_container',
  },
  {
    id: 'simple_tent',
    name: 'Simple Tent',
    ingredients: [
      { id: 'wood', quantity: 4 },
      { id: 'fiber', quantity: 6 },
    ],
    result: 'tent',
    description: 'A basic shelter for protection.',
    locked: false,
  },
  {
    id: 'campfire',
    name: 'Campfire',
    ingredients: [
      { id: 'wood', quantity: 3 },
      { id: 'stone', quantity: 5 },
      { id: 'flint', quantity: 1 },
    ],
    result: 'fire',
    description: 'A source of heat and light, used for cooking.',
    locked: false,
  },
  {
    id: 'water_container_recipe',
    name: 'Water Container',
    ingredients: [
      { id: 'fiber', quantity: 3 },
      { id: 'wood', quantity: 1 },
    ],
    result: 'water_container',
    description: 'A container to store clean water.',
    locked: false,
  },
  {
    id: 'metal_axe_recipe',
    name: 'Metal Axe',
    ingredients: [
      { id: 'metal', quantity: 3 },
      { id: 'wood', quantity: 2 },
      { id: 'fiber', quantity: 1 },
    ],
    result: 'metal_axe',
    description: 'An advanced tool for chopping wood faster.',
    locked: true,
    unlockedBy: 'pickaxe',
  },
  {
    id: 'fiber_jacket',
    name: 'Fiber Jacket',
    ingredients: [
      { id: 'fiber', quantity: 8 },
    ],
    result: 'jacket',
    description: 'Clothing to protect from cold weather.',
    locked: false,
  },
];