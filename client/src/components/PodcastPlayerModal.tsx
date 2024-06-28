import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';
import { FontAwesome } from '@expo/vector-icons';

const PodcastPlayerModal = ({ podcast, isVisible, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [sound, setSound] = useState(null);

  useEffect(() => {
    if (isVisible) {
      loadSound();
    } else {
      unloadSound();
    }

    return () => {
      unloadSound();
    };
  }, [isVisible]);

  const loadSound = async () => {
    try {
      console.log('Loading sound...');
      const { sound, status } = await Audio.Sound.createAsync(
        typeof podcast.url === 'string' ? { uri: podcast.url } : podcast.url,
        { shouldPlay: isPlaying },
        onPlaybackStatusUpdate
      );
      setSound(sound);
      if (status.isLoaded) {
        setDuration(status.durationMillis / 1000);
      }
    } catch (error) {
      console.error('Error loading sound:', error);
    }
  };

  const unloadSound = async () => {
    if (sound) {
      console.log('Unloading sound...');
      await sound.unloadAsync();
      setSound(null);
    }
  };

  const onPlaybackStatusUpdate = status => {
    console.log('Playback status:', status); // Log the entire status object
    if (status.isLoaded) {
      setDuration(status.durationMillis / 1000);
      setCurrentTime(status.positionMillis / 1000);
      if (status.didJustFinish) {
        setIsPlaying(false);
        if (sound) {
          sound.setPositionAsync(0);
        }
      }
    } else if (status.error) {
      console.error('Playback status update error:', status.error);
    }
  };

  const togglePlayPause = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const onSliderValueChange = async value => {
    if (sound) {
      const position = value * 1000;
      await sound.setPositionAsync(position);
      setCurrentTime(value);
    }
  };

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose} style={styles.modal}>
      <View style={styles.content}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.nowPlaying}>NOW PLAYING</Text>
          <Image style={styles.coverImage} source={{ uri: podcast.cover }} />
          <Text style={styles.title}>{podcast.title}</Text>
          <Text style={styles.artist}>{podcast.artist}</Text>
          <View style={styles.controls}>
            <FontAwesome name="volume-down" style={styles.icon} />
            <FontAwesome name="repeat" style={styles.icon} />
            <FontAwesome name="random" style={styles.icon} />
            <FontAwesome name="plus" style={styles.icon} />
          </View>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={duration}
            value={currentTime}
            onValueChange={onSliderValueChange}
            minimumTrackTintColor="#ff6347"
            maximumTrackTintColor="#fff"
            thumbTintColor="#ff6347"
          />
          <View style={styles.timeContainer}>
            <Text style={styles.time}>{formatTime(currentTime)}</Text>
            <Text style={styles.time}>{formatTime(duration)}</Text>
          </View>
          <View style={styles.playbackControls}>
            <FontAwesome name="step-backward" style={styles.playPauseIcon} />
            <TouchableOpacity onPress={togglePlayPause}>
              <FontAwesome
                name={isPlaying ? 'pause' : 'play'}
                style={styles.playPauseIcon}
              />
            </TouchableOpacity>
            <FontAwesome name="step-forward" style={styles.playPauseIcon} />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const formatTime = seconds => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  content: {
    backgroundColor: '#2a2a2a',
    padding: 20,
    height: '80%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nowPlaying: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  coverImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    marginBottom: 5,
    textAlign: 'center',
  },
  artist: {
    color: '#b3b3b3',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginBottom: 20,
  },
  icon: {
    color: '#fff',
    fontSize: 24,
  },
  slider: {
    width: '90%',
    marginBottom: 20,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 20,
  },
  time: {
    color: '#b3b3b3',
    fontSize: 14,
  },
  playbackControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
  },
  playPauseIcon: {
    color: '#ff6347',
    fontSize: 36,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#ff6347',
    borderRadius: 25,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default PodcastPlayerModal;
