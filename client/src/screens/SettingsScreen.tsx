import React, { useState, useContext } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
import { Button, TextInput, Avatar, IconButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const SettingsScreen = ({ navigation }) => {
  const { userToken, userId } = useContext(AuthContext);
  const [nickname, setNickname] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [avatar, setAvatar] = useState(null);

  const handlePickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Требуется разрешение',
        'Необходимо разрешение на доступ к библиотеке медиафайлов'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      setAvatar(asset.uri);
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('nickname', nickname);
      formData.append('description', description);
      formData.append('link', link);
      if (avatar) {
        formData.append('avatar', {
          uri: avatar,
          type: 'image/jpeg',
          name: 'avatar.jpg',
        });
      }

      const response = await axios.post(
        `http://172.20.10.5:3001/api/users/update/${userId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      Alert.alert('Успех', 'Профиль успешно обновлен!');
    } catch (error) {
      console.error('Ошибка обновления профиля:', error);
      Alert.alert('Ошибка', 'Не удалось обновить профиль');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          color="white"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerText}>Настройки</Text>
      </View>
      <TouchableOpacity onPress={handlePickAvatar} style={styles.avatarContainer}>
        <Avatar.Image
          size={120}
          source={{ uri: avatar || 'https://placekitten.com/200/200' }}
          style={styles.avatar}
        />
        <Text style={styles.changeAvatarText}>Изменить аватар</Text>
      </TouchableOpacity>
      <TextInput
        label="Никнейм"
        value={nickname}
        onChangeText={setNickname}
        mode="outlined"
        style={styles.input}
        theme={{ colors: { text: 'white', placeholder: 'grey', primary: 'tomato' } }}
      />
      <TextInput
        label="Описание"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        style={styles.input}
        multiline
        theme={{ colors: { text: 'white', placeholder: 'grey', primary: 'tomato' } }}
      />
      <TextInput
        label="Ссылка"
        value={link}
        onChangeText={setLink}
        mode="outlined"
        style={styles.input}
        theme={{ colors: { text: 'white', placeholder: 'grey', primary: 'tomato' } }}
      />
      <Button mode="contained" onPress={handleSubmit} style={styles.button}>
        Сохранить изменения
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    backgroundColor: '#333',
  },
  changeAvatarText: {
    marginTop: 10,
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#1e1e1e',
  },
  button: {
    marginTop: 20,
    backgroundColor: 'tomato',
    padding: 10,
  },
});

export default SettingsScreen;
