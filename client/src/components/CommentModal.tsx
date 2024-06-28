import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Portal } from 'react-native-portalize';

const commentsData = [
  {
    id: '1',
    user: 'saveleem',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    text: 'Нужно пахать,чтобы был успех',
    likes: 28400,
    replies: 122,
  },
  {
    id: '2',
    user: 'slavikusssss',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    text: 'Ребята нужно стараться,чтобы достичь успеха',
    likes: 19400,
    replies: 21,
  },
  {
    id: '3',
    user: 'ooh.moonchild',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    text: 'Пашите ребята!!',
    likes: 7186,
    replies: 14,
  },
];

const CommentModal = ({ visible, onClose }) => {
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['70%', '70%'], []);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(commentsData);

  useEffect(() => {
    if (visible) {
      bottomSheetRef.current.expand();
    }
  }, [visible]);

  const handleAddComment = () => {
    if (comment.trim()) {
      setComments([
        ...comments,
        {
          id: Date.now().toString(),
          user: 'Вы',
          avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
          text: comment,
          likes: 0,
          replies: 0,
        },
      ]);
      setComment('');
    }
  };

  const handleSheetChanges = index => {
    if (index === -1) {
      onClose();
    }
  };

  const handleScrollEndDrag = event => {
    const { contentOffset } = event.nativeEvent;
    if (contentOffset.y <= 0) {
      onClose();
    }
  };

  return (
    <Portal>
      <BottomSheet
        ref={bottomSheetRef}
        index={visible ? 0 : -1} // Automatically open to 70% when visible
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose={true}
        backgroundStyle={styles.bottomSheet}
        style={styles.bottomSheetContainer} // Ensure BottomSheet is on top
      >
        <View style={styles.indicatorContainer}>
          <View style={styles.indicator} />
        </View>
        <BottomSheetScrollView
          contentContainerStyle={styles.scrollView}
          onScrollEndDrag={handleScrollEndDrag}
        >
          {comments.map(item => (
            <View key={item.id} style={styles.comment}>
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              <View style={styles.commentContent}>
                <View style={styles.commentHeader}>
                  <Text style={styles.user}>{item.user}</Text>
                  <Text style={styles.time}>17нед.</Text>
                </View>
                <Text style={styles.text}>{item.text}</Text>
                <View style={styles.commentActions}>
                  <Text style={styles.reply}>Ответить</Text>
                  <MaterialIcons
                    name="favorite-border"
                    size={16}
                    color="grey"
                    style={styles.likeIcon}
                  />
                  <Text style={styles.likes}>{item.likes.toLocaleString()}</Text>
                </View>
              </View>
            </View>
          ))}
        </BottomSheetScrollView>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 280 : 20}
        >
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Оставьте комментарий"
              placeholderTextColor="grey"
              value={comment}
              onChangeText={setComment}
              onFocus={() => bottomSheetRef.current.expand()} // Expand to 90% when input is focused
            />
            <Ionicons name="send" size={24} color="white" onPress={handleAddComment} />
          </View>
        </KeyboardAvoidingView>
      </BottomSheet>
    </Portal>
  );
};

const styles = StyleSheet.create({
  bottomSheetContainer: {
    position: 'absolute',
    zIndex: 1000, // Set high zIndex to ensure it is on top
  },
  bottomSheet: {
    backgroundColor: 'black',
  },
  indicatorContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  indicator: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'white',
  },
  scrollView: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  comment: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  user: {
    fontWeight: 'bold',
    color: 'white',
    marginRight: 5,
  },
  time: {
    color: 'grey',
    fontSize: 12,
  },
  text: {
    color: 'white',
    marginVertical: 5,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reply: {
    color: 'grey',
    fontSize: 14,
    marginRight: 15,
  },
  likeIcon: {
    marginRight: 5,
  },
  likes: {
    color: 'grey',
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'grey',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  input: {
    flex: 1,
    color: 'white',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    marginRight: 15,
  },
});

export default CommentModal;
