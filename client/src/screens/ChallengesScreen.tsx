import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import axios from 'axios';

const ChallengesScreen = () => {
  const navigation = useNavigation();
  const [challenges, setChallenges] = useState([]);
  const [myChallenges, setMyChallenges] = useState([]);
  const [activeTab, setActiveTab] = useState('challenges');
  const [modalVisible, setModalVisible] = useState(false);
  const [newChallenge, setNewChallenge] = useState({
    title: '',
    description: '',
  });

  useFocusEffect(
    useCallback(() => {
      loadChallenges();
    }, [])
  );

  useEffect(() => {
    if (activeTab === 'myChallenges') {
      loadMyChallenges();
    }
  }, [activeTab]);

  const loadChallenges = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/chat');
      setChallenges(response.data);
    } catch (error) {
      console.error('Failed to load challenges.', error);
    }
  };

  const loadMyChallenges = () => {
    try {
      const joinedChallenges = localStorage.getItem('joinedChallenges');
      if (joinedChallenges !== null) {
        setMyChallenges(JSON.parse(joinedChallenges));
      }
    } catch (error) {
      console.error('Failed to load joined challenges.', error);
    }
  };

  const addChallenge = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/chat/', {
        ...newChallenge,
        createdBy: 'user123', // Replace with actual user ID
      });
      setChallenges([...challenges, response.data]);
      setModalVisible(false);
      setNewChallenge({ title: '', description: '' });
    } catch (error) {
      console.error('Failed to add challenge:', error);
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
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'challenges' && styles.activeTabButton]}
          onPress={() => setActiveTab('challenges')}
        >
          <Text style={styles.tabButtonText}>Челленджи</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={activeTab === 'myChallenges' ? myChallenges : challenges}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.list}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>Добавить челлендж</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Новый челлендж</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Название"
              placeholderTextColor="#888"
              value={newChallenge.title}
              onChangeText={text => setNewChallenge({ ...newChallenge, title: text })}
            />
            <TextInput
              style={[styles.modalInput, styles.modalDescription]}
              placeholder="Описание"
              placeholderTextColor="#888"
              value={newChallenge.description}
              onChangeText={text =>
                setNewChallenge({ ...newChallenge, description: text })
              }
              multiline={true}
              numberOfLines={4}
            />
            <TouchableOpacity style={styles.modalButton} onPress={addChallenge}>
              <Text style={styles.modalButtonText}>Создать</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButtonCancel}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonCancelText}>Отмена</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 28,
    marginTop: 68,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginHorizontal: 5,
    backgroundColor: '#6c757d',
  },
  activeTabButton: {
    backgroundColor: 'tomato',
  },
  tabButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
    color: '#ccc',
    marginBottom: 8,
  },
  list: {
    paddingBottom: 16,
  },
  addButton: {
    padding: 16,
    backgroundColor: 'tomato',
    borderRadius: 30,
    alignItems: 'center',
    marginTop: -30,
    position: 'relative',
    top: -40,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: '#1e1e1e',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#fff',
  },
  modalInput: {
    width: '100%',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#444',
    marginBottom: 16,
    backgroundColor: '#2c2c2c',
    color: '#fff',
  },
  modalDescription: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalButton: {
    padding: 10,
    backgroundColor: 'tomato',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalButtonCancel: {
    padding: 10,
    backgroundColor: '#6c757d',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtonCancelText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChallengesScreen;
