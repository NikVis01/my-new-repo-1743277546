import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { resources, Resource } from '../data/resources';
import { items, Item } from '../data/items';
import { recipes, Recipe } from '../data/recipes';

interface PlayerStats {
  health: number;
  hunger: number;
  thirst: number;
  energy: number;
}

interface TimeState {
  day: number;
  hour: number;
  minute: number;
  isDayTime: boolean;
}

interface GameState {
  playerStats: PlayerStats;
  inventory: (Resource | Item)[];
  time: TimeState;
  unlockedRecipes: Recipe[];
  currentBiome: 'forest' | 'desert' | 'mountains';
}

interface GameContextType {
  gameState: GameState;
  collectResource: (resource: Resource) => void;
  craftItem: (recipe: Recipe) => void;
  useItem: (item: Item) => void;
  dropItem: (item: Resource | Item, amount?: number) => void;
  advanceTime: (minutes: number) => void;
  decreaseStats: () => void;
  changePlayerStat: (stat: keyof PlayerStats, amount: number) => void;
  changeBiome: (biome: 'forest' | 'desert' | 'mountains') => void;
}

const initialPlayerStats: PlayerStats = {
  health: 100,
  hunger: 100,
  thirst: 100,
  energy: 100,
};

const initialTime: TimeState = {
  day: 1,
  hour: 8,
  minute: 0,
  isDayTime: true,
};

