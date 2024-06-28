import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { Host, PortalProvider } from 'react-native-portalize';
import { Audio } from 'expo-av';
import { requestForegroundPermissionsAsync } from 'expo-location'; // Update this to the correct module

import CommentModal from './src/components/CommentModal';
import { AuthProvider } from './src/context/AuthContext';
import { LogBox } from 'react-native';

LogBox.ignoreAllLogs();

const getPermissions = async () => {
  const { status } = await requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    alert('Permission for audio recording is required!');
  }
};

const App: React.FC = () => {
  useEffect(() => {
    getPermissions();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <NavigationContainer>
          <Host>
            <AppNavigator />
          </Host>
        </NavigationContainer>
      </AuthProvider>
    </GestureHandlerRootView>
  );
};

export default App;
