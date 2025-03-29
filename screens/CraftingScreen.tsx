import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGame } from '../context/GameContext';
import { Recipe } from '../data/recipes';
import { Item } from '../data/items';
import { Resource } from '../data/resources';

const CraftingScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { gameState, craftItem } = useGame();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Get all available categories from recipes
  const categories = ['all', ...new Set(gameState.unlockedRecipes.map(recipe => {
    const resultItem = gameState.inventory.find(item => 
      item.type === 'item' && item.id === recipe.result
    ) as Item | undefined;
    return resultItem?.category || 'misc';
  }))];

  // Filter recipes based on selected category
  const filteredRecipes = gameState.unlockedRecipes.filter(recipe => {
    if (selectedCategory === 'all') return true;
    
    const resultItem = gameState.inventory.find(item => 
      item.type === 'item' && item.id === recipe.result
    ) as Item | undefined;
    
    return resultItem?.category === selectedCategory;
  });

  // Check if player has all ingredients for a recipe
  const hasAllIngredients = (recipe: Recipe): boolean => {
    return recipe.ingredients.every(ingredient => {
      const inventoryItem = gameState.inventory.find(
        item => item.id === ingredient.id
      ) as Resource | Item | undefined;
      
      return inventoryItem && inventoryItem.quantity >= ingredient.quantity;
    });
  };

  // Handle crafting
  const handleCraft = (recipe: Recipe) => {
    if (!hasAllIngredients(recipe)) {
      Alert.alert(
        "Missing Ingredients",
        "You don't have all the required ingredients to craft this item."
      );
      return;
    }
    
    craftItem(recipe);
  };

  // Find item details by ID
  const getItemById = (id: string): Resource | Item | undefined => {
    return gameState.inventory.find(item => item.id === id);
  };

  // Render recipe details
  const renderRecipeDetails = () => {
    if (!selectedRecipe) return null;

    const resultItem = gameState.inventory.find(item => 
      item.type === 'item' && item.id === selectedRecipe.result
    ) as Item | undefined;

    const resultItemInInventory = gameState.inventory.find(
      item => item.id === selectedRecipe.result
    );

    return (
      <View style={styles.recipeDetails}>
        <View style={styles.recipeHeader}>
          <Text style={styles.recipeDetailName}>{selectedRecipe.name}</Text>
          <Text style={styles.recipeDetailIcon}>
            {resultItem?.icon || '🔨'}
          </Text>
        </View>
        
        <Text style={styles.recipeDetailDescription}>{selectedRecipe.description}</Text>
        
        <View style={styles.ingredientsContainer}>
          <Text style={styles.ingredientsTitle}>Required Ingredients:</Text>
          
          {selectedRecipe.ingredients.map(ingredient => {
            const inventoryItem = getItemById(ingredient.id);
            const hasEnough = inventoryItem && inventoryItem.quantity >= ingredient.quantity;
            
            return (
              <View key={ingredient.id} style={styles.ingredientRow}>
                <Text style={styles.ingredientIcon}>
                  {inventoryItem?.icon || '❓'}
                </Text>
                <Text style={styles.ingredientName}>
                  {inventoryItem?.name || ingredient.id}
                </Text>
                <Text style={[
                  styles.ingredientQuantity,
                  !hasEnough && styles.missingIngredient
                ]}>
                  {inventoryItem ? inventoryItem.quantity : 0}/{ingredient.quantity}
                </Text>
              </View>
            );
          })}
        </View>
        
        {resultItemInInventory && (
          <Text style={styles.ownedText}>
            You currently have: {resultItemInInventory.quantity}
          </Text>
        )}
        
        <TouchableOpacity 
          style={[
            styles.craftButton,
            !hasAllIngredients(selectedRecipe) && styles.disabledButton
          ]}
          onPress={() => handleCraft(selectedRecipe)}
          disabled={!hasAllIngredients(selectedRecipe)}
        >
          <Text style={styles.craftButtonText}>Craft Item</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#F9F5EB" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Crafting</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
        {categories.map(category => (
          <TouchableOpacity 
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.activeCategoryButton
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={styles.categoryButtonText}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Main content */}
      <View style={styles.content}>
        {/* Recipes grid */}
        <ScrollView style={styles.recipesScroll}>
          <View style={styles.recipesGrid}>
            {filteredRecipes.length > 0 ? (
              filteredRecipes.map(recipe => {
                const canCraft = hasAllIngredients(recipe);
                const resultItem = gameState.inventory.find(item => 
                  item.type === 'item' && item.id === recipe.result
                ) as Item | undefined;
                
                return (
                  <TouchableOpacity 
                    key={recipe.id}
                    style={[
                      styles.recipeItem,
                      selectedRecipe?.id === recipe.id && styles.selectedRecipe,
                      !canCraft && styles.unavailableRecipe
                    ]}
                    onPress={() => setSelectedRecipe(recipe)}
                  >
                    <Text style={styles.recipeItemIcon}>
                      {resultItem?.icon || '🔨'}
                    </Text>
                    <Text style={styles.recipeItemName}>{recipe.name}</Text>
                    {!canCraft && (
                      <View style={styles.missingBadge}>
                        <Text style={styles.missingBadgeText}>Missing</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })
            ) : (
              <Text style={styles.emptyRecipesText}>
                No recipes available in this category. Unlock more by crafting basic items.
              </Text>
            )}
          </View>
        </ScrollView>

        {/* Selected recipe details */}
        {renderRecipeDetails()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E392A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(227, 178, 60, 0.3)',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontFamily: 'SF-Pro',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F9F5EB',
  },
  categoriesScroll: {
    maxHeight: 50,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(227, 178, 60, 0.3)',
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginHorizontal: 5,
  },
  activeCategoryButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#E3B23C',
  },
  categoryButtonText: {
    fontFamily: 'SF-Pro',
    fontSize: 16,
    color: '#F9F5EB',
  },
  content: {
    flex: 1,
  },
  recipesScroll: {
    flex: 1,
    padding: 15,
  },
  recipesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  recipeItem: {
    width: '30%',
    backgroundColor: 'rgba(249, 245, 235, 0.1)',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginBottom: 15,
    position: 'relative',
  },
  selectedRecipe: {
    backgroundColor: 'rgba(227, 178, 60, 0.3)',
    borderWidth: 1,
    borderColor: '#E3B23C',
  },
  unavailableRecipe: {
    opacity: 0.6,
  },
  recipeItemIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  recipeItemName: {
    color: '#F9F5EB',
    fontFamily: 'SF-Pro',
    fontSize: 12,
    textAlign: 'center',
  },
  missingBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#A94438',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  missingBadgeText: {
    color: '#F9F5EB',
    fontFamily: 'SF-Pro',
    fontSize: 8,
    fontWeight: 'bold',
  },
  emptyRecipesText: {
    fontFamily: 'SF-Pro',
    fontSize: 16,
    color: '#F9F5EB',
    opacity: 0.7,
    textAlign: 'center',
    marginTop: 30,
    padding: 20,
  },
  recipeDetails: {
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(227, 178, 60, 0.3)',
  },
  recipeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  recipeDetailIcon: {
    fontSize: 32,
  },
  recipeDetailName: {
    fontFamily: 'SF-Pro',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F9F5EB',
  },
  recipeDetailDescription: {
    fontFamily: 'SF-Pro',
    fontSize: 14,
    color: '#F9F5EB',
    opacity: 0.8,
    marginBottom: 15,
  },
  ingredientsContainer: {
    marginBottom: 15,
  },
  ingredientsTitle: {
    fontFamily: 'SF-Pro',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F9F5EB',
    marginBottom: 8,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  ingredientIcon: {
    fontSize: 16,
    marginRight: 5,
  },
  ingredientName: {
    flex: 1,
    fontFamily: 'SF-Pro',
    fontSize: 14,
    color: '#F9F5EB',
  },
  ingredientQuantity: {
    fontFamily: 'SF-Pro',
    fontSize: 14,
    color: '#52A549',
  },
  missingIngredient: {
    color: '#A94438',
  },
  ownedText: {
    fontFamily: 'SF-Pro',
    fontSize: 14,
    color: '#E3B23C',
    marginBottom: 15,
  },
  craftButton: {
    backgroundColor: '#E3B23C',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: 'rgba(227, 178, 60, 0.3)',
  },
  craftButtonText: {
    fontFamily: 'SF-Pro',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F9F5EB',
  },
});

export default CraftingScreen;