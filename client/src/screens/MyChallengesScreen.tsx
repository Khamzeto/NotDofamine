import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MyChallengesScreen = () => {
  const [joinedChallenges, setJoinedChallenges] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    loadJoinedChallenges();
  }, []);

  const loadJoinedChallenges = async () => {
    try {
      const joinedChallenges = await AsyncStorage.getItem('joinedChallenges');
      if (joinedChallenges !== null) {
        setJoinedChallenges(JSON.parse(joinedChallenges));
      }
    } catch (error) {
      console.error('Failed to load joined challenges.', error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.challengeItem}
      onPress={() => navigation.navigate('ChallengeDetail', { challenge: item })}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Мои челленджи</Text>
      <FlatList
        data={joinedChallenges}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#121212',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#fff',
  },
  challengeItem: {
    backgroundColor: '#1e1e1e',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
    color: '#bbb',
  },
});

export default MyChallengesScreen;
