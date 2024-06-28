import React, { useState, useContext } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, TextInput, Text } from 'react-native-paper';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const LoginScreen = ({ navigation }) => {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!nickname || !password) {
      Alert.alert('Ошибка', 'Все поля обязательны для заполнения.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:3001/api/auth/login', {
        nickname,
        password,
      });
      setLoading(false);
      signIn(response.data.token, response.data.nickname, response.data.userId); // Передаем userId
      navigation.navigate('Main');
    } catch (error) {
      setLoading(false);
      Alert.alert('Ошибка', 'Ошибка при входе в систему.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Вход</Text>
      <TextInput
        label="Никнейм"
        value={nickname}
        onChangeText={setNickname}
        mode="outlined"
        style={styles.input}
        theme={{ colors: { text: 'white', placeholder: 'grey', primary: 'tomato' } }}
      />
      <TextInput
        label="Пароль"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        mode="outlined"
        style={styles.input}
        theme={{ colors: { text: 'white', placeholder: 'grey', primary: 'tomato' } }}
      />
      <Button
        mode="contained"
        onPress={handleLogin}
        loading={loading}
        style={styles.button}
      >
        Войти
      </Button>
      <Button onPress={() => navigation.navigate('Register')} style={styles.buttonText}>
        Нет аккаунта? Зарегистрироваться
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: 'white',
  },
  input: {
    marginBottom: 10,
    backgroundColor: 'white',
  },
  button: {
    marginTop: 10,
    backgroundColor: 'tomato',
  },
  buttonText: {
    marginTop: 10,
    color: 'tomato',
    textAlign: 'center',
  },
});

export default LoginScreen;
