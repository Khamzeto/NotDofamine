import React, { useState, useContext } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import { Button, TextInput, Provider, Text } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { AuthContext } from '../context/AuthContext';

const UploadForm = ({ onUpload }) => {
  const { userToken, userId } = useContext(AuthContext); // Получаем userId из контекста
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);

  const handlePickFile = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission required',
        'Permission to access media library is required'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      const fileName = asset.uri.split('/').pop();
      const newUri = `${FileSystem.documentDirectory}${fileName}`;

      try {
        await FileSystem.copyAsync({ from: asset.uri, to: newUri });
        setFile({ uri: newUri, type: asset.mimeType, name: fileName });
      } catch (error) {
        console.error('File system error:', error);
        Alert.alert('Error', 'Error processing the video file.');
      }
    }
  };

  const handleSubmit = async () => {
    if (file && type && title && description) {
      try {
        const formData = new FormData();
        formData.append('file', {
          uri: file.uri,
          type: file.type,
          name: file.name,
          userId: userId,
        });
        formData.append('type', type);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('userId', userId); // Добавляем userId

        const uploadResponse = await fetch('http://172.20.10.5:3001/api/videos/upload', {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${userToken}`, // Добавляем токен для авторизации
          },
        });

        if (!uploadResponse.ok) {
          throw new Error('Network response was not ok');
        }

        const responseData = await uploadResponse.json();
        onUpload(responseData.file);
        Alert.alert('Видео загружено', 'Ваше видео было успешно загружено!');
      } catch (error) {
        console.error('Error uploading video:', error);
        Alert.alert('Ошибка', 'Ошибка при загрузке видео.');
      }
    } else {
      Alert.alert('Ошибка', 'Все поля обязательны для заполнения.');
    }
  };

  return (
    <Provider>
      <View style={styles.container}>
        <Text style={styles.modalTitle}>Загрузить Видео</Text>
        <TextInput
          style={styles.input}
          label="Тип"
          value={type}
          onChangeText={setType}
          mode="outlined"
          theme={{ colors: { text: 'white', placeholder: 'gray', primary: 'tomato' } }}
        />
        <TextInput
          style={styles.input}
          label="Название"
          value={title}
          onChangeText={setTitle}
          mode="outlined"
          theme={{ colors: { text: 'white', placeholder: 'gray', primary: 'tomato' } }}
        />
        <TextInput
          style={styles.input}
          label="Описание"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          multiline
          theme={{ colors: { text: 'white', placeholder: 'gray', primary: 'tomato' } }}
        />
        <Button mode="contained" onPress={handlePickFile} style={styles.button}>
          Выбрать Видео
        </Button>
        <Button mode="contained" onPress={handleSubmit} style={styles.button}>
          Загрузить
        </Button>
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1e1e1e',
  },
  input: {
    marginBottom: 10,
    backgroundColor: '#333',
  },
  button: {
    marginTop: 10,
    backgroundColor: 'tomato',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
    color: 'white',
    textAlign: 'center',
  },
});

export default UploadForm;
