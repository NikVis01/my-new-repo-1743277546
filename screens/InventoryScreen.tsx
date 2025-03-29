import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGame } from '../context/GameContext';
import { Resource } from '../data/resources';
import { Item } from '../data/items';

const InventoryScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { gameState, useItem, dropItem } = useGame();
  const [selectedTab, setSelectedTab] = useState<'all' | 'resources' | 'items'>('all');
  const [selectedItem, setSelectedItem] = useState<(Resource | Item) | null>(null);

  // Filter inventory based on selected tab
  const filteredInventory = gameState.inventory.filter(item => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'resources') return item.type === 'resource';
    if (selectedTab === 'items') return item.type === 'item';
    return false;
  });

  // Handle item use
  const handleUseItem = (item: Item) => {
    if (item.type === 'item') {
      if (['food', 'medicine'].includes(item.category)) {
        useItem(item);
        setSelectedItem(null);
      } else {
        Alert.alert(
          "Can't consume this item",
          "This item cannot be consumed. It may be used for crafting or other purposes."
        );
      }
    }
  };

  // Handle item drop
  const handleDropItem = (item: Resource | Item) => {
    Alert.alert(
      "Drop Item",
      `Are you sure you want to drop ${item.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Drop", onPress: () => {
          dropItem(item);
          setSelectedItem(null);
        }}
      ]
    );
  };

  // Render item details
  const renderItemDetails = () => {
    if (!selectedItem) return null;

    return (
      <View style={styles.itemDetails}>
        <Text style={styles.itemDetailIcon}>{selectedItem.icon}</Text>
        <Text style={styles.itemDetailName}>{selectedItem.name}</Text>
        <Text style={styles.itemDetailDescription}>{selectedItem.description}</Text>
        
        {selectedItem.type === 'item' && 'effects' && (
          <View style={styles.effectsContainer}>
            <Text style={styles.effectsTitle}>Effects:</Text>
            {selectedItem.effects?.health && (
              <Text style={styles.effectText}>
                <Ionicons name="heart" size={14} color="#A94438" /> Health: +{selectedItem.effects.health}
              </Text>
            )}
            {selectedItem.effects?.hunger && (
              <Text style={styles.effectText}>
                <Ionicons name="restaurant" size={14} color="#E3B23C" /> Hunger: +{selectedItem.effects.hunger}
              </Text>
            )}
            {selectedItem.effects?.thirst && (
              <Text style={styles.effectText}>
                <Ionicons name="water" size={14} color="#3C7A89" /> Thirst: +{selectedItem.effects.thirst}
              </Text>
            )}
            {selectedItem.effects?.energy && (
              <Text style={styles.effectText}>
                <Ionicons name="flash" size={14} color="#52A549" /> Energy: +{selectedItem.effects.energy}
              </Text>
            )}
          </View>
        )}
        
        <View style={styles.actionButtons}>
          {selectedItem.type === 'item' && ['food', 'medicine'].includes((selectedItem as Item).category) && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.useButton]}
              onPress={() => handleUseItem(selectedItem as Item)}
            >
              <Text style={styles.actionButtonText}>Use</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.dropButton]}
            onPress={() => handleDropItem(selectedItem)}
          >
            <Text style={styles.actionButtonText}>Drop</Text>
          </TouchableOpacity>
        </View>
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
        <Text style={styles.headerTitle}>Inventory</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Inventory tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'all' && styles.activeTab]}
          onPress={() => setSelectedTab('all')}
        >
          <Text style={styles.tabText}>All</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'resources' && styles.activeTab]}
          onPress={() => setSelectedTab('resources')}
        >
          <Text style={styles.tabText}>Resources</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'items' && styles.activeTab]}
          onPress={() => setSelectedTab('items')}
        >
          <Text style={styles.tabText}>Items</Text>
        </TouchableOpacity>
      </View>

      {/* Main content */}
      <View style={styles.content}>
        {/* Inventory grid */}
        <ScrollView style={styles.inventoryScroll}>
          <View style={styles.inventoryGrid}>
            {filteredInventory.length > 0 ? (
              filteredInventory.map(item => (
                <TouchableOpacity 
                  key={item.id}
                  style={[
                    styles.inventoryItem,
                    selectedItem?.id === item.id && styles.selectedItem
                  ]}
                  onPress={() => setSelectedItem(item)}
                >
                  <Text style={styles.inventoryItemIcon}>{item.icon}</Text>
                  <Text style={styles.inventoryItemName}>{item.name}</Text>
                  <Text style={styles.inventoryItemQuantity}>x{item.quantity}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.emptyInventoryText}>
                No items in inventory. Collect resources in the world.
              </Text>
            )}
          </View>
        </ScrollView>

        {/* Selected item details */}
        {renderItemDetails()}
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
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(227, 178, 60, 0.3)',
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#E3B23C',
  },
  tabText: {
    fontFamily: 'SF-Pro',
    fontSize: 16,
    color: '#F9F5EB',
  },
  content: {
    flex: 1,
  },
  inventoryScroll: {
    flex: 1,
    padding: 15,
  },
  inventoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  inventoryItem: {
    width: '30%',
    backgroundColor: 'rgba(249, 245, 235, 0.1)',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  selectedItem: {
    backgroundColor: 'rgba(227, 178, 60, 0.3)',
    borderWidth: 1,
    borderColor: '#E3B23C',
  },
  inventoryItemIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  inventoryItemName: {
    color: '#F9F5EB',
    fontFamily: 'SF-Pro',
    fontSize: 12,
    textAlign: 'center',
  },
  inventoryItemQuantity: {
    color: '#E3B23C',
    fontFamily: 'SF-Pro',
    fontSize: 12,
    marginTop: 5,
  },
  emptyInventoryText: {
    fontFamily: 'SF-Pro',
    fontSize: 16,
    color: '#F9F5EB',
    opacity: 0.7,
    textAlign: 'center',
    marginTop: 30,
    padding: 20,
  },
  itemDetails: {
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(227, 178, 60, 0.3)',
  },
  itemDetailIcon: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 10,
  },
  itemDetailName: {
    fontFamily: 'SF-Pro',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F9F5EB',
    textAlign: 'center',
    marginBottom: 5,
  },
  itemDetailDescription: {
    fontFamily: 'SF-Pro',
    fontSize: 14,
    color: '#F9F5EB',
    opacity: 0.8,
    textAlign: 'center',
    marginBottom: 15,
  },
  effectsContainer: {
    marginBottom: 15,
  },
  effectsTitle: {
    fontFamily: 'SF-Pro',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F9F5EB',
    marginBottom: 5,
  },
  effectText: {
    fontFamily: 'SF-Pro',
    fontSize: 14,
    color: '#F9F5EB',
    marginBottom: 3,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  useButton: {
    backgroundColor: '#52A549',
  },
  dropButton: {
    backgroundColor: '#A94438',
  },
  actionButtonText: {
    fontFamily: 'SF-Pro',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F9F5EB',
  },
});

export default InventoryScreen;