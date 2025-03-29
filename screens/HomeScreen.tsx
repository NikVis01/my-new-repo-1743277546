import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      
      <LinearGradient
        colors={['rgba(30, 57, 42, 0.9)', 'rgba(30, 57, 42, 0.7)']}
        style={styles.overlay}
      />
      
      <View style={styles.content}>
        <Text style={styles.title}>Survival Craft</Text>
        <Text style={styles.subtitle}>A Wilderness Adventure</Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate('Game' as never)}
          >
            <Text style={styles.buttonText}>Start Game</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]}
          >
            <Text style={styles.buttonText}>How to Play</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Craft. Survive. Explore.</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E392A',
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontFamily: 'NewYork',
    fontSize: 42,
    color: '#F9F5EB',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'SF-Pro',
    fontSize: 18,
    color: '#E3B23C',
    marginBottom: 60,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  button: {
    backgroundColor: '#E3B23C',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#E3B23C',
  },
  buttonText: {
    fontFamily: 'SF-Pro',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F9F5EB',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
  },
  footerText: {
    fontFamily: 'SF-Pro',
    fontSize: 14,
    color: '#F9F5EB',
    opacity: 0.7,
  },
});

export default HomeScreen;