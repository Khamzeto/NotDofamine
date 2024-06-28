import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';

const ChatScreen = ({ route }) => {
  const { userId, userNickname } = useContext(AuthContext);
  const { challenge } = route.params;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const ws = useRef(null);
  const chatId = challenge._id;

  useEffect(() => {
    // Load initial messages
    const loadMessages = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/chat/${chatId}/messages`);
        const data = await response.json();
        setMessages(data.reverse());
      } catch (error) {
        console.error('Failed to load messages:', error);
      }
    };

    loadMessages();

    // Establish WebSocket connection
    if (!ws.current) {
      ws.current = new WebSocket('ws://localhost:3001');

      ws.current.onopen = () => {
        console.log('WebSocket connection opened');
      };

      ws.current.onmessage = event => {
        const message = JSON.parse(event.data);
        console.log('Received WebSocket message:', message);

        if (message.type === 'message' && message.data.chatId === chatId) {
          setMessages(prevMessages => [message.data, ...prevMessages]);
        }
      };

      ws.current.onerror = error => {
        console.error('WebSocket error: ', error);
      };

      ws.current.onclose = () => {
        console.log('WebSocket connection closed');
      };
    }

    // Clean up WebSocket connection on unmount
    return () => {
      if (ws.current) {
        ws.current.close();
        ws.current = null;
      }
    };
  }, [chatId]);

  const sendMessage = () => {
    if (
      input.trim() &&
      chatId &&
      ws.current &&
      ws.current.readyState === WebSocket.OPEN
    ) {
      const message = {
        type: 'message',
        data: {
          userId,
          user: userNickname,
          text: input,
          chatId,
        },
      };

      ws.current.send(JSON.stringify(message));
      setInput('');
    } else {
      console.error('Invalid input or WebSocket not connected');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View
            style={[
              styles.message,
              item.user === userNickname ? styles.myMessage : styles.otherMessage,
            ]}
          >
            <Text style={styles.nickname}>
              {item.user}{' '}
              {item.userId === challenge.createdBy && (
                <Text style={styles.owner}> (владелец)</Text>
              )}
            </Text>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
        keyExtractor={item => item._id}
        style={styles.messagesList}
        inverted={true} // This inverts the FlatList to start from the bottom
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Напишите сообщение..."
          placeholderTextColor="#888"
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Ionicons name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  messagesList: {
    paddingHorizontal: 10,
  },
  message: {
    padding: 15,
    borderRadius: 20,
    marginVertical: 5,
    maxWidth: '80%',
  },
  myMessage: {
    backgroundColor: '#1f1f1f',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#333',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#fff',
  },
  nickname: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 14,
  },
  owner: {
    fontWeight: 'bold',
    color: '#FFD700', // Gold color for "владелец"
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#1f1f1f',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    backgroundColor: '#2c2c2c',
    color: '#fff',
  },
  sendButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 20,
  },
});

export default ChatScreen;
