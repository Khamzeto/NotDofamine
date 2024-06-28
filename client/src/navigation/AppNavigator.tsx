import React, { useContext, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import {
  Ionicons,
  MaterialIcons,
  FontAwesome,
  MaterialCommunityIcons,
} from '@expo/vector-icons';

import ProfileScreen from '../screens/ProfileScreen';
import ArticlesScreen from '../screens/ArticlesScreen';
import MainScreen from '../screens/MainScreen';
import UploadForm from '../utils/UploadForm';
import { AuthContext } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ChallengesScreen from '../screens/ChallengesScreen';
import ChallengeDetailScreen from '../screens/ChallengeDetailScreen';
import ChatScreen from '../screens/ChatScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const CustomTabBarButton = ({ children, onPress }) => (
  <TouchableOpacity style={styles.customButtonContainer} onPress={onPress}>
    <View style={styles.customButton}>{children}</View>
  </TouchableOpacity>
);

const PublishScreen = () => {
  return null;
};

const MainTabNavigator = ({ navigation }) => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = 'home-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        } else if (route.name === 'Reels') {
          iconName = 'video-library';
          return <MaterialIcons name={iconName} size={size} color={color} />;
        } else if (route.name === 'Profile') {
          iconName = 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        } else if (route.name === 'Articles') {
          iconName = 'book';
          return <FontAwesome name={iconName} size={size} color={color} />;
        } else if (route.name === 'Challenges') {
          iconName = 'check-circle-outline';
          return <MaterialIcons name={iconName} size={size} color={color} />;
        }
      },
      tabBarStyle: {
        backgroundColor: 'black',
      },
    })}
    tabBarOptions={{
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
      showLabel: false,
    }}
  >
    <Tab.Screen
      name="Challenges"
      component={ChallengesScreen}
      options={{ headerShown: false }}
    />
    <Tab.Screen name="Reels" component={MainScreen} options={{ headerShown: false }} />

    <Tab.Screen
      name="Publish"
      component={PublishScreen}
      options={{
        tabBarButton: props => (
          <CustomTabBarButton {...props} onPress={() => navigation.navigate('Upload')}>
            <MaterialCommunityIcons name="plus-box" size={30} color="white" />
          </CustomTabBarButton>
        ),
      }}
    />
    <Tab.Screen
      name="Articles"
      component={ArticlesScreen}
      options={{ headerShown: false }}
    />

    <Tab.Screen
      name="Profile"
      component={ProfileStack}
      options={{ headerShown: false }}
    />
  </Tab.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const { userToken, isLoading } = useContext(AuthContext);
  const [uploading, setUploading] = useState(false);

  const handleUpload = (uploadedFile, navigation) => {
    console.log('Uploaded file:', uploadedFile);
    setUploading(false);
    navigation.goBack();
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.tabContainer}>
      <Stack.Navigator screenOptions={{ presentation: 'modal' }}>
        {userToken ? (
          <>
            <Stack.Screen
              name="Main"
              component={MainTabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Upload" options={{ headerShown: false }}>
              {props => (
                <UploadForm
                  {...props}
                  onUpload={file => handleUpload(file, props.navigation)}
                />
              )}
            </Stack.Screen>
            <Stack.Screen
              name="ChallengeDetail"
              component={ChallengeDetailScreen}
              initialParams={{ userId: 'uniqueUserId', userName: 'User' }}
              options={{
                headerStyle: { backgroundColor: '#121212' }, // Dark background color for the header
                headerTintColor: 'transparent', // White color for the header text and back arrow
                headerBackTitleVisible: false, // Hide the text next to the back arrow
              }} // Замените на реальные данные пользователя
            />
            <Stack.Screen
              name="Chat"
              component={ChatScreen}
              options={{
                headerStyle: { backgroundColor: '#121212' }, // Dark background color for the header
                headerTintColor: '#fff', // White color for the header text and back arrow
                headerBackTitleVisible: false, // Hide the text next to the back arrow
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flex: 1,
    zIndex: -999,
    position: 'relative',
  },
  customButtonContainer: {
    top: -30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'tomato',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7F5DF0',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  plus: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadingText: {
    color: '#fff',
    marginTop: 10,
  },
});

export default AppNavigator;
