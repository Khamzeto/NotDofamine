import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, TextInput, Text } from 'react-native-paper';
import axios from 'axios';

const RegisterScreen = ({ navigation }) => {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!nickname || !password || !confirmPassword) {
      Alert.alert('Ошибка', 'Все поля обязательны для заполнения.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Ошибка', 'Пароли не совпадают.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:3001/api/auth/register', {
        nickname,
        password,
      });
      setLoading(false);
      Alert.alert('Регистрация успешна', 'Вы успешно зарегистрировались!');
      navigation.navigate('Login');
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.data) {
        Alert.alert('Ошибка', error.response.data.error || 'Ошибка при регистрации.');
      } else {
        Alert.alert('Ошибка', 'Ошибка при регистрации.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Регистрация</Text>
      <TextInput
        label="Никнейм"
        value={nickname}
        onChangeText={setNickname}
        mode="outlined"
        style={styles.input}
        theme={{
          colors: {
            text: 'black',
            placeholder: 'grey',
            primary: 'tomato',
            background: 'white',
          },
        }}
      />
      <TextInput
        label="Пароль"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        mode="outlined"
        style={styles.input}
        theme={{
          colors: {
            text: 'black',
            placeholder: 'grey',
            primary: 'tomato',
            background: 'white',
          },
        }}
      />
      <TextInput
        label="Подтвердите пароль"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        mode="outlined"
        style={styles.input}
        theme={{
          colors: {
            text: 'black',
            placeholder: 'grey',
            primary: 'tomato',
            background: 'white',
          },
        }}
      />
      <Button
        mode="contained"
        onPress={handleRegister}
        loading={loading}
        style={styles.button}
      >
        Зарегистрироваться
      </Button>
      <Button onPress={() => navigation.navigate('Login')} style={styles.buttonText}>
        Уже есть аккаунт? Войти
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

export default RegisterScreen;
