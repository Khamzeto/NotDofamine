import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import { Video } from 'expo-av';
import { Ionicons, AntDesign, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import CommentModal from './CommentModal';

const { width, height } = Dimensions.get('window');
const reelHeight = height - 60; // Adjusting for bottom navigation bar height

const Reel = ({ reel, isVisible, onCommentPress }) => {
  if (!reel) {
    return null; // Return null if reel is not defined
  }

  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const lastTap = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isVisible) {
        videoRef.current
          .playAsync()
          .catch(error => console.error('Error playing video:', error));
        setIsPlaying(true);
      } else {
        videoRef.current
          .pauseAsync()
          .catch(error => console.error('Error pausing video:', error));
        setIsPlaying(false);
      }
    }
  }, [isVisible]);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pauseAsync().then(() => setIsPlaying(false));
      } else {
        videoRef.current.playAsync().then(() => setIsPlaying(true));
      }
    }
  };

  const toggleLike = (showHeartIcon = false) => {
    setIsLiked(!isLiked);
    if (showHeartIcon) {
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 1000);
    }
  };

  const handleTouch = () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;

    if (lastTap.current && now - lastTap.current < DOUBLE_PRESS_DELAY) {
      clearTimeout(timeoutRef.current);
      handleDoubleTap();
      lastTap.current = null;
    } else {
      lastTap.current = now;
      timeoutRef.current = setTimeout(() => {
        togglePlayPause();
        lastTap.current = null;
      }, DOUBLE_PRESS_DELAY);
    }
  };

  const handleDoubleTap = () => {
    toggleLike(true);
  };

  const handleCommentPress = () => setIsCommentModalVisible(true);

  const handleCommentModalClose = () => setIsCommentModalVisible(false);

  return (
    <View style={[styles.reelContainer, { height: reelHeight }]}>
      <TouchableWithoutFeedback onPress={handleTouch}>
        <View style={styles.videoTouchable}>
          <Video
            ref={videoRef}
            style={styles.video}
            source={reel.videoUri}
            resizeMode="cover"
            shouldPlay={isVisible}
            isLooping
            onError={error => console.error('Video error:', error)}
          />
          {!isPlaying && isVisible && (
            <View style={styles.playPauseIconContainer}>
              <Ionicons name="play" size={64} color="white" />
            </View>
          )}
          {showHeart && (
            <View style={styles.heartIconContainer}>
              <AntDesign name="heart" size={80} color="red" />
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
      <View style={styles.overlay}>
        <Text style={styles.reelType}>{reel.type.toUpperCase()}</Text>
        <Text style={styles.reelContent}>{reel.title}</Text>
      </View>
      <View style={styles.iconContainer}>
        <TouchableOpacity style={styles.commentIcon} onPress={onCommentPress}>
          <FontAwesome name="comment-o" size={32} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.repostIcon} onPress={() => alert('Repost!')}>
          <FontAwesome name="paper-plane-o" size={32} color="white" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.likeIcon} onPress={() => toggleLike()}>
        <AntDesign
          name={isLiked ? 'heart' : 'hearto'}
          size={32}
          color={isLiked ? 'red' : 'white'}
        />
      </TouchableOpacity>
      <CommentModal visible={isCommentModalVisible} onClose={handleCommentModalClose} />
    </View>
  );
};
const styles = StyleSheet.create({
  reelContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoTouchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    position: 'absolute',
    bottom: 100,
    left: 10,
  },
  reelType: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  reelContent: {
    fontSize: 16,
    color: 'white',
  },
  likeIcon: {
    position: 'absolute',
    top: '42%',
    right: 20,
  },
  commentIcon: {
    alignItems: 'center',
    marginTop: 20,
  },
  repostIcon: {
    alignItems: 'center',
    marginTop: 50,
  },
  playPauseIconContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -32 }, { translateY: -32 }],
  },
  heartIconContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -40 }, { translateY: -40 }],
  },
  iconContainer: {
    position: 'absolute',
    top: '50%',
    right: 20,
    alignItems: 'center',
  },
  iconText: {
    color: 'white',
    marginTop: 5,
  },
});

export default Reel;
