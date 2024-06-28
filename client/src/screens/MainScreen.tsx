import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, Dimensions, Alert, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Reel from '../components/Reel';
import CommentModal from '../components/CommentModal';

const { height } = Dimensions.get('window');
const reelHeight = height - 60; // Adjusting for bottom navigation bar height

const MainScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCommentModalVisible, setCommentModalVisible] = useState(false);
  const [reels, setReels] = useState([]);

  const fetchVideos = async () => {
    console.log('fetchVideos called');
    try {
      const response = await fetch('http://172.20.10.5:3001/api/videos');
      console.log('Response received:', response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const videos = await response.json();
      console.log('Videos fetched:', videos);
      const formattedReels = videos.map(video => ({
        id: video._id,
        type: video.type,
        title: video.title,
        description: video.description,
        videoUri: { uri: `http://172.20.10.5:3001/api/videos/files/${video.filename}` },
      }));
      setReels(formattedReels);
      console.log('Formatted reels:', formattedReels);
    } catch (error) {
      console.error('Failed to fetch videos', error);
      Alert.alert('Ошибка', 'Не удалось загрузить видео.');
    }
  };

  const onViewRef = useRef(viewableItems => {
    if (viewableItems.viewableItems.length > 0) {
      const index = viewableItems.viewableItems[0].index;
      setCurrentIndex(index);
      saveCurrentIndex(index);
    }
  });

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  const handleOpenComments = () => setCommentModalVisible(true);

  const handleCloseComments = () => setCommentModalVisible(false);

  const saveCurrentIndex = async index => {
    try {
      await AsyncStorage.setItem('@currentIndex', index.toString());
    } catch (e) {
      console.error('Failed to save the current index.', e);
    }
  };

  const loadCurrentIndex = async () => {
    try {
      const savedIndex = await AsyncStorage.getItem('@currentIndex');
      if (savedIndex !== null) {
        setCurrentIndex(parseInt(savedIndex, 10));
      }
    } catch (e) {
      console.error('Failed to load the current index.', e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      console.log('useFocusEffect called');
      loadCurrentIndex();
      fetchVideos();
      return () => {
        setCurrentIndex(-1); // Set an invalid index to stop all videos
      };
    }, [])
  );

  useEffect(() => {
    console.log('useEffect called');
    loadCurrentIndex();
    fetchVideos();
  }, []);

  return (
    <View style={styles.container}>
      {reels.length === 0 ? (
        <View style={styles.emptyContainer}></View>
      ) : (
        <FlatList
          data={reels}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) => (
            <View style={{ height: reelHeight }}>
              <Reel
                reel={item}
                isVisible={index === currentIndex}
                onCommentPress={handleOpenComments}
              />
            </View>
          )}
          pagingEnabled
          horizontal={false}
          showsVerticalScrollIndicator={false}
          snapToInterval={reelHeight}
          decelerationRate="fast"
          viewabilityConfig={viewConfigRef.current}
          onViewableItemsChanged={onViewRef.current}
        />
      )}
      <CommentModal visible={isCommentModalVisible} onClose={handleCloseComments} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 20,
    color: 'gray',
  },
});

export default MainScreen;
