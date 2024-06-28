import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { Avatar, Button, Card } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import * as VideoThumbnails from 'expo-video-thumbnails';
import Reel from '../components/Reel';
import { useFocusEffect } from '@react-navigation/native';

const ProfileScreen = ({ navigation }) => {
  const { userToken, userNickname, userId, signOut } = useContext(AuthContext);
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      const fetchReels = async () => {
        try {
          const response = await axios.get(
            `http://172.20.10.5:3001/api/videos/user/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          );
          const reelsWithThumbnails = await Promise.all(
            response.data
              .filter(reel => reel.userId === userId)
              .map(async reel => {
                try {
                  const { uri } = await VideoThumbnails.getThumbnailAsync(
                    `http://172.20.10.5:3001/api/videos/files/${reel.filename}`,
                    {
                      time: 15000,
                    }
                  );
                  return {
                    ...reel,
                    thumbnail: uri,
                    videoUri: {
                      uri: `http://172.20.10.5:3001/api/videos/files/${reel.filename}`,
                    },
                  };
                } catch (e) {
                  console.warn(e);
                  return {
                    ...reel,
                    videoUri: {
                      uri: `http://172.20.10.5:3001/api/videos/files/${reel.filename}`,
                    },
                  };
                }
              })
          );
          setReels(reelsWithThumbnails);
        } catch (error) {
          Alert.alert('Ошибка', 'Не удалось загрузить рилсы.');
        } finally {
          setLoading(false);
        }
      };

      fetchReels();

      // Возвращаем функцию для очистки, если это необходимо
      return () => {
        setReels([]);
        setLoading(true);
      };
    }, [userToken, userId])
  );

  const handleVideoPress = video => {
    setSelectedVideo(video);
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleVideoPress(item)} style={styles.itemContainer}>
      <Card style={styles.card}>
        <Card.Cover source={{ uri: item.thumbnail }} style={styles.thumbnail} />
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Ionicons
          name="settings-outline"
          size={24}
          color="white"
          onPress={() => navigation.navigate('Settings')}
        />
      </View>
      <View style={styles.profileHeader}>
        <Avatar.Image
          size={100}
          source={{ uri: 'https://aaps.space/kundli/andrew-tate/andrew-tate.jpg' }}
        />
        <Text style={styles.nickname}>{userNickname}</Text>
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>4</Text>
            <Text style={styles.statLabel}>Подписки</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Подписчики</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>2</Text>
            <Text style={styles.statLabel}>Лайки</Text>
          </View>
        </View>
        <Button mode="contained" onPress={signOut} style={styles.logoutButton}>
          Редактировать
        </Button>
        <Text style={styles.bio}>Вся мотивация здесь</Text>
      </View>
      <View style={styles.separator} />
      <FlatList
        data={reels}
        key={`flatlist_${reels.length}`} // Ensure FlatList re-renders when data changes
        keyExtractor={item => item._id}
        renderItem={renderItem}
        numColumns={3}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        visible={selectedVideo !== null}
        animationType="slide"
        onRequestClose={handleCloseVideo}
      >
        <View style={styles.videoContainer}>
          {selectedVideo && (
            <Reel
              reel={selectedVideo}
              isVisible={true}
              onCommentPress={() => Alert.alert('Comments Pressed')}
            />
          )}
          <Ionicons
            name="close"
            size={30}
            color="white"
            style={styles.checkIcon}
            onPress={handleCloseVideo}
          />
        </View>
      </Modal>
    </ScrollView>
  );
};

const { width } = Dimensions.get('window');
const itemWidth = (width - 48) / 3; // Adjusted for 3 columns

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    paddingTop: 50,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
  },
  text: {
    marginTop: 10,
    fontSize: 20,
    color: 'white',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#333',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  nickname: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  statsContainer: {
    flexDirection: 'row',
    marginVertical: 20,
  },
  stat: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  statLabel: {
    fontSize: 14,
    color: 'gray',
  },
  logoutButton: {
    marginTop: 10,
    backgroundColor: 'tomato',
    width: '50%',
  },
  bio: {
    marginTop: 10,
    fontSize: 14,
    textAlign: 'center',
    color: 'white',
  },
  separator: {
    borderBottomColor: '#444',
    borderBottomWidth: 1,
    marginVertical: 0,
  },
  row: {
    flex: 1,
    justifyContent: 'flex-start',
    marginVertical: 8,
    marginTop: 20,
  },
  itemContainer: {
    width: itemWidth,
    height: itemWidth * 1.5, // Maintain aspect ratio
    marginHorizontal: 6,
    borderRadius: 10, // Added border radius for a modern look
    overflow: 'hidden',
  },
  card: {
    backgroundColor: '#333',
  },
  thumbnail: {
    height: '100%',
    width: '100%',
  },
  listContent: {
    paddingHorizontal: 8,
    paddingBottom: 80,
  },
  noReelsText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 18,
    color: 'gray',
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  checkIcon: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
});

export default ProfileScreen;
