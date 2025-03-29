import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGame } from '../context/GameContext';
import { resources, Resource } from '../data/resources';

const GameScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { gameState, collectResource, advanceTime, decreaseStats, changeBiome } = useGame();
  const [gameInterval, setGameInterval] = useState<NodeJS.Timeout | null>(null);

  // Start game timer
  useEffect(() => {
    const interval = setInterval(() => {
      advanceTime(1);
      decreaseStats();
    }, 3000); // Every 3 seconds in real time = 1 minute in game time
    
    setGameInterval(interval);
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  // Available resources based on current biome
  const availableResources = resources.filter(
    resource => resource.biome === gameState.currentBiome || resource.biome === 'all'
  );

  // Handle resource collection
  const handleResourceCollection = (resource: Resource) => {
    // Check if player has enough energy
    if (gameState.playerStats.energy < resource.energyCost) {
      Alert.alert("Not enough energy", "You need to rest or eat food to regain energy.");
      return;
    }
    
    collectResource(resource);
  };

  // Format time string
  const formatTime = () => {
    const { hour, minute } = gameState.time;
    const formattedHour = hour % 12 || 12;
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedMinute = minute < 10 ? `0${minute}` : minute;
    return `${formattedHour}:${formattedMinute} ${period}`;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header with stats */}
      <View style={styles.header}>
        <View style={styles.statBar}>
          <View style={styles.statItem}>
            <Ionicons name="heart" size={16} color="#A94438" />
            <View style={[styles.statBarBackground, { width: 50 }]}>
              <View style={[styles.statBarFill, { width: gameState.playerStats.health / 2, backgroundColor: '#A94438' }]} />
            </View>
          </View>

          <View style={styles.statItem}>
            <Ionicons name="restaurant" size={16} color="#E3B23C" />
            <View style={[styles.statBarBackground, { width: 50 }]}>
              <View style={[styles.statBarFill, { width: gameState.playerStats.hunger / 2, backgroundColor: '#E3B23C' }]} />
            </View>
          </View>

          <View style={styles.statItem}>
            <Ionicons name="water" size={16} color="#3C7A89" />
            <View style={[styles.statBarBackground, { width: 50 }]}>
              <View style={[styles.statBarFill, { width: gameState.playerStats.thirst / 2, backgroundColor: '#3C7A89' }]} />
            </View>
          </View>

          <View style={styles.statItem}>
            <Ionicons name="flash" size={16} color="#52A549" />
            <View style={[styles.statBarBackground, { width: 50 }]}>
              <View style={[styles.statBarFill, { width: gameState.playerStats.energy / 2, backgroundColor: '#52A549' }]} />
            </View>
          </View>
        </View>

        <View style={styles.timeContainer}>
          <Ionicons 
            name={gameState.time.isDayTime ? "sunny" : "moon"} 
            size={16} 
            color={gameState.time.isDayTime ? "#E3B23C" : "#CCCCFF"} 
          />
          <Text style={styles.timeText}>Day {gameState.time.day} - {formatTime()}</Text>
        </View>
      </View>

      {/* Main game content */}
      <ScrollView style={styles.scrollContent}>
        <View style={styles.biomeSection}>
          <Text style={styles.sectionTitle}>Current Location: {gameState.currentBiome.charAt(0).toUpperCase() + gameState.currentBiome.slice(1)}</Text>
          
          <View style={styles.biomeSelector}>
            <TouchableOpacity 
              style={[
                styles.biomeButton, 
                gameState.currentBiome === 'forest' && styles.activeBiome
              ]}
              onPress={() => changeBiome('forest')}
            >
              <Text style={styles.biomeButtonText}>Forest</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.biomeButton, 
                gameState.currentBiome === 'desert' && styles.activeBiome
              ]}
              onPress={() => changeBiome('desert')}
            >
              <Text style={styles.biomeButtonText}>Desert</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.biomeButton, 
                gameState.currentBiome === 'mountains' && styles.activeBiome
              ]}
              onPress={() => changeBiome('mountains')}
            >
              <Text style={styles.biomeButtonText}>Mountains</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.resourcesSection}>
          <Text style={styles.sectionTitle}>Available Resources</Text>
          
          <View style={styles.resourceGrid}>
            {availableResources.map(resource => (
              <TouchableOpacity 
                key={resource.id}
                style={styles.resourceItem}
                onPress={() => handleResourceCollection(resource)}
              >
                <Text style={styles.resourceIcon}>{resource.icon}</Text>
                <Text style={styles.resourceName}>{resource.name}</Text>
                <Text style={styles.resourceRarity}>
                  {resource.rarity === 'common' ? '⭐' : resource.rarity === 'uncommon' ? '⭐⭐' : '⭐⭐⭐'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton}>
          <Ionicons name="map" size={24} color="#F9F5EB" />
          <Text style={styles.navText}>Map</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigation.navigate('Inventory' as never)}
        >
          <Ionicons name="briefcase" size={24} color="#F9F5EB" />
          <Text style={styles.navText}>Inventory</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigation.navigate('Crafting' as never)}
        >
          <Ionicons name="hammer" size={24} color="#F9F5EB" />
          <Text style={styles.navText}>Craft</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navButton}>
          <Ionicons name="bed" size={24} color="#F9F5EB" />
          <Text style={styles.navText}>Rest</Text>
        </TouchableOpacity>
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
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(227, 178, 60, 0.3)',
  },
  statBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statBarBackground: {
    height: 8,
    backgroundColor: 'rgba(249, 245, 235, 0.2)',
    borderRadius: 4,
    marginLeft: 4,
    overflow: 'hidden',
  },
  statBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    color: '#F9F5EB',
    fontFamily: 'SF-Pro',
    fontSize: 12,
    marginLeft: 5,
  },
  scrollContent: {
    flex: 1,
    padding: 15,
  },
  biomeSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'SF-Pro',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F9F5EB',
    marginBottom: 10,
  },
  biomeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  biomeButton: {
    flex: 1,
    padding: 10,
    backgroundColor: 'rgba(249, 245, 235, 0.1)',
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  activeBiome: {
    backgroundColor: 'rgba(227, 178, 60, 0.3)',
    borderWidth: 1,
    borderColor: '#E3B23C',
  },
  biomeButtonText: {
    color: '#F9F5EB',
    fontFamily: 'SF-Pro',
    fontSize: 14,
  },
  resourcesSection: {
    marginBottom: 20,
  },
  resourceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  resourceItem: {
    width: '30%',
    backgroundColor: 'rgba(249, 245, 235, 0.1)',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  resourceIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  resourceName: {
    color: '#F9F5EB',
    fontFamily: 'SF-Pro',
    fontSize: 12,
    textAlign: 'center',
  },
  resourceRarity: {
    marginTop: 5,
    fontSize: 10,
    color: '#E3B23C',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(227, 178, 60, 0.3)',
    paddingBottom: insets.bottom,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  navText: {
    color: '#F9F5EB',
    fontFamily: 'SF-Pro',
    fontSize: 12,
    marginTop: 5,
  },
});

export default GameScreen;