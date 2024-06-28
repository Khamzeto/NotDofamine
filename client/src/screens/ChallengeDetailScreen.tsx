import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChallengeDetailScreen = ({ route }) => {
  const { challenge } = route.params || {};
  const navigation = useNavigation();
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    checkIfJoined();
  }, []);

  const checkIfJoined = async () => {
    try {
      const joinedChallenges = await AsyncStorage.getItem('joinedChallenges');
      if (joinedChallenges !== null) {
        const parsedChallenges = JSON.parse(joinedChallenges);
        if (parsedChallenges.some(item => item.id === challenge.id)) {
          setJoined(true);
        }
      }
    } catch (error) {
      console.error('Failed to load joined challenges.', error);
    }
  };

  const joinChallenge = async () => {
    try {
      const joinedChallenges = await AsyncStorage.getItem('joinedChallenges');
      let parsedChallenges = joinedChallenges ? JSON.parse(joinedChallenges) : [];
      parsedChallenges.push(challenge);
      await AsyncStorage.setItem('joinedChallenges', JSON.stringify(parsedChallenges));
      setJoined(true);
      Alert.alert('Вы присоединились к челленджу!');
    } catch (error) {
      console.error('Failed to join challenge.', error);
    }
  };

  if (!challenge) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Ошибка: Челендж не найден</Text>
      </View>
    );
  }

  const renderContent = () => {
    switch (challenge.title) {
      case 'Бросить курить':
        return <StopSmokingTips />;
      case 'Бросить пить':
        return <StopDrinkingTips />;
      case 'Учить английские слова':
        return <LearnEnglishWords />;
      case 'Регулярные тренировки':
        return <ExerciseTips />;
      case 'Здоровое питание':
        return <HealthyEatingTips />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{challenge.title}</Text>
      <Text style={styles.description}>{challenge.description}</Text>
      {renderContent()}
      {!joined ? (
        <TouchableOpacity style={styles.joinButton} onPress={joinChallenge}>
          <Text style={styles.joinButtonText}>Присоединиться к челленджу</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => navigation.navigate('Chat', { challenge })}
        >
          <Text style={styles.chatButtonText}>Перейти в чат</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const StopSmokingTips = () => (
  <ScrollView style={styles.scrollView}>
    <Text style={styles.tip}>1. Установите дату, когда вы бросите курить.</Text>
    <Text style={styles.tip}>2. Сообщите своим близким и друзьям о своем решении.</Text>
    <Text style={styles.tip}>
      3. Избегайте триггеров, которые вызывают желание курить.
    </Text>
    <Text style={styles.tip}>
      4. Занимайтесь спортом, чтобы отвлечься от мысли о курении.
    </Text>
    <Text style={styles.tip}>
      5. Найдите замену курению, например, жевательную резинку.
    </Text>
  </ScrollView>
);

const StopDrinkingTips = () => (
  <ScrollView style={styles.scrollView}>
    <Text style={styles.tip}>1. Установите цели по уменьшению потребления алкоголя.</Text>
    <Text style={styles.tip}>2. Сообщите о своем решении близким и друзьям.</Text>
    <Text style={styles.tip}>3. Избегайте мест и ситуаций, где вы привыкли пить.</Text>
    <Text style={styles.tip}>4. Найдите здоровые способы расслабления и отдыха.</Text>
    <Text style={styles.tip}>
      5. Обратитесь за поддержкой к профессионалам, если необходимо.
    </Text>
  </ScrollView>
);

const LearnEnglishWords = () => {
  const [words, setWords] = useState([
    { id: '1', word: 'apple', translation: 'яблоко' },
    { id: '2', word: 'book', translation: 'книга' },
    { id: '3', word: 'car', translation: 'машина' },
    { id: '4', word: 'dog', translation: 'собака' },
    { id: '5', word: 'elephant', translation: 'слон' },
  ]);

  return (
    <FlatList
      data={words}
      renderItem={({ item }) => (
        <View style={styles.wordItem}>
          <Text style={styles.word}>{item.word}</Text>
          <Text style={styles.translation}>{item.translation}</Text>
        </View>
      )}
      keyExtractor={item => item.id}
    />
  );
};

const ExerciseTips = () => (
  <ScrollView style={styles.scrollView}>
    <Text style={styles.tip}>
      1. Начните с коротких тренировок и постепенно увеличивайте нагрузку.
    </Text>
    <Text style={styles.tip}>2. Найдите тренировку, которая вам нравится.</Text>
    <Text style={styles.tip}>3. Установите регулярное расписание тренировок.</Text>
    <Text style={styles.tip}>4. Следите за своим прогрессом и достижениями.</Text>
    <Text style={styles.tip}>
      5. Не забывайте отдыхать и восстанавливаться после тренировок.
    </Text>
  </ScrollView>
);

const HealthyEatingTips = () => (
  <ScrollView style={styles.scrollView}>
    <Text style={styles.tip}>1. Употребляйте больше овощей и фруктов.</Text>
    <Text style={styles.tip}>2. Сократите потребление сахара и соли.</Text>
    <Text style={styles.tip}>3. Пейте достаточное количество воды.</Text>
    <Text style={styles.tip}>4. Избегайте переработанных продуктов.</Text>
    <Text style={styles.tip}>5. Планируйте свои приемы пищи и готовьте дома.</Text>
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#fff',
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
    color: '#ddd',
  },
  scrollView: {
    padding: 16,
  },
  tip: {
    fontSize: 14,
    marginBottom: 8,
    color: '#ccc',
  },
  wordItem: {
    padding: 16,
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  word: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  translation: {
    fontSize: 14,
    color: '#bbb',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  joinButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'tomato',
    borderRadius: 10,
    alignItems: 'center',
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  chatButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'blue',
    borderRadius: 10,
    alignItems: 'center',
  },
  chatButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChallengeDetailScreen;
