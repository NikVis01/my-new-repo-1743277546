export interface Item {
  id: string;
  name: string;
  type: 'item';
  description: string;
  icon: string;
  quantity: number;
  category: 'tool' | 'weapon' | 'food' | 'medicine' | 'shelter' | 'clothing';
  effects?: {
    health?: number;
    hunger?: number;
    thirst?: number;
    energy?: number;
  };
  durability?: number;
}

export const items: Item[] = [
  {
    id: 'axe',
    name: 'Stone Axe',
    type: 'item',
    description: 'Basic tool for chopping wood.',
    icon: '🪓',
    quantity: 0,
    category: 'tool',
    durability: 50,
  },
  {
    id: 'pickaxe',
    name: 'Stone Pickaxe',
    type: 'item',
    description: 'Tool for mining stone and ore.',
    icon: '⛏️',
    quantity: 0,
    category: 'tool',
    durability: 40,
  },
  {
    id: 'spear',
    name: 'Wooden Spear',
    type: 'item',
    description: 'Simple weapon for hunting and defense.',
    icon: '🔱',
    quantity: 0,
    category: 'weapon',
    durability: 30,
  },
  {
    id: 'cooked_meat',
    name: 'Cooked Meat',
    type: 'item',
    description: 'Nutritious food from cooked animal meat.',
    icon: '🍖',
    quantity: 0,
    category: 'food',
    effects: {
      hunger: 40,
      energy: 10,
    },
  },
  {
    id: 'berry_juice',
    name: 'Berry Juice',
    type: 'item',
    description: 'Refreshing drink made from berries.',
    icon: '🧃',
    quantity: 0,
    category: 'food',
    effects: {
      thirst: 30,
      hunger: 5,
    },
  },
  {
    id: 'medicine',
    name: 'Herbal Medicine',
    type: 'item',
    description: 'Medicinal preparation that heals wounds.',
    icon: '💊',
    quantity: 0,
    category: 'medicine',
    effects: {
      health: 25,
    },
  },
  {
    id: 'tent',
    name: 'Simple Tent',
    type: 'item',
    description: 'Basic shelter for protection.',
    icon: '⛺',
    quantity: 0,
    category: 'shelter',
  },
  {
    id: 'fire',
    name: 'Campfire',
    type: 'item',
    description: 'Source of heat and light, used for cooking.',
    icon: '🔥',
    quantity: 0,
    category: 'tool',
  },
  {
    id: 'water_container',
    name: 'Water Container',
    type: 'item',
    description: 'Stores clean water for drinking.',
    icon: '🧴',
    quantity: 0,
    category: 'tool',
  },
  {
    id: 'metal_axe',
    name: 'Metal Axe',
    type: 'item',
    description: 'Advanced tool for chopping wood faster.',
    icon: '⚒️',
    quantity: 0,
    category: 'tool',
    durability: 100,
  },
  {
    id: 'jacket',
    name: 'Fiber Jacket',
    type: 'item',
    description: 'Clothing to protect from cold weather.',
    icon: '🧥',
    quantity: 0,
    category: 'clothing',
    effects: {
      health: 5,
    },
  },
];