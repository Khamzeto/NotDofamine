import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userNickname, setUserNickname] = useState(null);
  const [userId, setUserId] = useState(null); // Добавлено поле userId
  const [isLoading, setIsLoading] = useState(true);

  const signIn = async (token, nickname, id) => {
    setUserToken(token);
    setUserNickname(nickname);
    setUserId(id); // Сохраняем userId
    await AsyncStorage.setItem('userToken', token);
    await AsyncStorage.setItem('userNickname', nickname);
    await AsyncStorage.setItem('userId', id); // Сохраняем userId в AsyncStorage
  };

  const signOut = async () => {
    setUserToken(null);
    setUserNickname(null);
    setUserId(null); // Очищаем userId
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userNickname');
    await AsyncStorage.removeItem('userId'); // Удаляем userId из AsyncStorage
  };

  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const nickname = await AsyncStorage.getItem('userNickname');
      const id = await AsyncStorage.getItem('userId'); // Получаем userId из AsyncStorage
      setUserToken(token);
      setUserNickname(nickname);
      setUserId(id); // Устанавливаем userId
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{ userToken, userNickname, userId, signIn, signOut, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
