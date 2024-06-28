import React, { useState } from 'react';
import { View, Button, Alert, ActivityIndicator } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';

const UploadVideo = () => {
  const [uploading, setUploading] = useState(false);

  const pickVideo = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'video/*',
    });

    if (result.type === 'success') {
      uploadVideo(result.uri);
    }
  };

  const uploadVideo = async uri => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', {
      uri,
      name: 'video.mp4',
      type: 'video/mp4',
    });

    try {
      const response = await axios.post('http://188.170.169.187:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploading(false);
      Alert.alert('Видео загружено', 'Ваше видео было успешно загружено!');
      console.log('Видео загружено: ', response.data.file);
    } catch (error) {
      console.error(error);
      setUploading(false);
      Alert.alert('Ошибка', 'Ошибка при загрузке видео.');
    }
  };

  return (
    <View>
      <Button title="Выбрать видео" onPress={pickVideo} />
      {uploading && <ActivityIndicator size="large" color="#0000ff" />}
    </View>
  );
};

export default UploadVideo;