const initialGameState: GameState = {
  playerStats: initialPlayerStats,
  inventory: [],
  time: initialTime,
  unlockedRecipes: recipes.filter(recipe => !recipe.locked),
  currentBiome: 'forest',
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  // Advance game time
  const advanceTime = (minutes: number) => {
    setGameState(prevState => {
      let newMinute = prevState.time.minute + minutes;
      let newHour = prevState.time.hour;
      let newDay = prevState.time.day;

      while (newMinute >= 60) {
        newMinute -= 60;
        newHour += 1;
      }

      while (newHour >= 24) {
        newHour -= 24;
        newDay += 1;
      }

      const isDayTime = newHour >= 6 && newHour < 20;

      return {
        ...prevState,
        time: {
          day: newDay,
          hour: newHour,
          minute: newMinute,
          isDayTime,
        },
      };
    });
  };

  // Decrease player stats over time (hunger, thirst, energy)
  const decreaseStats = () => {
    setGameState(prevState => {
      const newHunger = Math.max(0, prevState.playerStats.hunger - 1);
      const newThirst = Math.max(0, prevState.playerStats.thirst - 1.5);
      const newEnergy = Math.max(0, prevState.playerStats.energy - 0.5);
      
      // If hunger or thirst are at 0, decrease health
      let newHealth = prevState.playerStats.health;
      if (newHunger === 0 || newThirst === 0) {
        newHealth = Math.max(0, newHealth - 2);
      }
      
      return {
        ...prevState,
        playerStats: {
          health: newHealth,
          hunger: newHunger,
          thirst: newThirst,
          energy: newEnergy,
        },
      };
    });
  };

  // Check if player has died
  useEffect(() => {
    if (gameState.playerStats.health <= 0) {
      Alert.alert(
        "You died!",
        "You couldn't survive the harsh wilderness.",
        [{ text: "Restart", onPress: () => setGameState(initialGameState) }]
      );
    }
  }, [gameState.playerStats.health]);

  // Collect a resource and add to inventory
  const collectResource = (resource: Resource) => {
    setGameState(prevState => {
      // Find if resource already exists in inventory
      const existingResourceIndex = prevState.inventory.findIndex(
        item => item.id === resource.id && item.type === 'resource'
      );

      let newInventory = [...prevState.inventory];

      if (existingResourceIndex >= 0) {
        // Increase quantity of existing resource
        const existingResource = newInventory[existingResourceIndex] as Resource;
        newInventory[existingResourceIndex] = {
          ...existingResource,
          quantity: existingResource.quantity + 1,
        };
      } else {
        // Add new resource to inventory
        newInventory.push({ ...resource, quantity: 1 });
      }

      // Decrease energy when collecting resources
      const newEnergy = Math.max(0, prevState.playerStats.energy - resource.energyCost);

      return {
        ...prevState,
        inventory: newInventory,
        playerStats: {
          ...prevState.playerStats,
          energy: newEnergy,
        },
      };
    });

    // Advance time when collecting resources
    advanceTime(5);
    decreaseStats();
  };

  // Craft an item using resources
  const craftItem = (recipe: Recipe) => {
    setGameState(prevState => {
      // Check if player has all required resources
      const hasAllResources = recipe.ingredients.every(ingredient => {
        const inventoryItem = prevState.inventory.find(
          item => item.id === ingredient.id
        ) as Resource | undefined;
        
        return inventoryItem && inventoryItem.quantity >= ingredient.quantity;
      });

      if (!hasAllResources) {
        Alert.alert("Crafting Failed", "You don't have the required resources.");
        return prevState;
      }

      // Remove resources used in crafting
      let newInventory = [...prevState.inventory];
      recipe.ingredients.forEach(ingredient => {
        const itemIndex = newInventory.findIndex(item => item.id === ingredient.id);
        if (itemIndex >= 0) {
          const item = newInventory[itemIndex] as Resource;
          const newQuantity = item.quantity - ingredient.quantity;
          
          if (newQuantity > 0) {
            newInventory[itemIndex] = { ...item, quantity: newQuantity };
          } else {
            newInventory.splice(itemIndex, 1);
          }
        }
      });

      // Add crafted item to inventory
      const craftedItem = items.find(item => item.id === recipe.result);
      if (craftedItem) {
        const existingItemIndex = newInventory.findIndex(
          item => item.id === craftedItem.id
        );

        if (existingItemIndex >= 0) {
          const existingItem = newInventory[existingItemIndex] as Item;
          newInventory[existingItemIndex] = {
            ...existingItem,
            quantity: existingItem.quantity + 1,
          };
        } else {
          newInventory.push({ ...craftedItem, quantity: 1 });
        }
      }

      // Unlock new recipes if applicable
      let newUnlockedRecipes = [...prevState.unlockedRecipes];
      recipes.forEach(r => {
        if (r.locked && r.unlockedBy === recipe.result && !newUnlockedRecipes.includes(r)) {
          newUnlockedRecipes.push(r);
        }
      });

      // Decrease energy when crafting
      const newEnergy = Math.max(0, prevState.playerStats.energy - 10);

      return {
        ...prevState,
        inventory: newInventory,
        unlockedRecipes: newUnlockedRecipes,
        playerStats: {
          ...prevState.playerStats,
          energy: newEnergy,
        },
      };
    });

    // Advance time when crafting
    advanceTime(15);
    decreaseStats();
  };

  // Use an item (food, water, medicine, etc.)
  const useItem = (item: Item) => {
    if (item.type !== 'item') return;

    setGameState(prevState => {
      // Find item in inventory
      const itemIndex = prevState.inventory.findIndex(i => i.id === item.id);
      if (itemIndex < 0) return prevState;

      const inventoryItem = prevState.inventory[itemIndex] as Item;
      
      // Update player stats based on item effects
      const newStats = { ...prevState.playerStats };
      
      if (item.effects) {
        Object.entries(item.effects).forEach(([stat, value]) => {
          const statKey = stat as keyof PlayerStats;
          newStats[statKey] = Math.min(100, newStats[statKey] + value);
        });
      }

      // Remove item from inventory or decrease quantity
      let newInventory = [...prevState.inventory];
      if (inventoryItem.quantity > 1) {
        newInventory[itemIndex] = {
          ...inventoryItem,
          quantity: inventoryItem.quantity - 1,
        };
      } else {
        newInventory.splice(itemIndex, 1);
      }

      return {
        ...prevState,
        inventory: newInventory,
        playerStats: newStats,
      };
    });

    // Advance time when using items
    advanceTime(2);
  };

  // Drop an item from inventory
  const dropItem = (item: Resource | Item, amount: number = 1) => {
    setGameState(prevState => {
      const itemIndex = prevState.inventory.findIndex(i => i.id === item.id);
      if (itemIndex < 0) return prevState;

      const inventoryItem = prevState.inventory[itemIndex];
      let newInventory = [...prevState.inventory];

      if (inventoryItem.quantity > amount) {
        newInventory[itemIndex] = {
          ...inventoryItem,
          quantity: inventoryItem.quantity - amount,
        };
      } else {
        newInventory.splice(itemIndex, 1);
      }

      return {
        ...prevState,
        inventory: newInventory,
      };
    });
  };

  // Change a player stat directly
  const changePlayerStat = (stat: keyof PlayerStats, amount: number) => {
    setGameState(prevState => {
      const newValue = Math.max(0, Math.min(100, prevState.playerStats[stat] + amount));
      
      return {
        ...prevState,
        playerStats: {
          ...prevState.playerStats,
          [stat]: newValue,
        },
      };
    });
  };

  // Change current biome
  const changeBiome = (biome: 'forest' | 'desert' | 'mountains') => {
    setGameState(prevState => ({
      ...prevState,
      currentBiome: biome,
    }));
    
    // Traveling to a new biome takes time and energy
    advanceTime(30);
    changePlayerStat('energy', -20);
    decreaseStats();
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        collectResource,
        craftItem,
        useItem,
        dropItem,
        advanceTime,
        decreaseStats,
        changePlayerStat,
        changeBiome,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};